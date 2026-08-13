'use client';

import { X } from 'lucide-react';
import { useEffect, useId, type MouseEvent, type ReactNode } from 'react';

export interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
}

export function ModalShell({ title, onClose, children, footer }: ModalShellProps) {
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
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/50 p-5"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-[18px] bg-surface shadow-2xl"
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
        <div className="flex flex-col gap-3.5 px-6 py-5">{children}</div>
        <footer className="flex justify-end gap-2.5 border-t border-line px-6 py-4">
          {footer}
        </footer>
      </div>
    </div>
  );
}
