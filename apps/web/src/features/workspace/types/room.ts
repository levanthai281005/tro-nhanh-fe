import type { OccupancyLinkStatus, RoomStatus } from '@tronhanh/schemas';

/** Phòng — entity `Room`, `DATA_ENTITIES.md`. */
export interface Room {
  id: string;
  propertyId: string;
  roomCode: string;
  floor: number;
  area: number;
  price: number;
  status: RoomStatus;
  note: string | null;
  /** `null` = thừa hưởng đơn giá của khu (khác `0` = miễn phí). */
  electricityPrice: number | null;
  waterPrice: number | null;
  servicePrice: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Một người ở trong phòng — bản rút gọn của `Occupancy`. Quản lý đầy đủ thuộc B10.
 *
 * Một `Room` có thể có **nhiều Occupancy Active đồng thời** (bạn cùng phòng, cả gia đình).
 * Không phải "một người ở kèm số lượng người": mỗi người là một bản ghi riêng, có SĐT riêng,
 * và trạng thái liên kết tài khoản riêng (BR-029).
 */
export interface RoomOccupant {
  id: string;
  fullName: string;
  phoneNumber: string;
  /**
   * Occupancy đứng tên `Contract` của phòng. Mỗi Room tối đa **một** Contract Active
   * (BR-006), nên tối đa một người đại diện.
   */
  isContractRepresentative: boolean;
  /** `null` khi chưa gắn tài khoản Renter nào (thêm tay bằng tên + SĐT — Module 7). */
  linkStatus: OccupancyLinkStatus | null;
}

export interface RoomListItem extends Room {
  occupants: readonly RoomOccupant[];
  /**
   * BR-027 — phòng đang có `RentalListing` ở trạng thái `Active` gắn với nó. Dùng cho badge
   * "Có tin đang chạy" và để chặn tạo tin thứ hai từ cùng một phòng.
   */
  hasActiveListing: boolean;
  /** BR-006 — có hợp đồng `Active` không; ảnh hưởng quyền xóa phòng. */
  hasActiveContract: boolean;
}

export interface RoomsResult {
  items: readonly RoomListItem[];
  counts: Record<RoomStatus | 'all', number>;
}

export type RoomFilter = RoomStatus | 'all';

export const ROOM_SORT_VALUES = ['recent', 'code', 'price-desc', 'status'] as const;
export type RoomSort = (typeof ROOM_SORT_VALUES)[number];

export interface RoomFormValues {
  propertyId: string;
  roomCode: string;
  floor: string;
  area: string;
  price: string;
  status: RoomStatus;
  note: string;
  hasCustomPricing: boolean;
  electricityPrice: string;
  waterPrice: string;
  servicePrice: string;
}
