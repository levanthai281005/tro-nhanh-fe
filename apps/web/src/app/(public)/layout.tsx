import type { ReactNode } from 'react';
import { BottomTabBar } from '@/components/navigation/BottomTabBar';
import { PublicNavbar } from '@/components/navigation/PublicNavbar';

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <PublicNavbar />
      <div className="flex-1">{children}</div>
      <BottomTabBar />
    </div>
  );
}
