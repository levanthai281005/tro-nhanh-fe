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

/**
 * Hộp cho một ô nhập.
 *
 * Nền **kem nhạt** chứ không trắng: thẻ bao ngoài đã trắng rồi, ô trắng trên nền trắng thì
 * viền `line` quá nhạt để nhận ra đâu là chỗ gõ. Prototype đạt tương phản này theo chiều
 * ngược lại — nền trang màu kem, ô nhập màu trắng — nhưng cùng một nguyên tắc: ô phải khác
 * nền của nó.
 */
export const fieldBoxClassName =
  'w-full rounded-sm border-[1.5px] border-sand/55 bg-canvas transition-colors focus-within:border-sand hover:border-sand/80';

export const inputClassName = `${fieldBoxClassName} px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted/60 focus:border-sand`;

export const inputErrorClassName = 'border-error focus:border-error hover:border-error';

/**
 * Bọc `AppSelect` vào cùng hộp với ô chữ.
 *
 * Trigger của `AppSelect` cố ý không có viền (`bg-transparent p-0`) để nơi dùng tự quyết
 * khung — nên nếu không bọc, ô chọn sẽ trôi lơ lửng cạnh những ô có viền, trông như hai hệ
 * giao diện khác nhau.
 */
export function FieldBox({
  children,
  hasError,
  className,
}: {
  children: ReactNode;
  hasError?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        fieldBoxClassName,
        'px-3.5 py-2.5',
        hasError && 'border-error hover:border-error',
        className,
      )}
    >
      {children}
    </div>
  );
}
