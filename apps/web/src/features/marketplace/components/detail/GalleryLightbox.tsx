'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export interface GalleryLightboxProps {
  images: readonly string[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

function getSafeIndex(index: number, length: number) {
  if (length === 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

export function GalleryLightbox({ images, initialIndex, open, onClose }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(() => getSafeIndex(initialIndex, images.length));

  useEffect(() => {
    if (!open) return;

    setActiveIndex(getSafeIndex(initialIndex, images.length));
  }, [images.length, initialIndex, open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => getSafeIndex(current - 1, images.length));
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => getSafeIndex(current + 1, images.length));
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [images.length, onClose, open]);

  if (!open || images.length === 0) return null;

  const image = images[activeIndex];
  if (!image) return null;
  const hasMultipleImages = images.length > 1;
  const showPrevious = () =>
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % images.length);

  return (
    <div
      aria-label="Xem ảnh phòng"
      aria-modal="true"
      className="fixed inset-0 z-[350] flex items-center justify-center bg-ink/95 p-4 md:p-8"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="relative flex h-full w-full max-w-[1280px] items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          alt={`Ảnh phòng ${activeIndex + 1}`}
          className="object-contain"
          fill
          priority
          sizes="100vw"
          src={image}
        />

        <button
          aria-label="Đóng xem ảnh"
          className="absolute right-0 top-0 inline-flex size-11 items-center justify-center rounded-full bg-surface/95 text-ink shadow-lg transition-colors hover:bg-surface"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        {hasMultipleImages ? (
          <>
            <button
              aria-label="Ảnh trước"
              className="absolute left-0 inline-flex size-11 items-center justify-center rounded-full bg-surface/95 text-ink shadow-lg transition-colors hover:bg-surface"
              onClick={showPrevious}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="size-6" />
            </button>
            <button
              aria-label="Ảnh tiếp theo"
              className="absolute right-0 inline-flex size-11 items-center justify-center rounded-full bg-surface/95 text-ink shadow-lg transition-colors hover:bg-surface"
              onClick={showNext}
              type="button"
            >
              <ChevronRight aria-hidden="true" className="size-6" />
            </button>
            <p className="absolute bottom-0 rounded-full bg-ink/70 px-3 py-1.5 text-sm font-semibold text-surface">
              {activeIndex + 1} / {images.length}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
