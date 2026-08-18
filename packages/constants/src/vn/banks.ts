/**
 * Danh sách ngân hàng + mã BIN (NAPAS) để sinh mã VietQR.
 *
 * **Vì sao cần file này:** chuỗi VietQR chuẩn EMVCo bắt buộc có **mã BIN 6 chữ số** của ngân
 * hàng thụ hưởng. Nếu ô ngân hàng là text tự do, chủ trọ gõ "MB", "mbbank", "Ngân hàng Quân
 * Đội" đều lưu thành công mà **không giá trị nào sinh được QR** — và chỗ duy nhất phát hiện ra
 * là khi người ở mở hóa đơn và không thấy mã nào. Nên ô đó phải là dropdown chọn từ bảng này.
 *
 * `Property.bankName` lưu `code` (VD `"MB"`), **không** lưu BIN và không lưu tên đầy đủ.
 *
 * ⚠️ Thiếu ngân hàng nào thì thêm một dòng vào đây — đừng đổi `bankName` về text tự do, QR sẽ
 * chết im lặng.
 *
 * ⚠️ Mã BIN phải khớp NAPAS. Trước khi tin bảng này, quét thử một mã bằng app ngân hàng thật.
 */

export interface BankInfo {
  /** Giá trị lưu vào `Property.bankName`. */
  code: string;
  /** Mã BIN 6 số dùng trong chuỗi EMVCo. */
  bin: string;
  /** Tên hiển thị cho người dùng chọn. */
  name: string;
}

export const VIETNAM_BANKS: readonly BankInfo[] = [
  { code: 'VCB', bin: '970436', name: 'Vietcombank' },
  { code: 'CTG', bin: '970415', name: 'VietinBank' },
  { code: 'BIDV', bin: '970418', name: 'BIDV' },
  { code: 'AGR', bin: '970405', name: 'Agribank' },
  { code: 'TCB', bin: '970407', name: 'Techcombank' },
  { code: 'MB', bin: '970422', name: 'MB Bank' },
  { code: 'ACB', bin: '970416', name: 'ACB' },
  { code: 'VPB', bin: '970432', name: 'VPBank' },
  { code: 'TPB', bin: '970423', name: 'TPBank' },
  { code: 'STB', bin: '970403', name: 'Sacombank' },
  { code: 'HDB', bin: '970437', name: 'HDBank' },
  { code: 'VIB', bin: '970441', name: 'VIB' },
  { code: 'SHB', bin: '970443', name: 'SHB' },
  { code: 'EIB', bin: '970431', name: 'Eximbank' },
  { code: 'MSB', bin: '970426', name: 'MSB' },
  { code: 'OCB', bin: '970448', name: 'OCB' },
  { code: 'SEAB', bin: '970440', name: 'SeABank' },
  { code: 'NAB', bin: '970428', name: 'Nam A Bank' },
  { code: 'ABB', bin: '970425', name: 'ABBANK' },
  { code: 'BAB', bin: '970409', name: 'Bac A Bank' },
  { code: 'PVCB', bin: '970412', name: 'PVcomBank' },
  { code: 'VAB', bin: '970427', name: 'VietABank' },
  { code: 'LPB', bin: '970449', name: 'LPBank' },
  { code: 'SGICB', bin: '970400', name: 'SaigonBank' },
  { code: 'KLB', bin: '970452', name: 'KienLongBank' },
  { code: 'NCB', bin: '970419', name: 'NCB' },
  { code: 'VRB', bin: '970421', name: 'VRB' },
  { code: 'BVB', bin: '970454', name: 'BVBank' },
] as const;

/** Tra ngân hàng theo `code` đã lưu. `null` nếu không nhận ra. */
export function findBankByCode(code: string | null | undefined): BankInfo | null {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  return VIETNAM_BANKS.find((bank) => bank.code.toUpperCase() === normalized) ?? null;
}
