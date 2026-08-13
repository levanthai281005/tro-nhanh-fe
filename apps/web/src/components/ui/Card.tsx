'use client';

import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable = false, className, onClick, ...cardProps }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-line bg-surface p-4 shadow-sm transition duration-200',
        hoverable && '-translate-y-0 cursor-pointer shadow-lg',
        hoverable && 'hover:-translate-y-0.5 hover:shadow-xl',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      {...cardProps}
    />
  );
}
