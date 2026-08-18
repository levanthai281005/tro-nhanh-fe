import type { ContractStatus } from '@tronhanh/schemas';

/** Hợp đồng thuê — entity `Contract`, BR-006. */
export interface Contract {
  id: string;
  roomId: string;
  /** `Occupancy` **đại diện** đứng tên. Mỗi Room tối đa một hợp đồng Active. */
  occupancyId: string;
  startDate: string;
  endDate: string;
  rentPrice: number;
  deposit: number;
  status: ContractStatus;
  /** Bắt buộc khi `Terminated`. */
  terminateReason: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Một dòng trong danh sách B11 — đã gộp sẵn tên phòng, khu và người đại diện.
 *
 * Danh sách hợp đồng đọc theo **seller**, trải khắp mọi khu, nên mỗi dòng phải tự nói được nó
 * thuộc phòng nào của khu nào; bắt component tự tra ba bảng là cách chắc chắn để sinh N+1.
 */
export interface ContractListItem extends Contract {
  roomCode: string;
  propertyId: string;
  propertyName: string;
  occupantName: string;
  occupantPhone: string;
  /** Số ngày còn lại tới `endDate`. Âm nghĩa là đã quá hạn mà chưa ai đổi trạng thái. */
  daysRemaining: number;
}

export interface CreateContractInput {
  roomId: string;
  occupancyId: string;
  startDate: string;
  endDate: string;
  rentPrice: number;
  deposit: number;
}

/** BR-006 — job backend tự chuyển `Expired`; client chỉ cảnh báo trước. */
export const CONTRACT_EXPIRY_WARNING_DAYS = 30;

/** Một phòng có thể lập hợp đồng, kèm người ở để chọn người đại diện. */
export interface ContractRoomOption {
  roomId: string;
  roomCode: string;
  propertyId: string;
  propertyName: string;
  /** Giá thuê của phòng — điền sẵn vào form, chủ trọ sửa được. */
  defaultRentPrice: number;
  /** BR-006 — đã có hợp đồng Active thì không lập thêm được. */
  hasActiveContract: boolean;
  occupants: ReadonlyArray<{
    occupancyId: string;
    fullName: string;
    phoneNumber: string;
    isContractRepresentative: boolean;
  }>;
}
