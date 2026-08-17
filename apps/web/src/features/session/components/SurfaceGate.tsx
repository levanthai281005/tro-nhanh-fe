'use client';

import type { SurfaceId } from '@tronhanh/access';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useSurfaceAccess } from '@/features/session/hooks/useSurfaceAccess';

/**
 * Cổng vào một màn hình thuộc Surface có gating.
 *
 * Mức `limited` và `none` **không** render nội dung: chúng thay bằng panel giải thích kèm lối
 * gỡ. Đây là chỗ vá lỗ mà bản prototype từng dính — dashboard chặn ở nút điều hướng, còn màn
 * quản lý phòng thì gõ thẳng URL vào là ghi được.
 */
export function SurfaceGate({ surface, children }: { surface: SurfaceId; children: ReactNode }) {
  const { level, denial } = useSurfaceAccess(surface);

  if (level === 'full' || level === 'read') return <>{children}</>;

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-cream">
        <Lock aria-hidden="true" className="size-6 text-primary" />
      </span>
      <h1 className="mb-2 text-xl font-extrabold text-ink">Tính năng chưa mở</h1>
      <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-ink-muted">
        {denial?.message ?? 'Bạn chưa có quyền dùng khu vực này.'}
      </p>
      {denial?.redirectTo ? (
        <Link
          className="inline-flex items-center rounded-sm bg-primary px-5 py-2.5 text-sm font-bold text-surface transition-colors hover:bg-primary-hover"
          href={denial.redirectTo}
        >
          Dùng thử bộ quản lý
        </Link>
      ) : null}
    </div>
  );
}
