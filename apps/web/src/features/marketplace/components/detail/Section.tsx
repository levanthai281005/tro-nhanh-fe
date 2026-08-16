import type { ReactNode } from 'react';

export interface DetailSectionProps {
  title: string;
  children: ReactNode;
  isLast?: boolean;
}

export function DetailSection({ children }: DetailSectionProps) {
  return <>{children}</>;
}
