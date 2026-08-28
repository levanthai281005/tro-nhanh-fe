import type { InvoiceListItem } from '@/features/workspace/types/invoice';
import { getInvoiceItemLabel } from '@/features/workspace/utils/buildInvoiceDraft';
import { formatVnd } from '@/utils/formatVnd';

/** Các khoản của hóa đơn, kèm tổng và phần đã thu. */
export function InvoiceItemList({ invoice }: { invoice: InvoiceListItem }) {
  return (
    <section className="flex flex-col gap-2">
      <h4 className="m-0 text-xs font-bold uppercase tracking-[0.04em] text-ink-muted">
        Các khoản thu
      </h4>

      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {invoice.items.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-baseline justify-between gap-2 rounded-sm bg-canvas px-3.5 py-2.5"
          >
            <span className="min-w-0">
              <strong className="text-[13px] font-bold text-ink">
                {getInvoiceItemLabel(item.type)}
              </strong>
              <span className="ml-2 text-xs text-ink-muted">{item.description}</span>
            </span>
            <strong className="shrink-0 text-[13.5px] font-bold text-ink">
              {formatVnd(item.amount)}
            </strong>
          </li>
        ))}
      </ul>

      <dl className="m-0 flex flex-col gap-1.5 border-t border-line pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="m-0 text-[13px] font-bold text-ink">Tổng hóa đơn</dt>
          <dd className="m-0 text-[15px] font-extrabold text-ink">
            {formatVnd(invoice.totalAmount)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="m-0 text-[13px] text-ink-muted">Đã thu</dt>
          <dd className="m-0 text-[13.5px] font-bold text-success">
            {formatVnd(invoice.paidAmount)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="m-0 text-[13px] text-ink-muted">Còn thiếu</dt>
          <dd
            className={
              invoice.remainingAmount > 0
                ? 'm-0 text-[15px] font-extrabold text-primary'
                : 'm-0 text-[15px] font-extrabold text-success'
            }
          >
            {formatVnd(invoice.remainingAmount)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
