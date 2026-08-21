import type { Contract } from '@/features/workspace/types/contract';

/**
 * Hợp đồng mẫu — bảng riêng, gắn `roomId` và `occupancyId` của người đại diện.
 *
 * Cố ý phủ đủ bốn trạng thái BR-006 và cả trường hợp sắp hết hạn, để màn danh sách có gì mà
 * hiển thị ngay khi mở lần đầu.
 */
function contract(seed: {
  id: string;
  roomId: string;
  occupancyId: string;
  startDate: string;
  endDate: string;
  rentPrice: number;
  deposit: number;
  status: Contract['status'];
  terminateReason?: string | null;
}): Contract {
  return {
    id: seed.id,
    roomId: seed.roomId,
    occupancyId: seed.occupancyId,
    startDate: seed.startDate,
    endDate: seed.endDate,
    rentPrice: seed.rentPrice,
    deposit: seed.deposit,
    status: seed.status,
    terminateReason: seed.terminateReason ?? null,
    createdAt: `${seed.startDate}T00:00:00.000Z`,
    updatedAt: `${seed.startDate}T00:00:00.000Z`,
  };
}

export const MOCK_CONTRACTS: readonly Contract[] = [
  // P101 — đang hiệu lực, còn hạn dài
  contract({
    id: '90000000-0000-4000-8000-000000000001',
    roomId: '70000000-0000-4000-8000-000000000001',
    occupancyId: '80000000-0000-4000-8000-000000000001',
    startDate: '2026-01-15',
    endDate: '2027-01-14',
    rentPrice: 3200000,
    deposit: 3200000,
    status: 'Active',
  }),

  // P201 — sắp hết hạn, để màn danh sách có cảnh báo thật
  contract({
    id: '90000000-0000-4000-8000-000000000002',
    roomId: '70000000-0000-4000-8000-000000000004',
    occupancyId: '80000000-0000-4000-8000-000000000004',
    startDate: '2025-11-01',
    endDate: '2026-09-05',
    rentPrice: 3600000,
    deposit: 3600000,
    status: 'Active',
  }),

  // P301
  contract({
    id: '90000000-0000-4000-8000-000000000003',
    roomId: '70000000-0000-4000-8000-000000000007',
    occupancyId: '80000000-0000-4000-8000-000000000008',
    startDate: '2026-04-05',
    endDate: '2027-04-04',
    rentPrice: 4200000,
    deposit: 4200000,
    status: 'Active',
  }),

  // Bình Lợi A1
  contract({
    id: '90000000-0000-4000-8000-000000000004',
    roomId: '70000000-0000-4000-8000-000000000009',
    occupancyId: '80000000-0000-4000-8000-000000000010',
    startDate: '2026-05-12',
    endDate: '2027-05-11',
    rentPrice: 2400000,
    deposit: 2400000,
    status: 'Active',
  }),

  // P201 — hợp đồng cũ của người đã chuyển đi, đã hết hạn tự nhiên
  contract({
    id: '90000000-0000-4000-8000-000000000005',
    roomId: '70000000-0000-4000-8000-000000000004',
    occupancyId: '80000000-0000-4000-8000-000000000007',
    startDate: '2025-03-01',
    endDate: '2025-10-31',
    rentPrice: 3500000,
    deposit: 3500000,
    status: 'Expired',
  }),

  // P103 — chấm dứt sớm, có lý do
  contract({
    id: '90000000-0000-4000-8000-000000000006',
    roomId: '70000000-0000-4000-8000-000000000003',
    occupancyId: '80000000-0000-4000-8000-000000000003',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    rentPrice: 2900000,
    deposit: 2900000,
    status: 'Terminated',
    terminateReason: 'Người ở chuyển công tác, hai bên thống nhất kết thúc sớm',
  }),
];
