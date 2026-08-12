'use client';

import { RotateCcw } from 'lucide-react';

type SectionErrorProps = {
  title: string;
  reset: () => void;
};

export function SectionError({ title, reset }: SectionErrorProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="text-ink-muted">
        Đã xảy ra lỗi ngoài ý muốn. Bạn có thể thử tải lại khu vực này.
      </p>
      <button
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-semibold text-cream hover:bg-primary-hover"
        onClick={reset}
        type="button"
      >
        <RotateCcw aria-hidden="true" size={18} />
        Thử lại
      </button>
    </main>
  );
}
