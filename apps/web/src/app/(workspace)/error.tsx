'use client';

import { SectionError } from '@/components/section-error';

export default function WorkspaceError({ reset }: { error: Error; reset: () => void }) {
  return <SectionError reset={reset} title="Không thể tải không gian chủ trọ" />;
}
