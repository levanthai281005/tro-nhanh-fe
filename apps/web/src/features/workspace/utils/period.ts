/**
 * Kỳ hóa đơn dạng `YYYY-MM`.
 *
 * Dùng chuỗi chứ không dùng `Date`: kỳ là một nhãn nghiệp vụ, không phải một thời điểm. Dựng
 * `Date` cho nó là mời múi giờ vào cuộc — `new Date('2026-08')` được hiểu là UTC, nên máy chủ
 * ở múi giờ âm sẽ đọc ra tháng 7. Ở dạng chuỗi thì so sánh và sắp xếp đều đúng sẵn.
 */

export function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/** `2026-08` → `Tháng 08/2026`. */
export function formatPeriod(period: string): string {
  const [year, month] = period.split('-');
  if (!year || !month) return period;
  return `Tháng ${month}/${year}`;
}

/** Lùi `offset` tháng từ kỳ cho trước. `shiftPeriod('2026-01', -1)` → `2025-12`. */
export function shiftPeriod(period: string, offset: number): string {
  const [year, month] = period.split('-').map(Number);
  if (!year || !month) return period;

  const zeroBased = year * 12 + (month - 1) + offset;
  const nextYear = Math.floor(zeroBased / 12);
  const nextMonth = (zeroBased % 12) + 1;
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
}

/**
 * Các kỳ chọn được khi ghi chỉ số: kỳ này và một năm trở về trước.
 *
 * Có kỳ **tương lai gần** (tháng sau) vì chủ trọ hay chốt sổ vào những ngày cuối tháng và ghi
 * luôn cho kỳ tới; chặn cứng ở kỳ hiện tại là bắt họ đợi qua đêm.
 */
export function buildPeriodOptions(anchor = currentPeriod(), monthsBack = 12): readonly string[] {
  return Array.from({ length: monthsBack + 2 }, (_, index) => shiftPeriod(anchor, 1 - index));
}
