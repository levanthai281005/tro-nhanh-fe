import type { PaymentMethod } from '@tronhanh/schemas';
import type { Payment } from '@/features/workspace/types/invoice';
import { formatVnDate } from '@/utils/formatVnDate';
import { formatVnd } from '@/utils/formatVnd';

const METHOD_LABELS: Record<PaymentMethod, string> = {
  Cash: 'Tiền mặt',
  BankTransfer: 'Chuyển khoản',
};

/**
 * Lịch sử thu của hóa đơn.
 *
 * Liệt kê **từng lần thu** chứ không chỉ một con số tổng: người ở trả làm nhiều đợt là chuyện
 * thường, và khi có tranh cãi thì thứ cần tra là ngày nào nhận bao nhiêu, bằng hình thức gì.
 */
export function InvoicePaymentHistory({ payments }: { payments: readonly Payment[] }) {
  if (payments.length === 0) {
    return (
      <section className="flex flex-col gap-2">
        <h4 className="m-0 text-xs font-bold uppercase tracking-[0.04em] text-ink-muted">
          Lịch sử thu
        </h4>
        <p className="m-0 text-[13px] text-ink-muted">Chưa ghi nhận khoản thu nào.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <h4 className="m-0 text-xs font-bold uppercase tracking-[0.04em] text-ink-muted">
        Lịch sử thu ({payments.length})
      </h4>
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {payments.map((payment) => (
          <li
            key={payment.id}
            className="flex flex-wrap items-baseline justify-between gap-2 rounded-sm border border-line px-3.5 py-2.5"
          >
            <span className="min-w-0">
              <strong className="text-[13px] font-bold text-success">
                {formatVnd(payment.amount)}
              </strong>
              <span className="ml-2 text-xs text-ink-muted">
                {formatVnDate(payment.paidAt)} · {METHOD_LABELS[payment.method]}
              </span>
              {payment.note ? (
                <span className="mt-0.5 block text-xs italic text-ink-muted">{payment.note}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
