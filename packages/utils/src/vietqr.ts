import { findBankByCode } from '@tronhanh/constants';

/**
 * Sinh chuỗi thanh toán VietQR theo chuẩn EMVCo (NAPAS).
 *
 * **Vì sao tự sinh thay vì gọi `img.vietqr.io`:** quicklink của VietQR nhận số tài khoản, tên
 * chủ tài khoản và số tiền qua **URL query** — mỗi lần render một hóa đơn là một lần gửi thông
 * tin tài chính của chủ trọ sang máy chủ bên thứ ba. Ở đây chuỗi được dựng và vẽ hoàn toàn
 * trên máy người dùng.
 *
 * ⚠️ **Đây là loại code sai mà không thấy:** CRC lệch một bit thì mã QR vẫn hiện ra đẹp đẽ,
 * chỉ có app ngân hàng là không đọc được. Vì vậy hàm này là **hàm thuần**, không đụng React,
 * để kiểm được bằng test.
 *
 * Cấu trúc TLV (tag – length – value), độ dài luôn 2 chữ số:
 * ```
 *   00  Payload Format Indicator      "01"
 *   01  Point of Initiation           "11" tĩnh · "12" động (có số tiền)
 *   38  Merchant Account Information
 *       00  GUID                      "A000000727"
 *       01  Beneficiary Organization
 *           00  Acquirer ID (BIN)     6 số
 *           01  Merchant/Consumer ID  số tài khoản
 *       02  Service Code              "QRIBFTTA" (chuyển tới tài khoản)
 *   53  Transaction Currency          "704" (VND)
 *   54  Transaction Amount            chỉ có khi truyền `amount`
 *   58  Country Code                  "VN"
 *   62  Additional Data
 *       08  Purpose of Transaction    nội dung chuyển khoản
 *   63  CRC                           CRC-16/CCITT-FALSE, 4 ký tự hex hoa
 * ```
 */

const GUID_VIETQR = 'A000000727';
const SERVICE_CODE_TO_ACCOUNT = 'QRIBFTTA';
const CURRENCY_VND = '704';
const COUNTRY_VN = 'VN';

/** NAPAS giới hạn nội dung chuyển khoản 25 ký tự. */
const MAX_PURPOSE_LENGTH = 25;

/** Số tài khoản hợp lệ để dựng QR: 6–19 chữ số. */
export const VIETQR_ACCOUNT_PATTERN = /^\d{6,19}$/;

/** Ghép một trường TLV. Độ dài **luôn** 2 chữ số, pad 0 ở đầu. */
function tlv(tag: string, value: string): string {
  return `${tag}${value.length.toString().padStart(2, '0')}${value}`;
}

/**
 * CRC-16/CCITT-FALSE — poly `0x1021`, init `0xFFFF`, không reflect, xorout `0x0000`.
 * Tính trên toàn bộ chuỗi **đã** bao gồm `"6304"` ở cuối.
 */
export function crc16CcittFalse(input: string): string {
  let crc = 0xffff;
  for (let index = 0; index < input.length; index += 1) {
    crc ^= input.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Bỏ dấu tiếng Việt và ký tự lạ khỏi nội dung chuyển khoản.
 *
 * Một số app ngân hàng không nhận unicode ở trường `62.08` — để nguyên "Phòng P101 kỳ 2026-08"
 * thì QR quét ra nội dung lỗi hoặc bị từ chối.
 */
export function toAsciiPurpose(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^0-9A-Za-z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_PURPOSE_LENGTH);
}

export interface VietQrInput {
  /** `Property.bankName` — mã ngân hàng trong `VIETNAM_BANKS`. */
  bankCode: string | null | undefined;
  accountNumber: string | null | undefined;
  /** Số tiền VND. Bỏ trống hoặc 0 ⇒ QR **tĩnh**, người chuyển tự nhập số tiền. */
  amount?: number | null;
  /** Nội dung chuyển khoản, sẽ được bỏ dấu tự động. */
  purpose?: string;
}

/**
 * Kết quả dựng chuỗi.
 *
 * Trả lý do bằng tiếng Việt khi thiếu dữ liệu thay vì ném lỗi hay trả chuỗi rỗng — màn hóa đơn
 * và màn cấu hình khu đều cần giải thích cho chủ trọ **tại sao** chưa có QR.
 */
export type VietQrResult =
  { readonly ok: true; readonly payload: string } | { readonly ok: false; readonly reason: string };

export function buildVietQrPayload(input: VietQrInput): VietQrResult {
  const bank = findBankByCode(input.bankCode);
  if (!bank) {
    return { ok: false, reason: 'Khu trọ chưa chọn ngân hàng nhận tiền.' };
  }

  const account = (input.accountNumber ?? '').trim();
  if (!VIETQR_ACCOUNT_PATTERN.test(account)) {
    return { ok: false, reason: 'Khu trọ chưa có số tài khoản hợp lệ.' };
  }

  const beneficiary = tlv('00', bank.bin) + tlv('01', account);
  const merchantAccountInfo =
    tlv('00', GUID_VIETQR) + tlv('01', beneficiary) + tlv('02', SERVICE_CODE_TO_ACCOUNT);

  // Số tiền phải là số nguyên dương; VND không có phần thập phân.
  const rawAmount = Number(input.amount ?? 0);
  const hasAmount = Number.isFinite(rawAmount) && rawAmount > 0;

  let payload =
    tlv('00', '01') +
    tlv('01', hasAmount ? '12' : '11') +
    tlv('38', merchantAccountInfo) +
    tlv('53', CURRENCY_VND);

  if (hasAmount) {
    payload += tlv('54', String(Math.round(rawAmount)));
  }

  payload += tlv('58', COUNTRY_VN);

  const purpose = toAsciiPurpose(input.purpose ?? '');
  if (purpose) {
    payload += tlv('62', tlv('08', purpose));
  }

  // `"6304"` phải nằm trong dữ liệu được tính CRC.
  const withCrcTag = `${payload}6304`;
  return { ok: true, payload: `${withCrcTag}${crc16CcittFalse(withCrcTag)}` };
}
