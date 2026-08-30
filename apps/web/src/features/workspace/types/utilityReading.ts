import type { UtilityType } from '@tronhanh/schemas';

/** Chỉ số công tơ một kỳ — entity `UtilityReading`, unique (roomId, type, period). */
export interface UtilityReading {
  id: string;
  roomId: string;
  type: UtilityType;
  /** `YYYY-MM`. */
  period: string;
  previousReading: number;
  currentReading: number;
  /**
   * Đơn giá **chốt cứng** tại thời điểm ghi (`DATABASE_DESIGN.md` §10.2).
   *
   * Không tra ngược sang khu lúc xuất hóa đơn: chủ trọ tăng giá điện tháng sau thì hóa đơn
   * các kỳ đã ghi phải giữ nguyên số tiền cũ.
   */
  unitPrice: number;
  /** Khác `null` = đã lên hóa đơn, không sửa được nữa. */
  invoiceId: string | null;
  createdAt: string;
}

/** Một phòng trong bảng ghi chỉ số của kỳ — gộp sẵn cả điện lẫn nước để không phải tra hai lần. */
export interface UtilityReadingRow {
  roomId: string;
  roomCode: string;
  propertyId: string;
  /** BR-006 — chỉ phòng có hợp đồng `Active` mới lên hóa đơn được, nên chỉ phòng đó mới ghi. */
  contractId: string;
  occupantName: string;
  electricity: UtilityReadingCell;
  water: UtilityReadingCell;
}

export interface UtilityReadingCell {
  /** Chỉ số cuối của **kỳ liền trước**, không phải bản ghi mới nhất theo thời điểm tạo. */
  previousReading: number;
  /** Đã ghi kỳ này chưa; `null` = ô còn trống. */
  currentReading: number | null;
  unitPrice: number;
  /** Đã lên hóa đơn thì khóa ô, kèm kỳ để giải thích. */
  invoicedAt: string | null;
}

/** Một ô người dùng vừa nhập, gửi lên khi bấm Lưu. */
export interface UtilityReadingDraft {
  roomId: string;
  type: UtilityType;
  currentReading: number;
}

export interface SaveUtilityReadingsInput {
  period: string;
  drafts: readonly UtilityReadingDraft[];
}
