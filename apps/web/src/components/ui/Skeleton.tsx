import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'card' | 'row' | 'text';
  count?: number;
}

export function Skeleton({
  variant = 'text',
  count = 1,
  className,
  ...containerProps
}: SkeletonProps) {
  const items = Array.from({ length: Math.max(0, count) });

  if (variant === 'card') {
    return (
      <div aria-hidden="true" className={cn('flex flex-col gap-3', className)} {...containerProps}>
        {items.map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2.5 rounded-lg border border-line bg-surface p-4"
          >
            <div className="h-[140px] animate-pulse rounded-md bg-cream" />
            <div className="h-[18px] w-[70%] animate-pulse rounded-sm bg-cream" />
            <div className="h-3.5 w-[40%] animate-pulse rounded-sm bg-cream" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div aria-hidden="true" className={cn('flex flex-col gap-2', className)} {...containerProps}>
        {items.map((_, index) => (
          <div key={index} className="h-10 w-full animate-pulse rounded-sm bg-cream" />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={cn('flex flex-col gap-2', className)} {...containerProps}>
      {items.map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-4 animate-pulse rounded-sm bg-cream',
            index === items.length - 1 && items.length > 1 ? 'w-[60%]' : 'w-full',
          )}
        />
      ))}
    </div>
  );
}
