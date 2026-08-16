'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { SaveListingButton } from '@/features/marketplace/components/SaveListingButton';
import { GalleryLightbox } from '@/features/marketplace/components/detail/GalleryLightbox';

export interface MobileImageCarouselProps {
  images: readonly string[];
  listingId: string;
  viewerId?: string;
  title: string;
}

export function MobileImageCarousel({
  images,
  listingId,
  viewerId,
  title,
}: MobileImageCarouselProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setActiveIndex(Math.round(container.scrollLeft / Math.max(1, container.clientWidth)));
  };

  if (images.length === 0) {
    return (
      <div className="relative flex h-[300px] items-center justify-center bg-cream text-sm font-medium text-ink-muted">
        Tin này chưa có ảnh để hiển thị.
      </div>
    );
  }

  return (
    <>
      <div className="relative bg-cream" data-testid="detail-mobile-image-carousel">
        <div
          className="flex h-[300px] snap-x snap-mandatory overflow-x-auto"
          onScroll={handleScroll}
          ref={scrollRef}
        >
          {images.map((image, index) => (
            <button
              aria-label={`Mở ảnh ${index + 1} của ${title}`}
              className="relative w-full shrink-0 snap-center"
              key={image}
              onClick={() => {
                setActiveIndex(index);
                setLightboxOpen(true);
              }}
              type="button"
            >
              <Image
                alt={`${title} – ảnh ${index + 1}`}
                className="object-cover"
                fill
                priority={index === 0}
                sizes="100vw"
                src={image}
              />
            </button>
          ))}
        </div>
        <button
          aria-label="Quay lại"
          className="absolute left-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-surface/95 text-ink shadow-sm"
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </button>
        <SaveListingButton listingId={listingId} overlay size={18} viewerId={viewerId} />
        {images.length > 1 ? (
          <p className="absolute bottom-4 right-4 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-bold text-surface">
            {activeIndex + 1}/{images.length}
          </p>
        ) : null}
      </div>
      <GalleryLightbox
        images={images}
        initialIndex={activeIndex}
        onClose={() => setLightboxOpen(false)}
        open={lightboxOpen}
      />
    </>
  );
}
