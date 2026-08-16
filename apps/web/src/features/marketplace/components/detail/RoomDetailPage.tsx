import type { ListingCardView } from '@/features/marketplace/types/listings';
import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';

export interface RoomDetailPageProps {
  detail: ListingDetailData;
  similarListings: readonly ListingCardView[];
}

export function RoomDetailPage({ detail }: RoomDetailPageProps) {
  return <div data-listing-id={detail.record.listing.id} data-testid="room-detail-page" />;
}
