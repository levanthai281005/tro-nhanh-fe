import { z } from 'zod';

/**
 * Ràng buộc thực thể `Invoice`, `InvoiceItem`, `UtilityReading` và `Payment` —
 * `DATA_ENTITIES.md`, `VALIDATION_RULES.md`, BR-004.
 */

/** BR-004 — **đúng bốn** giá trị, suy tự động từ ΣPayment. Không có `Draft`, không có `Sent`. */
export const INVOICE_STATUS_VALUES = ['Unpaid', 'PartiallyPaid', 'Paid', 'Overdue'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUS_VALUES)[number];

export const invoiceStatusSchema = z.enum(INVOICE_STATUS_VALUES);

/** `STATUS_ENUMS.md` — sáu loại dòng hóa đơn. Prototype chỉ chấp nhận năm (thiếu `Deposit`). */
export const INVOICE_ITEM_TYPE_VALUES = [
  'Rent',
  'Electricity',
  'Water',
  'Service',
  'Deposit',
  'Other',
] as const;
export type InvoiceItemType = (typeof INVOICE_ITEM_TYPE_VALUES)[number];

export const invoiceItemTypeSchema = z.enum(INVOICE_ITEM_TYPE_VALUES);

export const UTILITY_TYPE_VALUES = ['Electricity', 'Water'] as const;
export type UtilityType = (typeof UTILITY_TYPE_VALUES)[number];

export const utilityTypeSchema = z.enum(UTILITY_TYPE_VALUES);

export const PAYMENT_METHOD_VALUES = ['Cash', 'BankTransfer'] as const;
export type PaymentMethod = (typeof PAYMENT_METHOD_VALUES)[number];

export const paymentMethodSchema = z.enum(PAYMENT_METHOD_VALUES);

/** Kỳ hóa đơn `YYYY-MM` — so sánh được bằng chuỗi, nên mọi nơi sắp xếp kỳ đều dùng dạng này. */
const PERIOD_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export const periodSchema = z
  .string()
  .regex(PERIOD_PATTERN, 'Kỳ phải có dạng YYYY-MM, ví dụ 2026-08');

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const invoiceDateSchema = z.string().regex(ISO_DATE_PATTERN, 'Ngày chưa hợp lệ');

export const invoiceMoneySchema = z
  .number({ invalid_type_error: 'Số tiền phải là số' })
  .nonnegative('Số tiền không được âm');

/**
 * Chỉ số công tơ — `VALIDATION_RULES.md`: `currentReading ≥ previousReading`, `unitPrice ≥ 0`,
 * unique (roomId, type, period).
 *
 * Đơn giá là **một trường của bản ghi**, không phải tra ngược sang khu lúc xuất hóa đơn: đơn
 * giá được chốt cứng tại thời điểm ghi chỉ số (quyết định ba tầng ở `DATABASE_DESIGN.md`
 * §10.2), nên chủ trọ đổi giá điện tháng sau không làm đổi số tiền của các kỳ đã ghi.
 */
export const utilityReadingSchema = z
  .object({
    roomId: z.string().min(1, 'Thiếu phòng'),
    type: utilityTypeSchema,
    period: periodSchema,
    previousReading: z
      .number({ invalid_type_error: 'Chỉ số phải là số' })
      .nonnegative('Chỉ số không được âm'),
    currentReading: z
      .number({ invalid_type_error: 'Chỉ số phải là số' })
      .nonnegative('Chỉ số không được âm'),
    unitPrice: invoiceMoneySchema,
  })
  .refine((value) => value.currentReading >= value.previousReading, {
    message: 'Chỉ số mới không được nhỏ hơn chỉ số cũ',
    path: ['currentReading'],
  });

export type UtilityReadingInput = z.infer<typeof utilityReadingSchema>;

export const invoiceItemSchema = z.object({
  type: invoiceItemTypeSchema,
  description: z.string().trim().min(1, 'Dòng hóa đơn phải có diễn giải').max(120),
  quantity: z.number({ invalid_type_error: 'Số lượng phải là số' }).nonnegative(),
  unitPrice: invoiceMoneySchema,
  amount: invoiceMoneySchema,
});

/**
 * Hóa đơn kỳ — unique (contractId, period).
 *
 * `contractId` **bắt buộc**: khóa unique của bảng đặt trên nó, và hợp đồng là căn cứ pháp lý
 * cho tiền thuê. Phòng chưa có hợp đồng `Active` thì chưa xuất hóa đơn được (BR-006).
 */
export const invoiceSchema = z
  .object({
    roomId: z.string().min(1, 'Vui lòng chọn phòng'),
    contractId: z.string().min(1, 'Phòng phải có hợp đồng đang hiệu lực'),
    period: periodSchema,
    dueDate: invoiceDateSchema,
    items: z.array(invoiceItemSchema).min(1, 'Hóa đơn phải có ít nhất một khoản thu'),
  })
  .refine((value) => value.items.some((item) => item.amount > 0), {
    message: 'Tổng hóa đơn đang bằng 0 — hãy nhập ít nhất một khoản có số tiền',
    path: ['items'],
  });

export type InvoiceInput = z.infer<typeof invoiceSchema>;

/**
 * Một lần ghi nhận thu — AS-002, chủ trọ nhận tiền ngoài nền tảng rồi tự bấm "Đã thu".
 *
 * `amount > 0` chứ không phải `≥ 0`: ghi nhận 0 đồng không đổi được gì mà vẫn đẻ ra một dòng
 * trong lịch sử thu, khiến hóa đơn trông như đã có người trả tiền.
 */
export const paymentSchema = z.object({
  invoiceId: z.string().min(1, 'Thiếu hóa đơn'),
  amount: z
    .number({ invalid_type_error: 'Số tiền phải là số' })
    .positive('Số tiền thu phải lớn hơn 0'),
  method: paymentMethodSchema,
  paidAt: invoiceDateSchema,
  note: z.string().trim().max(200).nullable(),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
