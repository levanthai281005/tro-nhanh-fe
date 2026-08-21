import { z } from 'zod';

/**
 * Ràng buộc thực thể `Contract` (hợp đồng thuê) — `DATA_ENTITIES.md`, BR-006.
 */

export const CONTRACT_STATUS_VALUES = ['Draft', 'Active', 'Expired', 'Terminated'] as const;
export type ContractStatus = (typeof CONTRACT_STATUS_VALUES)[number];

export const contractStatusSchema = z.enum(CONTRACT_STATUS_VALUES);

/** `YYYY-MM-DD`. */
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const contractDateSchema = z.string().regex(ISO_DATE_PATTERN, 'Ngày chưa hợp lệ');

export const contractMoneySchema = z
  .number({ invalid_type_error: 'Số tiền phải là số' })
  .nonnegative('Số tiền không được âm');

export const contractSchema = z
  .object({
    roomId: z.string().min(1, 'Vui lòng chọn phòng'),
    occupancyId: z.string().min(1, 'Vui lòng chọn người đại diện đứng tên hợp đồng'),
    startDate: contractDateSchema,
    endDate: contractDateSchema,
    rentPrice: contractMoneySchema,
    deposit: contractMoneySchema,
  })
  .refine((value) => value.endDate > value.startDate, {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
    path: ['endDate'],
  });

export type ContractInput = z.infer<typeof contractSchema>;

/**
 * Hai khoảng thời gian có chồng lấn không — BR-006.
 *
 * Khoảng hợp đồng là **đóng hai đầu**: hợp đồng kết thúc 31/12 và hợp đồng bắt đầu 31/12 là
 * chồng lấn, vì cùng một ngày phòng không thể thuộc về hai hợp đồng. Nhầm chỗ này thành nửa
 * mở sẽ để lọt đúng trường hợp hay gặp nhất: ký tiếp ngay ngày người cũ trả phòng.
 */
export function hasDateRangeOverlap(
  left: { startDate: string; endDate: string },
  right: { startDate: string; endDate: string },
): boolean {
  return left.startDate <= right.endDate && right.startDate <= left.endDate;
}

/** Chuyển trạng thái hợp lệ theo BR-006: `Draft → Active → (Expired | Terminated)`. */
export const ALLOWED_CONTRACT_STATUS_TRANSITIONS: Record<
  ContractStatus,
  readonly ContractStatus[]
> = {
  Draft: ['Active'],
  Active: ['Expired', 'Terminated'],
  Expired: [],
  Terminated: [],
};
