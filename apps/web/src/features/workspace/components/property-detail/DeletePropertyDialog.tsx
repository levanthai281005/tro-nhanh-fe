'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ModalShell } from '@/components/ui/ModalShell';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';

interface DeletePropertyDialogProps {
  propertyName: string;
  roomCount: number;
  /** Số phòng `Rented`/`Deposited` đang chặn việc xóa (BR-011). `null` = đang đếm. */
  blockingRoomCount: number | null;
  isDeleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeletePropertyDialog({
  propertyName,
  roomCount,
  blockingRoomCount,
  isDeleting,
  error,
  onClose,
  onConfirm,
}: DeletePropertyDialogProps) {
  const isChecking = blockingRoomCount === null;
  const isBlocked = blockingRoomCount !== null && blockingRoomCount > 0;

  return (
    <ModalShell
      footer={
        <>
          <Button disabled={isDeleting} onClick={onClose} variant="ghost">
            Hủy
          </Button>
          <WriteGuardButton
            disabled={isChecking || isBlocked}
            loading={isDeleting}
            onClick={onConfirm}
            surface="workspace"
            variant="danger"
          >
            Xóa khu trọ
          </WriteGuardButton>
        </>
      }
      onClose={onClose}
      title={`Xóa khu ${propertyName}?`}
    >
      <div className="flex flex-col gap-3">
        {isChecking ? (
          <p className="m-0 text-[13.5px] text-ink-muted">Đang kiểm tra tình trạng phòng…</p>
        ) : isBlocked ? (
          <div className="flex items-start gap-3 rounded-sm bg-error-soft px-3.5 py-3">
            <AlertTriangle aria-hidden="true" className="mt-px size-5 shrink-0 text-error" />
            <p className="m-0 text-[13.5px] leading-relaxed text-ink">
              Khu <strong>{propertyName}</strong> còn{' '}
              <strong>{blockingRoomCount} phòng đang cho thuê hoặc đã nhận cọc</strong>. Hãy kết
              thúc hợp đồng của các phòng đó trước khi xóa khu.
            </p>
          </div>
        ) : (
          <p className="m-0 text-[13.5px] leading-relaxed text-ink">
            Bạn sắp xóa khu <strong>{propertyName}</strong> cùng {roomCount} phòng thuộc khu này. Dữ
            liệu hóa đơn và hợp đồng cũ vẫn được giữ lại, nhưng khu sẽ không còn xuất hiện ở màn
            quản lý.
          </p>
        )}

        {error ? (
          <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
            {error}
          </p>
        ) : null}
      </div>
    </ModalShell>
  );
}
