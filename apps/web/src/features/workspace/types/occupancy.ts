import type { OccupancyLinkStatus } from '@tronhanh/schemas';

/**
 * Một người đang ở (hoặc từng ở) trong phòng — entity `Occupancy`, Module 7.
 *
 * **Không phải role.** Đây là quan hệ "người này ở phòng này"; `residencyStatus` của tài khoản
 * Renter được suy tiếp từ đây. Một `Room` có **nhiều Occupancy Active đồng thời**; `Contract`
 * chỉ gắn **một** Occupancy đại diện (BR-006).
 */
export interface Occupancy {
  id: string;
  roomId: string;
  /** `null` = thêm tay bằng tên + SĐT, người này chưa có tài khoản (fallback Module 7). */
  userId: string | null;
  /** `null` ⟺ `userId` null. Không bao giờ tự nhảy sang `Confirmed` (BR-029). */
  linkStatus: OccupancyLinkStatus | null;
  fullName: string;
  phoneNumber: string;
  /** `YYYY-MM-DD`. */
  startDate: string;
  /** `null` = đang ở. Có giá trị = đã kết thúc, vào lịch sử. */
  endDate: string | null;
  /** Số nhân khẩu của **bản ghi này**, không phải của cả phòng. */
  occupantCount: number;
  note: string | null;
  /**
   * Người đứng tên `Contract` của phòng.
   *
   * Ở mô hình thật đây là giá trị **suy ra** từ `contracts.occupancy_id`; giữ thành cờ ở đây
   * vì B11 chưa có, và để B8/B10 hiển thị được ngay. Khi làm B11 thì bỏ cờ này, đọc từ hợp
   * đồng — ghi lại để không quên.
   */
  isContractRepresentative: boolean;
  createdAt: string;
}

/** Kết quả tra SĐT khi thêm người ở — quyết định gắn tài khoản hay dùng fallback. */
export interface RenterLookupResult {
  /** `null` = SĐT chưa có tài khoản Trọ Nhanh nào. */
  userId: string | null;
  /** Tên trên hồ sơ tài khoản, để chủ trọ đối chiếu trước khi gửi lời mời. */
  fullName: string | null;
}

export interface AddOccupancyInput {
  roomId: string;
  fullName: string;
  phoneNumber: string;
  startDate: string;
  occupantCount: number;
  note: string;
  /** Gắn vào tài khoản tìm được qua SĐT. `null` = thêm fallback, không gắn ai. */
  linkedUserId: string | null;
  /** Chỉ định luôn làm người đại diện hợp đồng của phòng. */
  isContractRepresentative: boolean;
}

/**
 * Đang ở hay đã kết thúc — suy từ `endDate`, không lưu cờ riêng để khỏi lệch.
 *
 * `endDate` là ngày **bắt đầu không còn ở nữa**, nên đặt bằng hôm nay là chuyển vào lịch sử
 * ngay. Dùng `>=` thì chủ trọ bấm "Kết thúc ở", chọn hôm nay, rồi thấy người đó vẫn nằm ở mục
 * "Đang ở" tới hết ngày — trông như thao tác không ăn.
 */
export function isActiveOccupancy(occupancy: Occupancy, today = new Date()): boolean {
  if (occupancy.endDate === null) return true;
  return occupancy.endDate > today.toISOString().slice(0, 10);
}

/**
 * Đã hẹn ngày rời đi nhưng chưa tới ngày.
 *
 * Vẫn là người đang ở, nhưng phải hiển thị khác "Đang ở" — báo trước một tháng là chuyện bình
 * thường, và chủ trọ cần thấy phòng nào sắp trống để còn đăng tin.
 */
export function isEndingSoon(occupancy: Occupancy, today = new Date()): boolean {
  return occupancy.endDate !== null && isActiveOccupancy(occupancy, today);
}
