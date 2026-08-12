import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from '@/lib/AppProviders';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Trọ Nhanh',
    template: '%s | Trọ Nhanh',
  },
  description: 'Nền tảng kết nối chủ trọ và người thuê.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi">
      <body className="bg-canvas font-sans text-ink antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
