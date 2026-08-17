import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface FormFieldProps {
  label: string;
  children: ReactNode;
  /** Chỉ đánh dấu ở trường thật sự bắt buộc — đánh tràn lan thì dấu sao mất ý nghĩa. */
  isRequired?: boolean;
  hint?: string;
  error?: string;
  className?: string;
}

export function FormField({
  label,
  children,
  isRequired = false,
  hint,
  error,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[13px] font-bold text-ink">
        {label}
        {isRequired ? <span className="ml-1 text-error">*</span> : null}
      </span>
      {hint ? <span className="text-xs leading-normal text-ink-muted">{hint}</span> : null}
      {children}
      {error ? (
        <span className="text-xs font-semibold text-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export const inputClassName =
  'w-full rounded-sm border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-sand';

export const inputErrorClassName = 'border-error focus:border-error';
