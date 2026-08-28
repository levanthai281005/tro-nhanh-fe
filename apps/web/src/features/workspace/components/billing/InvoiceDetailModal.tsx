'use client';

import { CheckCircle2, Printer, Send } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ModalShell } from '@/components/ui/ModalShell';
import { VietQrPreview } from '@/components/ui/VietQrPreview';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { InvoiceItemList } from '@/features/workspace/components/billing/InvoiceItemList';
import { InvoicePaymentHistory } from '@/features/workspace/components/billing/InvoicePaymentHistory';
import { RecordPaymentDialog } from '@/features/workspace/components/billing/RecordPaymentDialog';
import { useMarkInvoiceSent } from '@/features/workspace/hooks/useInvoices';
import type { InvoiceListItem } from '@/features/workspace/types/invoice';
import { formatPeriod } from '@/features/workspace/utils/period';
import { formatVnDate } from '@/utils/formatVnDate';
import { formatVnd } from '@/utils/formatVnd';

/**
 * Chi tiết hóa đơn — khoản thu, mã VietQR và lịch sử thu.
 *
 * Toàn bộ phần thân mang `data-print-area`, nên nút In cho ra đúng tờ hóa đơn mà chủ trọ đang
 * nhìn: cùng các dòng, cùng mã QR. Không dùng thư viện PDF nào — trình duyệt tự lo phần
 * "Lưu thành PDF", và chủ trọ gửi file đó qua kênh nào tùy họ (hộp thư in-app là A11, chưa có).
 */
export function InvoiceDetailModal({
  invoice,
  sellerId,
  onClose,
}: {
  invoice: InvoiceListItem;
  sellerId: string;
  onClose: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markSent = useMarkInvoiceSent(sellerId);

  const isSettled = invoice.remainingAmount === 0;

  return (
    <>
      <ModalShell
        footer={
          <div className="flex w-full flex-wrap items-center justify-between gap-2.5">
            <Button
              icon={<Printer aria-hidden="true" className="size-4" />}
              onClick={() => window.print()}
              size="sm"
              variant="ghost"
            >
              In / lưu PDF
            </Button>

            <div className="flex flex-wrap gap-2.5">
              <WriteGuardButton
                disabled={invoice.sentAt !== null}
                icon={<Send aria-hidden="true" className="size-4" />}
                loading={markSent.isPending}
                onClick={() => {
                  setError(null);
                  markSent.mutate(invoice.id, {
                    onError: (cause) =>
                      setError(
                        cause instanceof Error ? cause.message : 'Chưa đánh dấu được đã gửi.',
                      ),
                  });
                }}
                size="sm"
                surface="workspace"
                variant="outline"
              >
                {invoice.sentAt ? 'Đã gửi' : 'Đánh dấu đã gửi'}
              </WriteGuardButton>

              <WriteGuardButton
                disabled={isSettled}
                onClick={() => setIsRecording(true)}
                size="sm"
                surface="workspace"
                variant="primary"
              >
                {isSettled ? 'Đã thu đủ' : `Đã thu ${formatVnd(invoice.remainingAmount)}`}
              </WriteGuardButton>
            </div>
          </div>
        }
        onClose={onClose}
        size="lg"
        title={`Hóa đơn ${invoice.code}`}
      >
        <div className="flex flex-col gap-5" data-print-area>
          {error ? (
            <p
              className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error"
              data-print-hidden
            >
              {error}
            </p>
          ) : null}

          <header className="flex flex-wrap items-start justify-between gap-3 rounded-sm border border-line bg-canvas px-4 py-3.5">
            <div>
              <p className="m-0 text-[15px] font-extrabold text-ink">
                {invoice.roomCode} · {formatPeriod(invoice.period)}
              </p>
              <p className="m-0 mt-0.5 text-[13px] text-ink-muted">
                {invoice.propertyName} · {invoice.occupantName}
              </p>
              <p className="m-0 mt-0.5 text-[13px] text-ink-muted">
                Hạn thanh toán {formatVnDate(invoice.dueDate)}
              </p>
            </div>
            <Badge kind="invoice" status={invoice.status} />
          </header>

          <div className="grid gap-5 md:grid-cols-[1fr_auto]">
            <div className="flex min-w-0 flex-col gap-4">
              <InvoiceItemList invoice={invoice} />
              <InvoicePaymentHistory payments={invoice.payments} />
            </div>

            <div className="flex flex-col gap-2">
              <p className="m-0 text-xs font-bold uppercase tracking-[0.04em] text-ink-muted">
                {isSettled ? 'Đã thanh toán đủ' : 'Quét để chuyển khoản'}
              </p>
              {isSettled ? (
                <p className="m-0 flex items-center gap-2 rounded-sm border border-success bg-success-soft px-3.5 py-3 text-[13px] font-semibold text-success">
                  <CheckCircle2 aria-hidden="true" className="size-4 shrink-0" />
                  Hóa đơn này đã thu đủ.
                </p>
              ) : (
                <>
                  {/* Số tiền trên mã là **số còn thiếu**, không phải tổng hóa đơn: hóa đơn đã
                      thu một phần mà quét ra tổng gốc thì người ở chuyển thừa. */}
                  <VietQrPreview
                    accountName={invoice.bankAccountName}
                    accountNumber={invoice.bankAccountNumber}
                    amount={invoice.remainingAmount}
                    bankCode={invoice.bankName}
                    purpose={invoice.transferNote}
                    size={160}
                  />
                  <p className="m-0 max-w-[200px] text-center text-xs leading-relaxed text-ink-muted">
                    Nội dung chuyển khoản:{' '}
                    <strong className="text-ink">{invoice.transferNote}</strong>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </ModalShell>

      {isRecording ? (
        <RecordPaymentDialog
          invoice={invoice}
          onClose={() => setIsRecording(false)}
          sellerId={sellerId}
        />
      ) : null}
    </>
  );
}
