/**
 * Chuẩn hóa tên chủ tài khoản về IN HOA không dấu.
 *
 * Chuẩn VietQR yêu cầu vậy — đây là **ràng buộc kỹ thuật**, không phải lỗi của người dùng.
 * Nên tự chuyển khi gõ thay vì bắt họ tự viết hoa rồi báo đỏ khi sai: gõ "Nguyễn Văn An" là
 * hành vi hoàn toàn hợp lý của một người không biết chuẩn EMVCo tồn tại.
 */
export function toVietQrAccountName(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase()
    .replace(/[^A-Z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trimStart();
}
