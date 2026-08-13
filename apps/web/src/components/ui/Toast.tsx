'use client';

import { Check, X } from 'lucide-react';
import { useEffect, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  variant?: 'success' | 'error';
  onClose?: () => void;
  duration?: number;
}

const VARIANT_CLASSES = {
  success: 'border-success bg-success-soft text-success',
  error: 'border-error bg-error-soft text-error',
} as const;

export function Toast({
  message,
  variant = 'success',
  onClose,
  duration = 2500,
  className,
  role,
  ...toastProps
}: ToastProps) {
  useEffect(() => {
    if (!onClose) return;

    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onClose]);

  const StatusIcon = variant === 'success' ? Check : X;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-[13px] font-semibold shadow-md',
        VARIANT_CLASSES[variant],
        className,
      )}
      role={role ?? (variant === 'error' ? 'alert' : 'status')}
      {...toastProps}
    >
      <StatusIcon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.5} />
      <span>{message}</span>
      {onClose ? (
        <button
          aria-label="Đóng thông báo"
          className="ml-1 inline-flex size-6 items-center justify-center rounded-sm transition-colors hover:bg-surface/60"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
