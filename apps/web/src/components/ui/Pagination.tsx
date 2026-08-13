'use client';

import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({
  page,
  pageSize,
  total,
  onChange,
  className,
  ...containerProps
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) return null;

  const buttonClasses =
    'rounded-sm border border-line bg-surface px-3 py-1.5 font-medium text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:text-ink-muted disabled:opacity-50';

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 py-3 text-[13px] text-ink-muted',
        className,
      )}
      {...containerProps}
    >
      <button
        aria-label="Đến trang trước"
        className={buttonClasses}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        type="button"
      >
        Trước
      </button>
      <span className="px-1">
        Trang <strong className="text-ink">{page}</strong> / {totalPages}
      </span>
      <button
        aria-label="Đến trang sau"
        className={buttonClasses}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        type="button"
      >
        Sau
      </button>
    </div>
  );
}
