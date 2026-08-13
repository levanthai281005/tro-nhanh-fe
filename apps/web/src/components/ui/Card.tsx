'use client';

import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card(props: CardProps) {
  void props;
  return null;
}
