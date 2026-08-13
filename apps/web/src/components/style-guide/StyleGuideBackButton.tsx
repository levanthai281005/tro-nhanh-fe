'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function StyleGuideBackButton() {
  const router = useRouter();

  return (
    <button
      className="mb-4 inline-flex items-center gap-1.5 rounded-sm border border-surface/20 bg-surface/10 px-3.5 py-1.5 text-[13px] font-semibold text-cream transition-colors hover:bg-surface/20"
      onClick={() => router.back()}
      type="button"
    >
      <ArrowLeft aria-hidden="true" className="size-[13px]" />
      Trang chủ
    </button>
  );
}
