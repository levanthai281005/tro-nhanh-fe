/**
 * Định dạng ngày nghiệp vụ theo lối Việt Nam: `15/01/2026`.
 *
 * Nhận chuỗi `YYYY-MM-DD` và **không** dựng `Date` để tránh lệch múi giờ: `new Date('2026-01-15')`
 * được hiểu là UTC, nên ở giờ Việt Nam (UTC+7) nó vẫn ra đúng ngày, nhưng cùng đoạn code chạy
 * trên máy chủ ở múi giờ âm sẽ lùi mất một ngày. Ngày hợp đồng lùi một ngày là sai lệch không
 * ai để ý cho tới lúc tính tiền.
 */
export function formatVnDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}
