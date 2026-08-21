import type { Occupancy } from '@/features/workspace/types/occupancy';

/**
 * Người ở mẫu — bảng **riêng**, không lồng trong phòng.
 *
 * Đúng hình dạng dữ liệu thật: `Occupancy` là entity độc lập gắn `roomId`, một phòng có nhiều
 * bản ghi cùng lúc, và bản ghi đã kết thúc (`endDate`) vẫn nằm lại làm lịch sử.
 */

const HOANG_DIEU_P101 = '70000000-0000-4000-8000-000000000001';
const HOANG_DIEU_P103 = '70000000-0000-4000-8000-000000000003';
const HOANG_DIEU_P201 = '70000000-0000-4000-8000-000000000004';
const HOANG_DIEU_P301 = '70000000-0000-4000-8000-000000000007';
const BINH_LOI_A1 = '70000000-0000-4000-8000-000000000009';
const BINH_LOI_B1 = '70000000-0000-4000-8000-000000000012';

function occupancy(seed: {
  id: string;
  roomId: string;
  fullName: string;
  phoneNumber: string;
  startDate: string;
  endDate?: string | null;
  occupantCount?: number;
  userId?: string | null;
  linkStatus?: Occupancy['linkStatus'];
  isContractRepresentative?: boolean;
  note?: string | null;
}): Occupancy {
  return {
    id: seed.id,
    roomId: seed.roomId,
    userId: seed.userId ?? null,
    linkStatus: seed.linkStatus ?? null,
    fullName: seed.fullName,
    phoneNumber: seed.phoneNumber,
    startDate: seed.startDate,
    endDate: seed.endDate ?? null,
    occupantCount: seed.occupantCount ?? 1,
    note: seed.note ?? null,
    isContractRepresentative: seed.isContractRepresentative ?? false,
    createdAt: `${seed.startDate}T00:00:00.000Z`,
  };
}

export const MOCK_OCCUPANCIES: readonly Occupancy[] = [
  // P101 — hai người, một đại diện, một đang chờ xác nhận liên kết
  occupancy({
    id: '80000000-0000-4000-8000-000000000001',
    roomId: HOANG_DIEU_P101,
    fullName: 'Trần Thị Mai',
    phoneNumber: '0905123456',
    startDate: '2026-01-15',
    occupantCount: 1,
    userId: '20000000-0000-4000-8000-000000000001',
    linkStatus: 'Confirmed',
    isContractRepresentative: true,
  }),
  occupancy({
    id: '80000000-0000-4000-8000-000000000002',
    roomId: HOANG_DIEU_P101,
    fullName: 'Nguyễn Hoàng Nam',
    phoneNumber: '0918445566',
    startDate: '2026-03-01',
    userId: '20000000-0000-4000-8000-000000000002',
    linkStatus: 'Pending',
  }),

  // P103 — đã nhận cọc, chưa lập hợp đồng nên chưa có ai đại diện. Trạng thái hợp lệ.
  occupancy({
    id: '80000000-0000-4000-8000-000000000003',
    roomId: HOANG_DIEU_P103,
    fullName: 'Lê Quốc Huy',
    phoneNumber: '0938777111',
    startDate: '2026-08-10',
    note: 'Đã đặt cọc, dọn vào đầu tháng sau',
  }),

  // P201 — cả gia đình ba người
  occupancy({
    id: '80000000-0000-4000-8000-000000000004',
    roomId: HOANG_DIEU_P201,
    fullName: 'Phạm Văn Đức',
    phoneNumber: '0977345678',
    startDate: '2025-11-01',
    occupantCount: 2,
    userId: '20000000-0000-4000-8000-000000000003',
    linkStatus: 'Confirmed',
    isContractRepresentative: true,
  }),
  occupancy({
    id: '80000000-0000-4000-8000-000000000005',
    roomId: HOANG_DIEU_P201,
    fullName: 'Phạm Thị Lan',
    phoneNumber: '0977345679',
    startDate: '2025-11-01',
    userId: '20000000-0000-4000-8000-000000000004',
    linkStatus: 'Confirmed',
  }),
  occupancy({
    id: '80000000-0000-4000-8000-000000000006',
    roomId: HOANG_DIEU_P201,
    fullName: 'Phạm Minh Khôi',
    phoneNumber: '0965223344',
    startDate: '2026-02-20',
  }),

  // P201 — người ở cũ đã chuyển đi, giữ lại làm lịch sử
  occupancy({
    id: '80000000-0000-4000-8000-000000000007',
    roomId: HOANG_DIEU_P201,
    fullName: 'Bùi Thanh Tùng',
    phoneNumber: '0903889977',
    startDate: '2025-03-01',
    endDate: '2025-10-25',
    note: 'Chuyển công tác',
  }),

  // P301
  occupancy({
    id: '80000000-0000-4000-8000-000000000008',
    roomId: HOANG_DIEU_P301,
    fullName: 'Nguyễn Thu Hà',
    phoneNumber: '0913222888',
    startDate: '2026-04-05',
    userId: '20000000-0000-4000-8000-000000000005',
    linkStatus: 'Confirmed',
    isContractRepresentative: true,
  }),
  occupancy({
    id: '80000000-0000-4000-8000-000000000009',
    roomId: HOANG_DIEU_P301,
    fullName: 'Đỗ Bảo Anh',
    phoneNumber: '0934112233',
    startDate: '2026-04-05',
    userId: '20000000-0000-4000-8000-000000000006',
    linkStatus: 'Confirmed',
  }),

  // Bình Lợi A1
  occupancy({
    id: '80000000-0000-4000-8000-000000000010',
    roomId: BINH_LOI_A1,
    fullName: 'Võ Minh Tuấn',
    phoneNumber: '0966123123',
    startDate: '2026-05-12',
    userId: '20000000-0000-4000-8000-000000000007',
    linkStatus: 'Confirmed',
    isContractRepresentative: true,
  }),

  // Bình Lợi B1 — một người từ chối liên kết, minh họa nhánh Rejected của BR-029
  occupancy({
    id: '80000000-0000-4000-8000-000000000011',
    roomId: BINH_LOI_B1,
    fullName: 'Đặng Kim Ngân',
    phoneNumber: '0902888444',
    startDate: '2026-07-01',
    occupantCount: 2,
    userId: '20000000-0000-4000-8000-000000000008',
    linkStatus: 'Rejected',
  }),
  occupancy({
    id: '80000000-0000-4000-8000-000000000012',
    roomId: BINH_LOI_B1,
    fullName: 'Hoàng Gia Bảo',
    phoneNumber: '0947556677',
    startDate: '2026-07-01',
  }),
];

/**
 * Tài khoản Renter mẫu để tra theo SĐT khi thêm người ở.
 *
 * SĐT là định danh duy nhất toàn hệ thống (BR-016), nên đây là khóa tra — **không phải email**
 * như bản prototype.
 */
export const MOCK_RENTER_ACCOUNTS: ReadonlyArray<{
  userId: string;
  phoneNumber: string;
  fullName: string;
}> = [
  {
    userId: '20000000-0000-4000-8000-000000000001',
    phoneNumber: '0905123456',
    fullName: 'Trần Thị Mai',
  },
  {
    userId: '20000000-0000-4000-8000-000000000002',
    phoneNumber: '0918445566',
    fullName: 'Nguyễn Hoàng Nam',
  },
  {
    userId: '20000000-0000-4000-8000-000000000003',
    phoneNumber: '0977345678',
    fullName: 'Phạm Văn Đức',
  },
  {
    userId: '20000000-0000-4000-8000-000000000004',
    phoneNumber: '0977345679',
    fullName: 'Phạm Thị Lan',
  },
  {
    userId: '20000000-0000-4000-8000-000000000005',
    phoneNumber: '0913222888',
    fullName: 'Nguyễn Thu Hà',
  },
  {
    userId: '20000000-0000-4000-8000-000000000006',
    phoneNumber: '0934112233',
    fullName: 'Đỗ Bảo Anh',
  },
  {
    userId: '20000000-0000-4000-8000-000000000007',
    phoneNumber: '0966123123',
    fullName: 'Võ Minh Tuấn',
  },
  {
    userId: '20000000-0000-4000-8000-000000000008',
    phoneNumber: '0902888444',
    fullName: 'Đặng Kim Ngân',
  },
  {
    userId: '20000000-0000-4000-8000-000000000020',
    phoneNumber: '0912000111',
    fullName: 'Lý Gia Hân',
  },
  {
    userId: '20000000-0000-4000-8000-000000000021',
    phoneNumber: '0912000222',
    fullName: 'Trịnh Quốc Bảo',
  },
];
