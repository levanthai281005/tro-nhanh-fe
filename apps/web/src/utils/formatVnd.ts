/**
 * Định dạng số tiền theo lối Việt Nam: `3.200.000 đ`.
 *
 * `features/marketplace` hiện có bốn bản `formatVnd` cục bộ, mỗi bản khác nhau chút đỉnh về
 * khoảng trắng và hậu tố. Không gộp chúng trong nhánh này để giữ phạm vi thay đổi gọn; bản
 * dùng chung đặt ở đây để feature mới không sinh bản thứ năm.
 */
export function formatVnd(value: number, suffix = ''): string {
  return `${value.toLocaleString('vi-VN')} đ${suffix}`;
}
