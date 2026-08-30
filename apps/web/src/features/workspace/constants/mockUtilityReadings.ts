import type { UtilityReading } from '@/features/workspace/types/utilityReading';

/**
 * Chỉ số điện nước mẫu — bảng riêng, unique (roomId, type, period).
 *
 * Chỉ seed cho **bốn phòng có hợp đồng Active**, đúng như luồng thật: BR-006 buộc hóa đơn gắn
 * hợp đồng, nên phòng trống không có gì để ghi.
 *
 * Bố trí cố ý để mở màn lên là thấy đủ các trạng thái ô: đã ghi và đã lên hóa đơn (khóa), đã
 * ghi nhưng chưa lên hóa đơn (sửa được), và chưa ghi (ô trống).
 */

const P101 = '70000000-0000-4000-8000-000000000001';
const P201 = '70000000-0000-4000-8000-000000000004';
const P301 = '70000000-0000-4000-8000-000000000007';
const BINH_LOI_A1 = '70000000-0000-4000-8000-000000000009';

const INVOICE_P101_07 = 'b0000000-0000-4000-8000-000000000001';
const INVOICE_P201_07 = 'b0000000-0000-4000-8000-000000000002';
const INVOICE_P301_08 = 'b0000000-0000-4000-8000-000000000003';
const INVOICE_A1_08 = 'b0000000-0000-4000-8000-000000000004';

function reading(seed: {
  id: string;
  roomId: string;
  type: UtilityReading['type'];
  period: string;
  previousReading: number;
  currentReading: number;
  unitPrice: number;
  invoiceId?: string | null;
}): UtilityReading {
  return {
    id: seed.id,
    roomId: seed.roomId,
    type: seed.type,
    period: seed.period,
    previousReading: seed.previousReading,
    currentReading: seed.currentReading,
    unitPrice: seed.unitPrice,
    invoiceId: seed.invoiceId ?? null,
    createdAt: `${seed.period}-28T00:00:00.000Z`,
  };
}

export const MOCK_UTILITY_READINGS: readonly UtilityReading[] = [
  // ── Kỳ 2026-07 ────────────────────────────────────────────────────────────────────────
  // P101 và P201 đã lên hóa đơn; P301 và A1 ghi rồi nhưng chủ trọ chưa xuất hóa đơn kỳ đó.
  reading({
    id: 'a0000000-0000-4000-8000-000000000001',
    roomId: P101,
    type: 'Electricity',
    period: '2026-07',
    previousReading: 1265,
    currentReading: 1352,
    unitPrice: 3500,
    invoiceId: INVOICE_P101_07,
  }),
  reading({
    id: 'a0000000-0000-4000-8000-000000000002',
    roomId: P101,
    type: 'Water',
    period: '2026-07',
    previousReading: 42,
    currentReading: 46,
    unitPrice: 15000,
    invoiceId: INVOICE_P101_07,
  }),
  // P201 có đơn giá điện riêng 3.700đ (`Room.electricityPrice`), khác giá khu 3.500đ — đơn giá
  // được chốt vào bản ghi, nên hóa đơn kỳ này giữ 3.700đ kể cả khi khu đổi giá sau đó.
  reading({
    id: 'a0000000-0000-4000-8000-000000000003',
    roomId: P201,
    type: 'Electricity',
    period: '2026-07',
    previousReading: 2118,
    currentReading: 2201,
    unitPrice: 3700,
    invoiceId: INVOICE_P201_07,
  }),
  reading({
    id: 'a0000000-0000-4000-8000-000000000004',
    roomId: P201,
    type: 'Water',
    period: '2026-07',
    previousReading: 58,
    currentReading: 62,
    unitPrice: 15000,
    invoiceId: INVOICE_P201_07,
  }),
  reading({
    id: 'a0000000-0000-4000-8000-000000000005',
    roomId: P301,
    type: 'Electricity',
    period: '2026-07',
    previousReading: 1010,
    currentReading: 1122,
    unitPrice: 3500,
  }),
  reading({
    id: 'a0000000-0000-4000-8000-000000000006',
    roomId: P301,
    type: 'Water',
    period: '2026-07',
    previousReading: 35,
    currentReading: 41,
    unitPrice: 15000,
  }),
  reading({
    id: 'a0000000-0000-4000-8000-000000000007',
    roomId: BINH_LOI_A1,
    type: 'Electricity',
    period: '2026-07',
    previousReading: 468,
    currentReading: 519,
    unitPrice: 3800,
  }),
  reading({
    id: 'a0000000-0000-4000-8000-000000000008',
    roomId: BINH_LOI_A1,
    type: 'Water',
    period: '2026-07',
    previousReading: 15,
    currentReading: 18,
    unitPrice: 18000,
  }),

  // ── Kỳ 2026-08 ────────────────────────────────────────────────────────────────────────
  // P101 ghi rồi chưa xuất hóa đơn (sửa được); P201 chưa ghi (ô trống); P301 và A1 đã lên
  // hóa đơn nên khóa.
  reading({
    id: 'a0000000-0000-4000-8000-000000000009',
    roomId: P101,
    type: 'Electricity',
    period: '2026-08',
    previousReading: 1352,
    currentReading: 1440,
    unitPrice: 3500,
  }),
  reading({
    id: 'a0000000-0000-4000-8000-000000000010',
    roomId: P101,
    type: 'Water',
    period: '2026-08',
    previousReading: 46,
    currentReading: 50,
    unitPrice: 15000,
  }),
  reading({
    id: 'a0000000-0000-4000-8000-000000000011',
    roomId: P301,
    type: 'Electricity',
    period: '2026-08',
    previousReading: 1122,
    currentReading: 1240,
    unitPrice: 3500,
    invoiceId: INVOICE_P301_08,
  }),
  reading({
    id: 'a0000000-0000-4000-8000-000000000012',
    roomId: P301,
    type: 'Water',
    period: '2026-08',
    previousReading: 41,
    currentReading: 47,
    unitPrice: 15000,
    invoiceId: INVOICE_P301_08,
  }),
  reading({
    id: 'a0000000-0000-4000-8000-000000000013',
    roomId: BINH_LOI_A1,
    type: 'Electricity',
    period: '2026-08',
    previousReading: 519,
    currentReading: 566,
    unitPrice: 3800,
    invoiceId: INVOICE_A1_08,
  }),
  reading({
    id: 'a0000000-0000-4000-8000-000000000014',
    roomId: BINH_LOI_A1,
    type: 'Water',
    period: '2026-08',
    previousReading: 18,
    currentReading: 21,
    unitPrice: 18000,
    invoiceId: INVOICE_A1_08,
  }),
];
