import { toAsciiPurpose } from './vietqr';

/**
 * Mã hóa đơn và nội dung chuyển khoản VietQR.
 *
 * **Vì sao cần một hàm riêng cho việc tưởng như là nối chuỗi:** NAPAS giới hạn nội dung chuyển
 * khoản **25 ký tự**, và `toAsciiPurpose` cắt cụt phần thừa **trong im lặng**. Nội dung tự
 * nhiên nhất — "Tiền phòng P101 kỳ 2026-08" — sau khi bỏ dấu dài 26 ký tự, nên nó bị cắt mất
 * chữ số cuối của kỳ và người ở chuyển khoản với nội dung sai. Không có lỗi nào hiện ra: mã
 * QR vẫn quét được, tiền vẫn vào tài khoản, chỉ có chủ trọ là không đối chiếu được.
 *
 * Vì vậy nội dung ở đây được rút gọn **chủ động theo thang bậc**, và luôn giữ đủ hai thứ dùng
 * để đối chiếu trên sao kê: **mã phòng** và **kỳ**.
 */

/** NAPAS giới hạn nội dung chuyển khoản 25 ký tự. Lặp lại ở đây để test khóa được con số. */
export const MAX_TRANSFER_NOTE_LENGTH = 25;

export interface InvoiceNoteInput {
  /** `Room.roomCode` — tối đa 20 ký tự theo `roomCodeSchema`. */
  roomCode: string;
  /** Kỳ hóa đơn `YYYY-MM`. */
  period: string;
}

/**
 * Mã hóa đơn hiển thị cho người: `P101-202608`.
 *
 * Một phòng chỉ có một hợp đồng `Active` (BR-006) và một hóa đơn mỗi kỳ, nên cặp
 * (mã phòng, kỳ) đã đủ định danh mà vẫn đọc được — hơn hẳn một chuỗi uuid mà chủ trọ không
 * thể gõ lại khi tra sao kê ngân hàng.
 */
export function buildInvoiceCode({ roomCode, period }: InvoiceNoteInput): string {
  return `${roomCode.trim()}-${period.replace('-', '')}`;
}

/**
 * Nội dung chuyển khoản, **luôn** ≤ 25 ký tự ASCII.
 *
 * Thang bậc rút gọn, dừng ở bậc đầu tiên vừa đủ chỗ:
 * 1. `HD P101 2026 08`   — dễ đọc nhất
 * 2. `P101 2026 08`      — bỏ tiền tố
 * 3. `P101 202608`       — viết liền kỳ
 * 4. `PHONG TANG 3 202608` — cắt bớt **mã phòng**, giữ nguyên kỳ
 *
 * Chuỗi trả về đã ở **đúng dạng sẽ nằm trong mã QR**: `toAsciiPurpose` biến mọi ký tự không
 * phải chữ-số thành khoảng trắng, nên gạch nối của kỳ không sống sót — dựng nội dung với
 * `2026-08` rồi khoe ra màn hình là hứa với chủ trọ một chuỗi mà ngân hàng sẽ không thấy.
 *
 * Kỳ không bao giờ bị cắt: mất một chữ số của kỳ tạo ra một kỳ khác **có thật** (2026 08 cắt
 * thành 2026 0 rồi đọc nhầm), còn mã phòng cụt vẫn nhận ra được.
 */
export function buildInvoiceTransferNote(input: InvoiceNoteInput): string {
  const roomCode = toAsciiPurpose(input.roomCode);
  const longPeriod = toAsciiPurpose(input.period);
  const shortPeriod = input.period.replace(/\D/g, '');

  const candidates = [
    `HD ${roomCode} ${longPeriod}`,
    `${roomCode} ${longPeriod}`,
    `${roomCode} ${shortPeriod}`,
  ];

  const fitting = candidates.find((item) => item.length <= MAX_TRANSFER_NOTE_LENGTH);
  if (fitting) return fitting;

  // Bậc cuối: giữ trọn kỳ, cắt mã phòng cho vừa. `roomCodeSchema` giới hạn 20 ký tự nên
  // trường hợp này xảy ra thật với mã phòng dài, không phải phòng thủ thừa.
  const roomBudget = MAX_TRANSFER_NOTE_LENGTH - shortPeriod.length - 1;
  return `${roomCode.slice(0, roomBudget).trim()} ${shortPeriod}`;
}
