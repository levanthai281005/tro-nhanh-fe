import { MOCK_LISTING_RECORDS } from '@/features/marketplace/constants/mockListings';
import type {
  ListingRecord,
  ListingSearchParams,
  ListingSearchResult,
} from '@/features/marketplace/types/listings';
import { normalizeVietnamese } from '@/utils/normalizeVietnamese';
import { matchesAreaRange, matchesPriceRange } from '@/features/marketplace/utils/catalogBounds';
import { isFutureDate, sortListingsByBoost } from '@/features/marketplace/utils/listingOrdering';
import { toListingCardView } from '@/features/marketplace/utils/toListingCardView';

const MOCK_REQUEST_DELAY_MS = 180;

function waitForMockRequest() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_REQUEST_DELAY_MS);
  });
}

function matchesKeyword(record: ListingRecord, keyword: string) {
  const normalizedKeyword = normalizeVietnamese(keyword.trim());
  if (!normalizedKeyword) return true;

  return [record.listing.title, record.listing.address, record.listing.district].some((value) =>
    normalizeVietnamese(value).includes(normalizedKeyword),
  );
}

function compareListings(
  left: ListingRecord,
  right: ListingRecord,
  sort: ListingSearchParams['sort'],
) {
  if (sort === 'price-asc') return left.listing.price - right.listing.price;
  if (sort === 'price-desc') return right.listing.price - left.listing.price;
  if (sort === 'area-desc') return right.listing.area - left.listing.area;
  return right.listing.createdAt.localeCompare(left.listing.createdAt);
}

function isPublicActiveListing(record: ListingRecord, now: number) {
  return (
    record.listing.status === 'Active' &&
    (!record.listing.expireAt || isFutureDate(record.listing.expireAt, now))
  );
}

function matchesFilters(record: ListingRecord, filters: ListingSearchParams) {
  if (!matchesKeyword(record, filters.keyword)) return false;
  if (!matchesPriceRange(record.listing.price, filters.priceRange)) return false;
  if (!matchesAreaRange(record.listing.area, filters.areaRange)) return false;
  if (
    filters.propertyTypes.length > 0 &&
    !filters.propertyTypes.includes(record.listing.propertyType)
  ) {
    return false;
  }

  return filters.amenities.every((amenity) =>
    record.amenities.some((listingAmenity) => listingAmenity.name === amenity),
  );
}

// TODO: nối API thật khi packages/types sinh xong:
// GET /public/search/listings qua @tronhanh/api. Response type sẽ lấy từ @tronhanh/types,
// còn bộ lọc client giữ đúng query contract thay vì tự tạo DTO API ở đây.
export async function searchListings(params: ListingSearchParams): Promise<ListingSearchResult> {
  await waitForMockRequest();
  const now = Date.now();
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, params.pageSize);
  const filteredRecords = MOCK_LISTING_RECORDS.filter(
    (record) => isPublicActiveListing(record, now) && matchesFilters(record, params),
  );
  const sortedRecords = sortListingsByBoost(
    filteredRecords,
    (record) => record.listing.boostExpireAt,
    (left, right) => compareListings(left, right, params.sort),
    now,
  );
  const total = sortedRecords.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const resolvedPage = Math.min(page, totalPages);
  const pageStart = (resolvedPage - 1) * pageSize;

  return {
    items: sortedRecords.slice(pageStart, pageStart + pageSize).map((record) => toListingCardView(record, now)),
    total,
    page: resolvedPage,
    pageSize,
    totalPages,
  };
}
