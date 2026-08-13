'use client';

import { MapPin, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { KeyboardEvent } from 'react';
import { Card } from '@/components/ui/Card';
import { SaveListingButton } from '@/features/marketplace/components/SaveListingButton';
import type { SavedListingCardView } from '@/features/marketplace/types/savedListings';

export interface SavedListingCardProps {
  listing: SavedListingCardView;
  renterId: string;
}

function formatListingPrice(price: number) {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tr`;
  }
  return `${price.toLocaleString('vi-VN')} đ`;
}

export function SavedListingCard({ listing, renterId }: SavedListingCardProps) {
  const router = useRouter();
  const detailHref = `/phong/${listing.id}`;
  const openListing = () => router.push(detailHref);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') openListing();
  };

  return (
    <Card
      aria-label={`Xem tin ${listing.title}`}
      className="overflow-hidden p-0"
      data-testid="saved-listing-card"
      hoverable
      onClick={openListing}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <div className="relative h-[168px]">
        <Image
          alt={listing.title}
          className="object-cover"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          src={listing.imageUrl}
        />
        <SaveListingButton listingId={listing.id} overlay size={16} viewerId={renterId} />
      </div>
      <div className="flex flex-col gap-[7px] px-[15px] py-[13px]">
        <p className="m-0 text-sm font-bold leading-[1.4] text-ink">{listing.title}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[12.5px] text-ink-muted">
            <MapPin aria-hidden="true" className="size-3 text-sand" />
            {listing.location}
          </span>
          <span className="inline-flex items-center gap-1 text-[12.5px] text-ink-muted">
            <Maximize2 aria-hidden="true" className="size-3 text-sand" />
            {listing.area} m²
          </span>
        </div>
        <span className="text-[15px] font-extrabold text-primary">
          {formatListingPrice(listing.price)}
          <span className="text-xs font-normal text-ink-muted">/tháng</span>
        </span>
      </div>
    </Card>
  );
}
