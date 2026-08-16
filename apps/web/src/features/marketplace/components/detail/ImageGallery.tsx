'use client';

import Image from 'next/image';
import { useState } from 'react';
import { SaveListingButton } from '@/features/marketplace/components/SaveListingButton';
import { GalleryLightbox } from '@/features/marketplace/components/detail/GalleryLightbox';

export interface ImageGalleryProps {
  images: readonly string[];
  listingId: string;
  viewerId?: string;
  title: string;
}

export function ImageGallery({ images, listingId, viewerId, title }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const visibleImages = images.slice(0, 5);

  if (visibleImages.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed border-line bg-cream text-sm font-medium text-ink-muted">
        Tin này chưa có ảnh để hiển thị.
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-lg" data-testid="detail-image-gallery">
        <div className="grid h-[420px] grid-cols-4 grid-rows-2 gap-1.5 bg-line">
          {visibleImages.map((image, index) => {
            const isPrimary = index === 0;
            const isLastVisible =
              index === visibleImages.length - 1 && images.length > visibleImages.length;

            return (
              <button
                aria-label={`Mở ảnh ${index + 1} của ${title}`}
                className={`group relative overflow-hidden bg-cream ${
                  isPrimary ? 'col-span-2 row-span-2' : ''
                }`}
                key={image}
                onClick={() => setLightboxIndex(index)}
                type="button"
              >
                <Image
                  alt={`${title} – ảnh ${index + 1}`}
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  fill
                  priority={isPrimary}
                  sizes={isPrimary ? '(min-width: 1024px) 50vw, 100vw' : '25vw'}
                  src={image}
                />
                {isLastVisible ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm font-extrabold text-surface">
                    +{images.length - visibleImages.length} ảnh
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <SaveListingButton listingId={listingId} overlay size={19} viewerId={viewerId} />
      </div>
      <GalleryLightbox
        images={images}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        open={lightboxIndex !== null}
      />
    </>
  );
}
