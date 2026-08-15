import {
  MOCK_FEATURED_LISTING_RECORDS,
  MOCK_HOME_DEMAND_POST_RECORDS,
} from '@/features/marketplace/constants/mockHomeData';
import type {
  DemandPostCardView,
  FeaturedListingCardView,
  HomeDemandPostRecord,
} from '@/features/marketplace/types/home';

const MOCK_REQUEST_DELAY_MS = 180;

function waitForMockRequest() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_REQUEST_DELAY_MS);
  });
}

function isFutureDate(value: string | null, now: number) {
  if (!value) return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp > now;
}

function toFeaturedListingCard(
  record: (typeof MOCK_FEATURED_LISTING_RECORDS)[number],
  now: number,
): FeaturedListingCardView {
  const isBoosted = isFutureDate(record.listing.boostExpireAt, now);
  return {
    id: record.listing.id,
    title: record.listing.title,
    price: record.listing.price,
    area: record.listing.area,
    location: `${record.listing.district}, TP.HCM`,
    imageUrl: record.media[0]?.url ?? '',
    amenities: record.amenities.map(({ icon, name }) => ({ icon, name })),
    badge: isBoosted ? 'Tin nổi bật' : 'Mới đăng',
  };
}

// TODO: nối API thật khi packages/types sinh xong:
// GET /public/listings?status=Active&limit={limit} qua @tronhanh/api.
export async function getFeaturedListings(limit = 4): Promise<readonly FeaturedListingCardView[]> {
  await waitForMockRequest();
  const now = Date.now();

  return MOCK_FEATURED_LISTING_RECORDS.filter(
    (record) =>
      record.listing.status === 'Active' &&
      (!record.listing.expireAt || isFutureDate(record.listing.expireAt, now)),
  )
    .toSorted((left, right) => {
      const leftBoosted = isFutureDate(left.listing.boostExpireAt, now);
      const rightBoosted = isFutureDate(right.listing.boostExpireAt, now);
      if (leftBoosted !== rightBoosted) return leftBoosted ? -1 : 1;
      return right.listing.createdAt.localeCompare(left.listing.createdAt);
    })
    .slice(0, Math.max(0, limit))
    .map((record) => toFeaturedListingCard(record, now));
}

function initialsFromName(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0).toLocaleUpperCase('vi-VN'))
    .join('');
}

const PROPERTY_TYPE_LABELS = {
  BoardingRoom: 'Phòng trọ',
  ServicedApartment: 'Căn hộ dịch vụ',
  Apartment: 'Căn hộ',
} as const;

function toDemandPostCard(record: HomeDemandPostRecord): DemandPostCardView {
  const common = {
    id: record.post.id,
    renterId: record.post.renterId,
    name: record.poster.fullName,
    initials: initialsFromName(record.poster.fullName),
  };

  if (record.kind === 'RoomWanted') {
    return {
      ...common,
      kind: record.kind,
      title: `Tìm ${PROPERTY_TYPE_LABELS[record.post.propertyType]} tại ${record.post.desiredDistricts[0] ?? 'TP. Hồ Chí Minh'}`,
      tags: record.post.desiredAmenities,
      desiredDistricts: record.post.desiredDistricts,
      priceMin: record.post.priceMin,
      priceMax: record.post.priceMax,
      propertyType: record.post.propertyType,
      moveInDate: record.post.moveInDate,
    };
  }

  return {
    ...common,
    kind: record.kind,
    title: `Tìm ${record.post.neededCount} bạn ở ghép tại ${record.post.district}`,
    tags: record.post.requirements,
    district: record.post.district,
    sharePrice: record.post.sharePrice,
    neededCount: record.post.neededCount,
    genderRequirement: record.post.genderRequirement,
  };
}

// TODO: nối API thật khi packages/types sinh xong:
// GET /public/room-wanted-posts và GET /public/roommate-wanted-posts qua @tronhanh/api.
export async function listActiveDemandPosts(): Promise<readonly DemandPostCardView[]> {
  await waitForMockRequest();
  const now = Date.now();

  return MOCK_HOME_DEMAND_POST_RECORDS.filter(
    (record) => record.post.status === 'Active' && isFutureDate(record.post.expireAt, now),
  )
    .toSorted((left, right) => right.post.updatedAt.localeCompare(left.post.updatedAt))
    .map(toDemandPostCard);
}
