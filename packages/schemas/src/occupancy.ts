import { z } from 'zod';

/**
 * Ràng buộc thực thể `Occupancy` (người ở) — `DATA_ENTITIES.md`, Module 7.
 *
 * **Occupancy không phải là role.** Đây là quan hệ "người này đang ở phòng này", suy từ dữ
 * liệu; `residencyStatus` của tài khoản Renter được suy tiếp từ đây.
 */

/** BR-029 — gắn Renter vào Occupancy phải qua xác nhận, không bao giờ tự động `Confirmed`. */
export const OCCUPANCY_LINK_STATUS_VALUES = ['Pending', 'Confirmed', 'Rejected'] as const;
export type OccupancyLinkStatus = (typeof OCCUPANCY_LINK_STATUS_VALUES)[number];

/** `null` khi Occupancy chưa gắn tài khoản nào (thêm tay bằng tên + SĐT — fallback Module 7). */
export const occupancyLinkStatusSchema = z.enum(OCCUPANCY_LINK_STATUS_VALUES).nullable();

export const occupantNameSchema = z
  .string()
  .trim()
  .min(2, 'Tên người ở cần ít nhất 2 ký tự')
  .max(120, 'Tên người ở tối đa 120 ký tự');

/** SĐT Việt Nam: bắt đầu bằng 0, tổng 10 số. Là định danh duy nhất toàn hệ thống (BR-016). */
export const occupantPhoneSchema = z
  .string()
  .trim()
  .regex(/^0\d{9}$/, 'Số điện thoại chưa hợp lệ (10 số, bắt đầu bằng 0)');
