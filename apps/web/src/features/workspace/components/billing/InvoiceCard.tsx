'use client';

import { CheckCircle2, Send } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { InvoiceListItem } from '@/features/workspace/types/invoice';
import { formatPeriod } from '@/features/workspace/utils/period';
import { formatVnDate } from '@/utils/formatVnDate';
import { formatVnd } from '@/utils/formatVnd';

/**
 * Một hóa đơn trong danh sách.
 *
 * Con số nổi bật là **số còn thiếu**, không phải tổng hóa đơn: câu hỏi chủ trọ mang tới màn này
 * là "còn phải đòi bao nhiêu", và với hóa đơn đã thu một phần thì tổng gốc trả lời sai câu đó.
 */
export function InvoiceCard({
  invoice,
  onOpen,
}: {
  invoice: InvoiceListItem;
  onOpen: (invoice: InvoiceListItem) => void;
}) {
  const isSettled = invoice.remainingAmount === 0;

  return (
    <li className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 flex flex-wrap items-center gap-2">
            <strong className="text-[15px] font-extrabold text-ink">{invoice.roomCode}</strong>
            <span className="text-[13px] text-ink-muted">{formatPeriod(invoice.period)}</span>
          </p>
          <p className="m-0 mt-0.5 truncate text-[13px] text-ink-muted">
            {invoice.propertyName} · {invoice.occupantName}
          </p>
        </div>
        <Badge kind="invoice" status={invoice.status} />
      </div>

      <dl className="m-0 grid grid-cols-2 gap-x-3 gap-y-2">
        <div>
          <dt className="m-0 text-xs text-ink-muted">Tổng hóa đơn</dt>
          <dd className="m-0 text-[13.5px] font-bold text-ink">{formatVnd(invoice.totalAmount)}</dd>
        </div>
        <div>
          <dt className="m-0 text-xs text-ink-muted">{isSettled ? 'Đã thu' : 'Còn thiếu'}</dt>
          <dd
            className={
              isSettled
                ? 'm-0 text-[15px] font-extrabold text-success'
                : 'm-0 text-[15px] font-extrabold text-primary'
            }
          >
            {formatVnd(isSettled ? invoice.paidAmount : invoice.remainingAmount)}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          <span>Hạn {formatVnDate(invoice.dueDate)}</span>
          {invoice.sentAt ? (
            <span className="flex items-center gap-1 text-success">
              <CheckCircle2 aria-hidden="true" className="size-3.5" />
              Đã gửi
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Send aria-hidden="true" className="size-3.5" />
              Chưa gửi
            </span>
          )}
        </span>

        <Button onClick={() => onOpen(invoice)} size="sm" variant="outline">
          Xem &amp; thu tiền
        </Button>
      </div>
    </li>
  );
}
