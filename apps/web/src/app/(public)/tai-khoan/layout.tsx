import type { ReactNode } from 'react';
import { AccountShell } from '@/components/shells/AccountShell';

export default function AccountLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <AccountShell>{children}</AccountShell>;
}
