import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
  ...containerProps
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center px-4 py-8 text-center', className)}
      {...containerProps}
    >
      {icon ? <div className="mb-3 flex items-center justify-center text-sand">{icon}</div> : null}
      <h4 className="m-0 text-base font-bold text-ink">{title}</h4>
      {description ? (
        <p className="mt-1 max-w-[360px] text-[13px] leading-6 text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
