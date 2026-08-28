import type { InvoiceItemType, InvoiceStatus, PaymentMethod } from '@tronhanh/schemas';

/** Một dòng hóa đơn — entity `InvoiceItem`. */
export interface InvoiceItem {
  id: string;
  type: InvoiceItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

/** Một lần ghi nhận thu — entity `Payment`. Chủ trọ nhận tiền ngoài nền tảng rồi tự bấm. */
export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  /** `YYYY-MM-DD`. */
  paidAt: string;
  note: string | null;
  createdAt: string;
}

/** Hóa đơn kỳ — entity `Invoice`, unique (contractId, period). */
export interface Invoice {
  id: string;
  roomId: string;
  /** Bắt buộc — khóa unique đặt trên nó, và hợp đồng là căn cứ cho tiền thuê (BR-006). */
  contractId: string;
  period: string;
  dueDate: string;
  totalAmount: number;
  items: readonly InvoiceItem[];
  /** `null` = chưa gửi cho người ở. */
  sentAt: string | null;
  createdAt: string;
}

/**
 * Một dòng trong danh sách B12 — đã gộp phòng, khu, tiền đã thu và trạng thái.
 *
 * `status` và `paidAmount` là **giá trị dẫn xuất do service tính** (đóng vai backend). Component
 * chỉ đọc, không tự suy — `STATUS_ENUMS.md` nói thẳng client không được tính trạng thái này.
 */
export interface InvoiceListItem extends Invoice {
  /** Mã hóa đơn đọc được: `P101-202608`. */
  code: string;
  /**
   * Nội dung chuyển khoản in lên mã VietQR — **đã rút gọn đảm bảo ≤ 25 ký tự**.
   *
   * Không dùng thẳng `code`: mã phòng dài tới 20 ký tự thì `code` vượt giới hạn của NAPAS và
   * bị cắt cụt trong im lặng, đúng cạm bẫy đã ghi lại. `buildInvoiceTransferNote` rút gọn có
   * chủ đích và có test khóa lại.
   */
  transferNote: string;
  roomCode: string;
  propertyId: string;
  propertyName: string;
  occupantName: string;
  status: InvoiceStatus;
  paidAmount: number;
  /** Luôn ≥ 0. Nút "Đã thu" và số tiền trên mã QR đều bám vào số này, không bám `totalAmount`. */
  remainingAmount: number;
  payments: readonly Payment[];
  /** Thông tin nhận tiền của khu — nguồn dựng VietQR, `null` khi khu chưa khai báo. */
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
}

export interface CreateInvoiceItemInput {
  type: InvoiceItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CreateInvoiceInput {
  roomId: string;
  contractId: string;
  period: string;
  dueDate: string;
  items: readonly CreateInvoiceItemInput[];
}

export interface RecordPaymentInput {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  note: string | null;
}

/** Số liệu đầu màn — tổng của **tập đang lọc**, không phải của toàn bộ hóa đơn. */
export interface InvoiceSummaryTotals {
  invoiceCount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  overdueCount: number;
  overdueAmount: number;
}

export interface InvoicesResult {
  items: readonly InvoiceListItem[];
  totals: InvoiceSummaryTotals;
  /** Các kỳ thực sự có hóa đơn — dựng dropdown lọc thay vì bịa 12 tháng cứng. */
  periods: readonly string[];
}

/** Phòng đủ điều kiện xuất hóa đơn cho một kỳ, kèm số liệu để điền sẵn form. */
export interface InvoiceRoomOption {
  roomId: string;
  roomCode: string;
  propertyId: string;
  propertyName: string;
  contractId: string;
  occupantName: string;
  /** Tiền thuê lấy từ **hợp đồng**, không lấy `Room.price` — giá phòng có thể đã đổi sau ngày ký. */
  rentPrice: number;
  servicePrice: number;
  /** Đã có hóa đơn kỳ này chưa — unique (contractId, period). */
  hasInvoiceForPeriod: boolean;
  electricity: InvoiceUtilitySnapshot | null;
  water: InvoiceUtilitySnapshot | null;
}

/** Chỉ số đã ghi của kỳ, để dựng sẵn dòng điện/nước trên hóa đơn. */
export interface InvoiceUtilitySnapshot {
  readingId: string;
  previousReading: number;
  currentReading: number;
  unitPrice: number;
  consumption: number;
  amount: number;
  /** Đã bị một hóa đơn khác dùng chưa. */
  isInvoiced: boolean;
}
