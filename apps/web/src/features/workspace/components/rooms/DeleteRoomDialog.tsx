'use client';

import { Button } from '@/components/ui/Button';
import { ModalShell } from '@/components/ui/ModalShell';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import type { RoomListItem } from '@/features/workspace/types/room';

interface DeleteRoomDialogProps {
  room: RoomListItem;
  isDeleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteRoomDialog({
  room,
  isDeleting,
  error,
  onClose,
  onConfirm,
}: DeleteRoomDialogProps) {
  // Module 6 — xóa phòng chỉ được khi không còn hợp đồng Active. Chặn ngay ở dialog để người
  // dùng biết lý do trước khi bấm, thay vì bấm rồi ăn lỗi.
  const isBlocked = room.hasActiveContract;

  return (
    <ModalShell
      footer={
        <>
          <Button disabled={isDeleting} onClick={onClose} variant="ghost">
            Hủy
          </Button>
          <WriteGuardButton
            disabled={isBlocked}
            loading={isDeleting}
            onClick={onConfirm}
            surface="workspace"
            variant="danger"
          >
            Xóa phòng
          </WriteGuardButton>
        </>
      }
      onClose={onClose}
      title={`Xóa phòng ${room.roomCode}?`}
    >
      <div className="flex flex-col gap-3">
        {isBlocked ? (
          <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
            Phòng đang có hợp đồng hiệu lực nên chưa xóa được. Hãy chấm dứt hợp đồng trước.
          </p>
        ) : (
          <p className="m-0 text-[13.5px] leading-relaxed text-ink-muted">
            Phòng <strong className="text-ink">{room.roomCode}</strong> sẽ bị gỡ khỏi khu trọ. Lịch
            sử hóa đơn và hợp đồng đã ghi vẫn được giữ lại.
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
