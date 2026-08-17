import { z } from 'zod';

/**
 * Ràng buộc thực thể `RentalListing` — bản sao phía client của hợp đồng với backend
 * (`VALIDATION_RULES.md`). Chỉ chứa luật thuộc về **dữ liệu**, không chứa luật thuộc về
 * giao diện: việc form chia làm mấy bước là chuyện của feature, backend không biết tới.
 */

export const PROPERTY_TYPE_VALUES = ['BoardingRoom', 'ServicedApartment', 'Apartment'] as const;
export const ACCESS_POLICY_VALUES = ['Free', 'Restricted'] as const;

/** Giờ dạng `HH:mm`, 00:00–23:59. */
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** SĐT Việt Nam: bắt đầu bằng 0, tổng 10 số. */
const VN_PHONE_PATTERN = /^0\d{9}$/;

export const listingTitleSchema = z
  .string()
  .trim()
  .min(10, 'Tiêu đề cần ít nhất 10 ký tự')
  .max(120, 'Tiêu đề tối đa 120 ký tự');

export const listingPriceSchema = z
  .number({ invalid_type_error: 'Giá thuê phải là số' })
  .positive('Giá thuê phải lớn hơn 0');

export const listingAreaSchema = z
  .number({ invalid_type_error: 'Diện tích phải là số' })
  .positive('Diện tích phải lớn hơn 0');

export const listingPhoneSchema = z
  .string()
  .trim()
  .regex(VN_PHONE_PATTERN, 'Số điện thoại chưa hợp lệ (10 số, bắt đầu bằng 0)');

/** Ảnh tối thiểu 3 (VALIDATION_RULES.md). */
export const listingMediaSchema = z.array(z.string().min(1)).min(3, 'Cần ít nhất 3 ảnh của phòng');

/**
 * Giờ ra vào. `Restricted` bắt buộc có đủ giờ mở và giờ đóng — thiếu một trong hai thì
 * thông tin vô nghĩa với người đi thuê.
 */
export const accessPolicySchema = z
  .object({
    accessPolicy: z.enum(ACCESS_POLICY_VALUES),
    accessOpenTime: z.string().regex(TIME_PATTERN, 'Giờ không hợp lệ (định dạng HH:mm)').nullable(),
    accessCloseTime: z
      .string()
      .regex(TIME_PATTERN, 'Giờ không hợp lệ (định dạng HH:mm)')
      .nullable(),
  })
  .refine(
    (value) => value.accessPolicy === 'Free' || (!!value.accessOpenTime && !!value.accessCloseTime),
    {
      message: 'Chọn giờ giới hạn thì phải nhập cả giờ mở và giờ đóng cửa',
      path: ['accessOpenTime'],
    },
  );

export const rentalListingSchema = z.object({
  title: listingTitleSchema,
  propertyType: z.enum(PROPERTY_TYPE_VALUES),
  address: z.string().trim().min(1, 'Vui lòng nhập địa chỉ cụ thể'),
  district: z.string().trim().min(1, 'Vui lòng chọn khu vực'),
  area: listingAreaSchema,
  price: listingPriceSchema,
  description: z.string().trim().min(10, 'Mô tả cần ít nhất 10 ký tự'),
  contactPhone: listingPhoneSchema,
  accessPolicy: z.enum(ACCESS_POLICY_VALUES),
  accessOpenTime: z.string().regex(TIME_PATTERN).nullable(),
  accessCloseTime: z.string().regex(TIME_PATTERN).nullable(),
  electricityPrice: z.number().nonnegative().nullable(),
  waterPrice: z.number().nonnegative().nullable(),
  servicePrice: z.number().nonnegative().nullable(),
  deposit: z.number().nonnegative().nullable(),
});

export type RentalListingInput = z.infer<typeof rentalListingSchema>;
