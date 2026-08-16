'use client';

import {
  Bath,
  Car,
  Clock,
  Home,
  Layers,
  MapPin,
  Star,
  Wifi,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { KeyboardEvent } from 'react';
import { Card } from '@/components/ui/Card';
import { SaveListingButton } from '@/features/marketplace/components/SaveListingButton';
import type { ListingCardView } from '@/features/marketplace/types/listings';
import { cn } from '@/utils/cn';

export interface RoomCardProps {
  listing: ListingCardView;
  variant: 'mobile' | 'desktop' | 'list';
}

const AMENITY_META: Readonly<Record<string, LucideIcon>> = {
  wifi: Wifi,
  ac: Wind,
  parking: Car,
  bath: Bath,
  clock: Clock,
  loft: Layers,
  furniture: Home,
};

function formatListingPrice(price: number) {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tr`;
  }
  return `${price.toLocaleString('vi-VN')} đ`;
}

export function RoomCard({ listing, variant }: RoomCardProps) {
  const router = useRouter();
  const openListing = () => router.push(`/phong/${listing.id}`);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openListing();
    }
  };

  return (
    <Card
      aria-label={`Xem tin ${listing.title}`}
      className={cn(
        'group flex overflow-hidden p-0',
        variant === 'mobile'
          ? 'min-h-[140px] flex-row'
          : variant === 'list'
            ? 'min-h-[172px] flex-row'
            : 'h-full flex-col',
      )}
      data-listing-id={listing.id}
      data-testid="listing-card"
      hoverable
      onClick={openListing}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <div
        className={cn(
          'relative shrink-0 overflow-hidden',
          variant === 'mobile'
            ? 'w-[140px]'
            : variant === 'list'
              ? 'w-[220px]'
              : 'h-[190px] w-full',
        )}
      >
        <Image
          alt={listing.title}
          className="object-cover transition duration-500 group-hover:scale-105"
          fill
          sizes={
            variant === 'mobile'
              ? '140px'
              : variant === 'list'
                ? '220px'
                : '(min-width: 1024px) 25vw, 50vw'
          }
          src={listing.imageUrl}
        />
        <SaveListingButton listingId={listing.id} overlay size={15} />
        <span className="absolute left-3 top-3 rounded-full bg-status-available px-2.5 py-1 text-[10.5px] font-bold text-surface shadow-sm">
          Còn trống
        </span>
        {listing.badge ? (
          <span
            className={cn(
              'absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-bold text-surface shadow-sm',
              listing.badge === 'Tin nổi bật' ? 'bg-primary' : 'bg-accent-warn',
            )}
          >
            {listing.badge === 'Tin nổi bật' ? (
              <Star aria-hidden="true" className="size-2.5 fill-surface" strokeWidth={0} />
            ) : null}
            {listing.badge}
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 text-left">
        <h3 className="mb-2 line-clamp-2 text-[14.5px] font-bold leading-[1.45] text-ink">
          {listing.title}
        </h3>
        <p className="mb-1.5 text-[19px] font-extrabold tracking-[-0.01em] text-primary">
          {formatListingPrice(listing.price)}
          <span className="text-xs font-normal text-ink-muted">/tháng</span>
        </p>
        <div className="mb-3.5 flex items-center gap-1 text-xs font-medium text-ink-muted">
          <MapPin aria-hidden="true" className="size-3 shrink-0" />
          <span className="truncate">
            {listing.area} m² · {listing.location}
          </span>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {listing.amenities.slice(0, 3).map((amenity) => {
            const Icon = AMENITY_META[amenity.icon];
            if (!Icon) return null;
            return (
              <span
                key={amenity.icon}
                className="inline-flex items-center gap-1 rounded-sm border border-line bg-sand/5 px-2 py-1 text-[11px] font-semibold text-ink-muted"
              >
                <Icon aria-hidden="true" className="size-[11px] text-primary" strokeWidth={2.2} />
                {amenity.name}
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
