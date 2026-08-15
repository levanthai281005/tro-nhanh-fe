import type { ReactNode } from 'react';

export default function WorkspaceLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-canvas px-6 py-4 font-bold text-primary">
        Trọ Nhanh · Chủ trọ
      </header>
      {children}
    </div>
  );
}
