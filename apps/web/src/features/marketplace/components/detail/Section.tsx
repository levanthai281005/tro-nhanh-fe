import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface DetailSectionProps {
  title: string;
  children: ReactNode;
  isLast?: boolean;
}

export function DetailSection({ title, children, isLast = false }: DetailSectionProps) {
  return (
    <section className={cn('pb-7', !isLast && 'mb-7 border-b border-line')}>
      <h2 className="mb-4 text-base font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}
