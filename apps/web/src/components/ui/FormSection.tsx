import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Một nhóm trường có tiêu đề.
 *
 * Form dài mà không chia nhóm là một cột mười ô nhập liền nhau, không có chỗ nào cho mắt
 * nghỉ, nên người dùng phải đọc từng nhãn mới biết form dài tới đâu. Chia nhóm cho thấy ngay
 * hình dạng của việc phải làm.
 */
export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <div>
        <h3 className="m-0 text-xs font-bold uppercase tracking-[0.05em] text-ink-muted">
          {title}
        </h3>
        {description ? <p className="m-0 mt-1 text-[13px] text-ink-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
