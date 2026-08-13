'use client';

import type { ReactNode } from 'react';

export interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
}

export function ModalShell(props: ModalShellProps) {
  void props;
  return null;
}
