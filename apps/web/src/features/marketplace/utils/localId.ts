/**
 * Sinh id cục bộ cho các dòng người dùng tự thêm trong form (khoản phí, địa điểm gần đây).
 *
 * **Không dùng `Date.now()`.** Nó chỉ phân giải tới mili-giây, nên bấm "Thêm" vài lần liên
 * tiếp sẽ tạo ra nhiều dòng mang **cùng một id**: xoá một dòng thì xoá luôn cả nhóm trùng id,
 * sửa một dòng thì sửa cả nhóm, và React nhận key trùng nên vẽ lại thất thường.
 *
 * Id này chỉ sống trong phiên nhập liệu — khi lưu, backend cấp id thật.
 */
export function createLocalId(prefix: string): string {
  const unique =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `${prefix}-${unique}`;
}
