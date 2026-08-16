'use client';

import { Button } from '@/components/ui/Button';
import { ModalShell } from '@/components/ui/ModalShell';

export interface ConfirmListingDialogProps {
  title: string;
  description: string;
  listingTitle: string;
  confirmLabel: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  isDanger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Hộp xác nhận cho thao tác không nhìn thấy ngay hệ quả (xóa tin, gia hạn).
 * Prototype dùng `window.confirm()` — trình duyệt tự vẽ, không theo design system và
 * không đọc được nội dung tin đang thao tác.
 */
export function ConfirmListingDialog({
  title,
  description,
  listingTitle,
  confirmLabel,
  isSubmitting,
  errorMessage,
  isDanger = false,
  onConfirm,
  onClose,
}: ConfirmListingDialogProps) {
  return (
    <ModalShell
      footer={
        <>
          <Button disabled={isSubmitting} onClick={onClose} variant="outline">
            Hủy
          </Button>
          <Button
            data-testid="confirm-listing-btn"
            loading={isSubmitting}
            onClick={onConfirm}
            variant={isDanger ? 'danger' : 'primary'}
          >
            {confirmLabel}
          </Button>
        </>
      }
      onClose={onClose}
      title={title}
      variant="bottom-sheet"
    >
      <div className="flex flex-col gap-3">
        <p className="m-0 text-sm leading-relaxed text-ink-muted">{description}</p>
        <p className="m-0 rounded-md bg-cream px-3.5 py-2.5 text-sm font-bold text-ink">
          {listingTitle}
        </p>
        {errorMessage ? (
          <p className="m-0 text-sm font-semibold text-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </ModalShell>
  );
}
