import { RoomCard } from '@/features/marketplace/components/RoomCard';
import { DetailSection } from '@/features/marketplace/components/detail/Section';
import type { ListingCardView } from '@/features/marketplace/types/listings';

export interface SimilarRoomsProps {
  district: string;
  listings: readonly ListingCardView[];
}

export function SimilarRooms({ district, listings }: SimilarRoomsProps) {
  if (listings.length === 0) return null;

  return (
    <DetailSection isLast title={`Phòng tương tự khu vực ${district}`}>
      <div data-testid="similar-rooms">
        <div className="hidden grid-cols-3 gap-4 md:grid">
          {listings.map((listing) => (
            <RoomCard key={listing.id} listing={listing} variant="desktop" />
          ))}
        </div>
        <div className="flex flex-col gap-3 md:hidden">
          {listings.map((listing) => (
            <RoomCard key={listing.id} listing={listing} variant="mobile" />
          ))}
        </div>
      </div>
    </DetailSection>
  );
}
