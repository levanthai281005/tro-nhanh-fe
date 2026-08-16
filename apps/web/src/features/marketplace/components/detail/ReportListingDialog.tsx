'use client';

import { Flag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import { ModalShell } from '@/components/ui/ModalShell';
import { useCreateReport } from '@/features/marketplace/hooks/useCreateReport';

export interface ReportListingDialogProps {
  listingId: string;
  redirectPath: string;
  viewerId?: string;
}

const REPORT_REASONS = [
  { value: 'Thông tin không chính xác', label: 'Thông tin không chính xác' },
  { value: 'Tin đăng có dấu hiệu lừa đảo', label: 'Tin đăng có dấu hiệu lừa đảo' },
  { value: 'Hình ảnh hoặc nội dung không phù hợp', label: 'Hình ảnh hoặc nội dung không phù hợp' },
  { value: 'Lý do khác', label: 'Lý do khác' },
];

export function ReportListingDialog({
  listingId,
  redirectPath,
  viewerId,
}: ReportListingDialogProps) {
  const router = useRouter();
  const reportMutation = useCreateReport();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
    setError(null);
    setIsSubmitted(false);
  };

  const openDialog = () => {
    if (!viewerId) {
      router.push(`/dang-nhap?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
    setIsOpen(true);
  };

  const submitReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!viewerId) return;
    if (!reason) {
      setError('Vui lòng chọn lý do báo cáo.');
      return;
    }

    try {
      setError(null);
      await reportMutation.mutateAsync({
        reporterId: viewerId,
        listingId,
        reason,
        description,
      });
      setIsSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Không thể gửi báo cáo lúc này.',
      );
    }
  };

  return (
    <>
      <button
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted underline-offset-2 transition-colors hover:text-error hover:underline"
        data-testid="report-listing-button"
        onClick={openDialog}
        type="button"
      >
        <Flag aria-hidden="true" className="size-3.5" />
        Báo cáo tin đăng
      </button>

      {isOpen ? (
        <ModalShell
          footer={
            isSubmitted ? (
              <Button onClick={closeDialog}>Đóng</Button>
            ) : (
              <>
                <Button onClick={closeDialog} variant="outline">
                  Hủy
                </Button>
                <Button form="listing-report-form" loading={reportMutation.isPending} type="submit">
                  Gửi báo cáo
                </Button>
              </>
            )
          }
          onClose={closeDialog}
          title="Báo cáo tin đăng"
          variant="bottom-sheet"
        >
          {isSubmitted ? (
            <div className="py-2 text-sm leading-6 text-ink-muted">
              Cảm ơn bạn đã báo cáo. Trọ Nhanh sẽ xem xét thông tin này.
            </div>
          ) : (
            <form className="space-y-4" id="listing-report-form" onSubmit={submitReport}>
              <p className="text-sm leading-6 text-ink-muted">
                Báo cáo giúp chúng tôi giữ thông tin tìm phòng an toàn và chính xác hơn.
              </p>
              <label className="block text-sm font-semibold text-ink">
                Lý do báo cáo
                <span className="mt-1.5 block rounded-sm border border-line bg-surface px-3 py-3">
                  <AppSelect
                    onChange={setReason}
                    options={REPORT_REASONS}
                    placeholder="Chọn một lý do"
                    value={reason}
                  />
                </span>
              </label>
              <label className="block text-sm font-semibold text-ink">
                Ghi chú thêm <span className="font-normal text-ink-muted">(không bắt buộc)</span>
                <textarea
                  className="mt-1.5 min-h-24 w-full resize-y rounded-sm border border-line bg-surface px-3 py-2.5 text-sm font-normal text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-sand"
                  maxLength={500}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Mô tả ngắn để chúng tôi kiểm tra nhanh hơn"
                  value={description}
                />
              </label>
              {error ? <p className="text-sm text-error">{error}</p> : null}
            </form>
          )}
        </ModalShell>
      ) : null}
    </>
  );
}
