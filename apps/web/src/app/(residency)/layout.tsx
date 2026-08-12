import type { ReactNode } from 'react';

export default function ResidencyLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line px-6 py-4 font-bold text-primary">
        Trọ Nhanh · Người ở
      </header>
      {children}
    </div>
  );
}
