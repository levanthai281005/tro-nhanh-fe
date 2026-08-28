import type { InvoiceItemType } from '@tronhanh/schemas';
import type { CreateInvoiceItemInput, InvoiceRoomOption } from '@/features/workspace/types/invoice';

/**
 * Dựng các dòng hóa đơn từ hợp đồng + chỉ số đã ghi + phí dịch vụ.
 *
 * **Đây là phần prototype không có.** `InvoicePreview` của nó gán cứng tiền điện 150.000đ và
 * tiền nước 100.000đ vào ô nhập, hoàn toàn không đọc `UtilityReading` — tức là "hóa đơn" ở
 * prototype không nối với chỉ số công tơ, và mỗi phòng đều ra cùng một số tiền điện. Ở đây số
 * tiền được tính từ lượng tiêu thụ thật nhân đơn giá **đã chốt trong bản ghi chỉ số**.
 *
 * Hàm thuần, không đụng store — để chỗ gọi tính lại tổng ngay khi người dùng sửa một ô.
 */

export interface InvoiceDraftLine extends CreateInvoiceItemInput {
  /** Khóa ổn định để React không vẽ lại nhầm dòng khi bật/tắt các khoản. */
  key: string;
  /** Người dùng có thể bỏ chọn khoản không muốn thu kỳ này (VD tháng đầu chưa tính dịch vụ). */
  isIncluded: boolean;
  /** Nhắc vì sao dòng này chưa có số — chỉ số chưa ghi thì không tự bịa ra được. */
  missingReason?: string;
}

const ITEM_TYPE_LABELS: Record<InvoiceItemType, string> = {
  Rent: 'Tiền phòng',
  Electricity: 'Tiền điện',
  Water: 'Tiền nước',
  Service: 'Phí dịch vụ',
  Deposit: 'Tiền cọc',
  Other: 'Khoản khác',
};

export function getInvoiceItemLabel(type: InvoiceItemType): string {
  return ITEM_TYPE_LABELS[type];
}

export function buildInvoiceDraft(
  room: InvoiceRoomOption,
  period: string,
): readonly InvoiceDraftLine[] {
  const utilityLines = (['Electricity', 'Water'] as const).map((type) => {
    const snapshot = type === 'Electricity' ? room.electricity : room.water;
    const unit = type === 'Electricity' ? 'kWh' : 'm³';

    if (!snapshot) {
      return {
        key: type,
        type,
        description: `${ITEM_TYPE_LABELS[type]} kỳ ${period}`,
        quantity: 0,
        unitPrice: 0,
        amount: 0,
        isIncluded: false,
        missingReason: `Chưa ghi chỉ số ${type === 'Electricity' ? 'điện' : 'nước'} kỳ này`,
      } satisfies InvoiceDraftLine;
    }

    return {
      key: type,
      type,
      // Ghi thẳng cặp chỉ số vào diễn giải: người ở nhìn hóa đơn phải tự đối chiếu được với
      // công tơ, không phải tin vào một con số tổng.
      description: `${snapshot.previousReading} → ${snapshot.currentReading} ${unit}`,
      quantity: snapshot.consumption,
      unitPrice: snapshot.unitPrice,
      amount: snapshot.amount,
      isIncluded: true,
    } satisfies InvoiceDraftLine;
  });

  return [
    {
      key: 'Rent',
      type: 'Rent',
      description: `Tiền phòng kỳ ${period}`,
      quantity: 1,
      unitPrice: room.rentPrice,
      amount: room.rentPrice,
      isIncluded: true,
    },
    ...utilityLines,
    {
      key: 'Service',
      type: 'Service',
      description: `Phí dịch vụ kỳ ${period}`,
      quantity: 1,
      unitPrice: room.servicePrice,
      amount: room.servicePrice,
      // Phí dịch vụ 0đ vẫn là một khoản hợp lệ, nhưng không có lý do in một dòng 0đ lên hóa đơn.
      isIncluded: room.servicePrice > 0,
    },
  ];
}

/** Hạn thanh toán mặc định: ngày 5 của tháng liền sau kỳ — thói quen phổ biến ở nhà trọ. */
export function defaultDueDate(period: string): string {
  const [year, month] = period.split('-').map(Number);
  if (!year || !month) return period;
  const isDecember = month === 12;
  const nextYear = isDecember ? year + 1 : year;
  const nextMonth = isDecember ? 1 : month + 1;
  return `${nextYear}-${String(nextMonth).padStart(2, '0')}-05`;
}
