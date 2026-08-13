'use client';

import type { ReactNode } from 'react';

export type WorkspaceStatus = 'NONE' | 'TRIAL' | 'ACTIVE' | 'READ_ONLY';

export interface WorkspaceShellProps {
  children: ReactNode;
  workspaceStatus?: WorkspaceStatus;
  trialDaysLeft?: number;
}

export function WorkspaceShell(props: WorkspaceShellProps) {
  void props;
  return null;
}
