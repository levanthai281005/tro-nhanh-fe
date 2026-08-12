'use client';

import { SectionError } from '@/components/section-error';

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  return <SectionError reset={reset} title="Không thể tải trang" />;
}
