'use client';

import type { HTMLAttributes } from 'react';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  variant?: 'success' | 'error';
  onClose?: () => void;
  duration?: number;
}

export function Toast(props: ToastProps) {
  void props;
  return null;
}
