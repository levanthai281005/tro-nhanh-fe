import type {
  ListingCardView,
  ListingRecord,
} from '@/features/marketplace/types/listings';
import { isFutureDate } from '@/features/marketplace/utils/listingOrdering';

const RECENT_LISTING_WINDOW_MS = 72 * 60 * 60 * 1000;

function getListingBadge(record: ListingRecord, now: number): ListingCardView['badge'] {
  if (isFutureDate(record.listing.boostExpireAt, now)) return 'Tin nổi bật';

  const createdAt = Date.parse(record.listing.createdAt);
  if (Number.isFinite(createdAt) && now - createdAt <= RECENT_LISTING_WINDOW_MS) {
    return 'Mới đăng';
  }

  return null;
}

export function toListingCardView(record: ListingRecord, now = Date.now()): ListingCardView {
  return {
    id: record.listing.id,
    title: record.listing.title,
    price: record.listing.price,
    area: record.listing.area,
    location: `${record.listing.district}, TP.HCM`,
    imageUrl: record.media[0]?.url ?? '',
    amenities: record.amenities.map(({ icon, name }) => ({ icon, name })),
    propertyType: record.listing.propertyType,
    badge: getListingBadge(record, now),
  };
}
