'use client';

import { X } from 'lucide-react';
import { useEffect, useId, type MouseEvent, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
  variant?: 'dialog' | 'bottom-sheet';
  /**
   * `lg` cho nội dung có **hai cột** trên màn rộng — chi tiết hóa đơn đặt danh sách khoản thu
   * cạnh mã VietQR. Ở khổ mặc định hai cột đó bị ép xuống còn ~200px mỗi bên và số tiền xuống
   * dòng giữa chừng.
   */
  size?: 'md' | 'lg';
}

/**
 * Viết đủ cả hai biến thể thay vì ghép chuỗi `md:${...}`.
 *
 * Tailwind quét mã nguồn bằng văn bản: class dựng bằng nội suy chuỗi không bao giờ được sinh ra
 * CSS, mà build vẫn xanh và typecheck vẫn xanh — chỉ có modal là đột nhiên rộng hết màn hình.
 */
const SIZE_CLASSES: Record<'md' | 'lg', string> = {
  md: 'max-w-[460px]',
  lg: 'max-w-[680px]',
};

const SHEET_SIZE_CLASSES: Record<'md' | 'lg', string> = {
  md: 'md:max-w-[460px]',
  lg: 'md:max-w-[680px]',
};

export function ModalShell({
  title,
  onClose,
  children,
  footer,
  variant = 'dialog',
  size = 'md',
}: ModalShellProps) {
  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => event.stopPropagation();

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className={
        variant === 'bottom-sheet'
          ? 'fixed inset-0 z-[300] flex items-end bg-ink/50 md:items-center md:justify-center md:p-5'
          : 'fixed inset-0 z-[300] flex items-center justify-center bg-ink/50 p-5'
      }
      onClick={onClose}
      role="dialog"
    >
      <div
        className={cn(
          variant === 'bottom-sheet'
            ? 'flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-[20px] bg-surface shadow-2xl md:rounded-[18px]'
            : 'max-h-[90vh] w-full overflow-y-auto rounded-[18px] bg-surface shadow-2xl',
          variant === 'bottom-sheet' ? SHEET_SIZE_CLASSES[size] : SIZE_CLASSES[size],
        )}
        onClick={stopPropagation}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h3 id={titleId} className="m-0 text-lg font-extrabold text-ink">
            {title}
          </h3>
          <button
            aria-label="Đóng hộp thoại"
            className="inline-flex size-8 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-cream"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>
        <div
          className={
            variant === 'bottom-sheet'
              ? 'overflow-y-auto px-6 py-5'
              : 'flex flex-col gap-3.5 px-6 py-5'
          }
        >
          {children}
        </div>
        <footer className="flex shrink-0 justify-end gap-2.5 border-t border-line px-6 py-4">
          {footer}
        </footer>
      </div>
    </div>
  );
}
