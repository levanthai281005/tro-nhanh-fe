'use client';

import { LoaderCircle } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

// TODO: BR-015 — `requiresWrite`/`useCanWrite` tạm bỏ vì rebuild chưa có Workspace gating
// context cung cấp `workspaceStatus`; nối lại khi capability này có nguồn dữ liệu đáng tin cậy.
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-primary text-surface hover:bg-primary-hover active:bg-primary-press disabled:bg-line disabled:text-ink-muted',
  secondary:
    'border-transparent bg-sand text-surface hover:bg-sand-hover active:bg-sand-press disabled:bg-line disabled:text-ink-muted',
  outline:
    'border-primary bg-transparent text-primary hover:bg-sand-soft active:border-primary-press active:bg-sand-soft active:text-primary-press disabled:border-line disabled:bg-transparent disabled:text-ink-muted',
  ghost:
    'border-transparent bg-transparent text-ink-muted hover:bg-cream hover:text-primary-press active:bg-line active:text-primary-press disabled:bg-transparent disabled:text-ink-muted',
  danger:
    'border-transparent bg-error text-surface hover:bg-error-hover active:bg-error-press disabled:bg-line disabled:text-ink-muted',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-[13px]',
  md: 'px-5 py-[9px] text-sm',
  lg: 'px-[26px] py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    icon,
    children,
    className,
    disabled,
    type = 'button',
    ...buttonProps
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border-[1.5px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full justify-center',
        className,
      )}
      disabled={isDisabled}
      type={type}
      {...buttonProps}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
});
