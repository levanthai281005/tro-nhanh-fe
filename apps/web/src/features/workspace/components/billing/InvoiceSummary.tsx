import type { InvoiceSummaryTotals } from '@/features/workspace/types/invoice';
import { cn } from '@/utils/cn';
import { formatVnd } from '@/utils/formatVnd';

/**
 * Bốn con số đầu màn hóa đơn.
 *
 * Tính trên **tập đang lọc**, không phải toàn bộ hóa đơn: chủ trọ lọc kỳ 2026-08 mà ô tổng vẫn
 * là tổng mọi kỳ thì con số đó không trả lời được câu hỏi nào.
 *
 * BR-012 (che số nhạy cảm sau toggle) áp cho **dashboard B3**, không áp ở đây: người mở màn
 * hóa đơn đang chủ động đi thu tiền, giấu số tiền đi là làm hỏng chính việc họ vào đây để làm.
 */
export function InvoiceSummary({ totals }: { totals: InvoiceSummaryTotals }) {
  const cards = [
    { label: 'Tổng phải thu', value: formatVnd(totals.totalAmount), tone: 'ink' as const },
    { label: 'Đã thu', value: formatVnd(totals.paidAmount), tone: 'success' as const },
    { label: 'Còn thiếu', value: formatVnd(totals.remainingAmount), tone: 'primary' as const },
    {
      label: `Quá hạn (${totals.overdueCount})`,
      value: formatVnd(totals.overdueAmount),
      tone: totals.overdueCount > 0 ? ('error' as const) : ('ink' as const),
    },
  ];

  const TONE_CLASSES = {
    ink: 'text-ink',
    success: 'text-success',
    primary: 'text-primary',
    error: 'text-error',
  };

  return (
    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <li key={card.label} className="rounded-md border border-line bg-surface px-4 py-3.5">
          <p className="m-0 text-xs font-bold uppercase tracking-[0.04em] text-ink-muted">
            {card.label}
          </p>
          <p className={cn('m-0 mt-1 text-[17px] font-extrabold', TONE_CLASSES[card.tone])}>
            {card.value}
          </p>
        </li>
      ))}
    </ul>
  );
}
