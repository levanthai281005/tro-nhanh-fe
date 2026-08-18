'use client';

import { Button } from '@/components/ui/Button';
import { ModalShell } from '@/components/ui/ModalShell';

export interface RestoreDraftDialogProps {
  savedAt: string;
  onRestore: () => void;
  onDiscard: () => void;
}

function formatSavedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'lần trước';

  const isToday = new Date().toDateString() === date.toDateString();
  const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return isToday ? `lúc ${time} hôm nay` : `lúc ${time} ngày ${date.toLocaleDateString('vi-VN')}`;
}

/**
 * Hỏi trước rồi mới khôi phục, không tự đổ dữ liệu cũ vào form.
 *
 * Có người mở lại trang vì cố ý muốn đăng một tin hoàn toàn mới — tự động điền lại tin dở
 * lần trước sẽ khiến họ phải đi xóa từng ô.
 */
export function RestoreDraftDialog({ savedAt, onRestore, onDiscard }: RestoreDraftDialogProps) {
  return (
    <ModalShell
      footer={
        <>
          <Button data-testid="draft-discard-btn" onClick={onDiscard} variant="outline">
            Bỏ, nhập mới
          </Button>
          <Button data-testid="draft-restore-btn" onClick={onRestore}>
            Khôi phục
          </Button>
        </>
      }
      onClose={onDiscard}
      title="Bạn có tin đăng nhập dở"
      variant="bottom-sheet"
    >
      <p className="m-0 text-sm leading-relaxed text-ink-muted">
        Chúng tôi đã tự lưu nội dung bạn nhập {formatSavedAt(savedAt)}. Bạn muốn nhập tiếp từ chỗ
        đang dở, hay bỏ và bắt đầu một tin mới?
      </p>
    </ModalShell>
  );
}
