import { Info } from 'lucide-react';
import Link from 'next/link';
import { FormSection } from '@/components/ui/FormSection';
import type { InvoiceDraftLine } from '@/features/workspace/utils/buildInvoiceDraft';
import { getInvoiceItemLabel } from '@/features/workspace/utils/buildInvoiceDraft';
import { formatPeriod } from '@/features/workspace/utils/period';
import { formatVnd } from '@/utils/formatVnd';

/**
 * Hai dòng điện nước dựng sẵn từ chỉ số đã ghi — **chỉ đọc**.
 *
 * Cố ý không cho sửa: số tiền này là `(chỉ số mới − chỉ số cũ) × đơn giá đã chốt`, nên gõ đè
 * một con số khác lên đó là tạo ra hóa đơn mà chính người ở đối chiếu công tơ sẽ thấy sai.
 * Muốn đổi thì sửa ở tab ghi chỉ số, chỗ có đủ ngữ cảnh để biết mình đang đổi cái gì.
 */
export function InvoiceDraftLines({
  lines,
  period,
}: {
  lines: readonly InvoiceDraftLine[];
  period: string;
}) {
  const utilityLines = lines.filter((line) => line.type === 'Electricity' || line.type === 'Water');

  return (
    <FormSection
      description="Tính từ chỉ số đã ghi của kỳ, theo đơn giá chốt lúc ghi."
      title="Điện nước"
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {utilityLines.map((line) => (
          <li
            key={line.key}
            className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-line bg-canvas px-3.5 py-2.5"
          >
            <span className="min-w-0">
              <strong className="text-[13px] font-bold text-ink">
                {getInvoiceItemLabel(line.type)}
              </strong>
              <span className="ml-2 text-xs text-ink-muted">
                {line.missingReason ??
                  `${line.description} · ${line.quantity} × ${line.unitPrice.toLocaleString('vi-VN')} đ`}
              </span>
            </span>
            <strong className="shrink-0 text-[13.5px] font-bold text-ink">
              {line.missingReason ? '—' : formatVnd(line.amount)}
            </strong>
          </li>
        ))}
      </ul>

      {utilityLines.some((line) => line.missingReason) ? (
        <p className="m-0 flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
          <Info aria-hidden="true" className="mt-px size-3.5 shrink-0" />
          <span>
            Kỳ {formatPeriod(period)} chưa ghi đủ chỉ số nên hóa đơn sẽ không có khoản đó. Ghi ở tab{' '}
            <Link className="font-semibold text-primary underline" href="/chu-tro/hoa-don">
              Ghi điện nước
            </Link>{' '}
            rồi quay lại, hoặc cứ tạo hóa đơn phần còn lại.
          </span>
        </p>
      ) : null}
    </FormSection>
  );
}
