import { ALL_DISTRICTS } from '@/features/marketplace/components/my-listings/MyListingsFilters';
import type {
  MyListingFilters,
  MyListingRow,
  MyListingSort,
} from '@/features/marketplace/types/myListings';
import { normalizeVietnamese } from '@/utils/normalizeVietnamese';

export const EMPTY_MY_LISTING_FILTERS: MyListingFilters = {
  keyword: '',
  status: 'all',
  district: ALL_DISTRICTS,
  priceMin: '',
  priceMax: '',
  areaMin: '',
  areaMax: '',
};

function normalize(value: string) {
  return normalizeVietnamese(value).replace(/\s+/g, ' ').trim();
}

function matchesBound(value: number, bound: string, compare: 'min' | 'max') {
  if (!bound.trim()) return true;
  const parsed = Number(bound);
  if (!Number.isFinite(parsed)) return true;
  return compare === 'min' ? value >= parsed : value <= parsed;
}

function matchesStatus(row: MyListingRow, status: MyListingFilters['status']) {
  if (status === 'all') return true;
  if (status === 'Boosted') return row.isBoosted;
  return row.status === status;
}

function compareRows(left: MyListingRow, right: MyListingRow, sort: MyListingSort) {
  if (sort === 'price-asc') return left.price - right.price;
  if (sort === 'price-desc') return right.price - left.price;
  if (sort === 'oldest') return left.createdAt.localeCompare(right.createdAt);
  return right.createdAt.localeCompare(left.createdAt);
}

/**
 * Lọc và sắp xếp tin của chính seller.
 *
 * Khác danh sách công khai: ở đây **không** áp BR-005 (boost xếp trước). Người bán cần thấy
 * tin theo đúng thứ tự họ chọn để quản lý, không phải theo thứ tự marketing.
 */
export function filterMyListings(
  rows: readonly MyListingRow[],
  filters: MyListingFilters,
  sort: MyListingSort,
): readonly MyListingRow[] {
  const keyword = normalize(filters.keyword);

  return rows
    .filter((row) => {
      if (keyword && !normalize(`${row.title} ${row.district}`).includes(keyword)) return false;
      if (!matchesStatus(row, filters.status)) return false;
      if (filters.district !== ALL_DISTRICTS && row.district !== filters.district) return false;
      if (!matchesBound(row.price, filters.priceMin, 'min')) return false;
      if (!matchesBound(row.price, filters.priceMax, 'max')) return false;
      if (!matchesBound(row.area, filters.areaMin, 'min')) return false;
      if (!matchesBound(row.area, filters.areaMax, 'max')) return false;
      return true;
    })
    .toSorted((left, right) => compareRows(left, right, sort));
}

/** Số bộ lọc nâng cao đang bật — hiển thị trên nút "Bộ lọc nâng cao". */
export function countAdvancedFilters(filters: MyListingFilters) {
  const bounds = [filters.priceMin, filters.priceMax, filters.areaMin, filters.areaMax];
  const activeBounds = bounds.filter((bound) => bound.trim().length > 0).length;
  return activeBounds + (filters.district !== ALL_DISTRICTS ? 1 : 0);
}
