import type { RentalListingStatus } from '@/features/marketplace/types/savedListings';

/** Bộ lọc trạng thái ở trang quản lý tin. `Boosted` không phải một `RentalListingStatus`
 *  (BR-001 chỉ có 7 giá trị) — nó lọc theo `boostExpireAt` còn hạn, xem BR-005. */
export type MyListingStatusFilter = 'all' | RentalListingStatus | 'Boosted';

export type MyListingSort = 'newest' | 'oldest' | 'price-asc' | 'price-desc';

export interface MyListingFilters {
  keyword: string;
  status: MyListingStatusFilter;
  district: string;
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
}

/** Dòng hiển thị ở bảng/card quản lý tin — view model, không phải entity. */
export interface MyListingRow {
  id: string;
  title: string;
  district: string;
  price: number;
  area: number;
  status: RentalListingStatus;
  imageUrl: string;
  updatedAt: string;
  createdAt: string;
  expireAt: string | null;
  boostExpireAt: string | null;
  rejectReason: string | null;
  isBoosted: boolean;
  /** Tin hết hạn hiển thị thì gia hạn được (BR-026). */
  canRenew: boolean;
}

/** Bốn chỉ số suy trực tiếp từ danh sách tin — không có số nào cần backend đếm riêng. */
export interface MyListingStats {
  total: number;
  active: number;
  boosted: number;
  hidden: number;
}

export interface MyListingsResult {
  rows: readonly MyListingRow[];
  stats: MyListingStats;
  districts: readonly string[];
}

export interface BoostPackage {
  days: number;
  price: number;
}
