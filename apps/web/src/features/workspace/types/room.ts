import type { RoomStatus } from '@tronhanh/schemas';

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

/** Người ở hiện tại, rút gọn cho thẻ phòng. Chi tiết đầy đủ thuộc B9/B10. */
export interface RoomOccupantSummary {
  fullName: string;
  phoneNumber: string;
  occupantCount: number;
}

export interface RoomListItem extends Room {
  occupant: RoomOccupantSummary | null;
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
