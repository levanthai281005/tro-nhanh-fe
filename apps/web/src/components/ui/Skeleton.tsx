import type { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'card' | 'row' | 'text';
  count?: number;
}

export function Skeleton(props: SkeletonProps) {
  void props;
  return null;
}
