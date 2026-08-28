import type { Invoice, Payment } from '@/features/workspace/types/invoice';

/**
 * Hóa đơn và khoản thu mẫu.
 *
 * Phủ **đủ bốn trạng thái BR-004** bằng dữ liệu thật chứ không gán cứng `status` — trạng thái
 * do service suy ra từ ΣPayment và `dueDate`, đúng như backend sẽ làm. Muốn có `PartiallyPaid`
 * thì phải là hóa đơn thu một phần **còn hạn**; thu một phần mà **quá hạn** vẫn là `Overdue`,
 * và đó chính là nhánh dễ làm sai nhất của BR-004 nên có hẳn một hóa đơn cho nó.
 *
 * Hóa đơn A1 thuộc khu Bình Lợi — khu **chưa khai báo tài khoản nhận tiền**, để màn chi tiết
 * có ca "chưa dựng được VietQR" thật mà kiểm.
 */

const P101 = '70000000-0000-4000-8000-000000000001';
const P201 = '70000000-0000-4000-8000-000000000004';
const P301 = '70000000-0000-4000-8000-000000000007';
const BINH_LOI_A1 = '70000000-0000-4000-8000-000000000009';

const CONTRACT_P101 = '90000000-0000-4000-8000-000000000001';
const CONTRACT_P201 = '90000000-0000-4000-8000-000000000002';
const CONTRACT_P301 = '90000000-0000-4000-8000-000000000003';
const CONTRACT_A1 = '90000000-0000-4000-8000-000000000004';

export const MOCK_INVOICES: readonly Invoice[] = [
  // Đã thu đủ → `Paid`
  {
    id: 'b0000000-0000-4000-8000-000000000001',
    roomId: P101,
    contractId: CONTRACT_P101,
    period: '2026-07',
    dueDate: '2026-08-05',
    totalAmount: 3_664_500,
    sentAt: '2026-07-29T02:00:00.000Z',
    createdAt: '2026-07-29T01:00:00.000Z',
    items: [
      {
        id: 'c0000000-0000-4000-8000-000000000001',
        type: 'Rent',
        description: 'Tiền phòng kỳ 2026-07',
        quantity: 1,
        unitPrice: 3_200_000,
        amount: 3_200_000,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000002',
        type: 'Electricity',
        description: 'Điện 1265 → 1352',
        quantity: 87,
        unitPrice: 3_500,
        amount: 304_500,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000003',
        type: 'Water',
        description: 'Nước 42 → 46',
        quantity: 4,
        unitPrice: 15_000,
        amount: 60_000,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000004',
        type: 'Service',
        description: 'Phí dịch vụ kỳ 2026-07',
        quantity: 1,
        unitPrice: 100_000,
        amount: 100_000,
      },
    ],
  },

  // Thu một phần **và đã quá hạn** → `Overdue`, không phải `PartiallyPaid` (BR-004)
  {
    id: 'b0000000-0000-4000-8000-000000000002',
    roomId: P201,
    contractId: CONTRACT_P201,
    period: '2026-07',
    dueDate: '2026-08-05',
    totalAmount: 4_067_100,
    sentAt: '2026-07-29T02:00:00.000Z',
    createdAt: '2026-07-29T01:00:00.000Z',
    items: [
      {
        id: 'c0000000-0000-4000-8000-000000000005',
        type: 'Rent',
        description: 'Tiền phòng kỳ 2026-07',
        quantity: 1,
        unitPrice: 3_600_000,
        amount: 3_600_000,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000006',
        type: 'Electricity',
        description: 'Điện 2118 → 2201',
        quantity: 83,
        unitPrice: 3_700,
        amount: 307_100,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000007',
        type: 'Water',
        description: 'Nước 58 → 62',
        quantity: 4,
        unitPrice: 15_000,
        amount: 60_000,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000008',
        type: 'Service',
        description: 'Phí dịch vụ kỳ 2026-07',
        quantity: 1,
        unitPrice: 100_000,
        amount: 100_000,
      },
    ],
  },

  // Chưa thu đồng nào, còn hạn → `Unpaid`
  {
    id: 'b0000000-0000-4000-8000-000000000003',
    roomId: P301,
    contractId: CONTRACT_P301,
    period: '2026-08',
    dueDate: '2026-09-05',
    totalAmount: 4_803_000,
    sentAt: null,
    createdAt: '2026-08-29T01:00:00.000Z',
    items: [
      {
        id: 'c0000000-0000-4000-8000-000000000009',
        type: 'Rent',
        description: 'Tiền phòng kỳ 2026-08',
        quantity: 1,
        unitPrice: 4_200_000,
        amount: 4_200_000,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000010',
        type: 'Electricity',
        description: 'Điện 1122 → 1240',
        quantity: 118,
        unitPrice: 3_500,
        amount: 413_000,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000011',
        type: 'Water',
        description: 'Nước 41 → 47',
        quantity: 6,
        unitPrice: 15_000,
        amount: 90_000,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000012',
        type: 'Service',
        description: 'Phí dịch vụ kỳ 2026-08',
        quantity: 1,
        unitPrice: 100_000,
        amount: 100_000,
      },
    ],
  },

  // Thu một phần, **còn hạn** → `PartiallyPaid`
  {
    id: 'b0000000-0000-4000-8000-000000000004',
    roomId: BINH_LOI_A1,
    contractId: CONTRACT_A1,
    period: '2026-08',
    dueDate: '2026-09-05',
    totalAmount: 2_712_600,
    sentAt: '2026-08-19T02:00:00.000Z',
    createdAt: '2026-08-19T01:00:00.000Z',
    items: [
      {
        id: 'c0000000-0000-4000-8000-000000000013',
        type: 'Rent',
        description: 'Tiền phòng kỳ 2026-08',
        quantity: 1,
        unitPrice: 2_400_000,
        amount: 2_400_000,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000014',
        type: 'Electricity',
        description: 'Điện 519 → 566',
        quantity: 47,
        unitPrice: 3_800,
        amount: 178_600,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000015',
        type: 'Water',
        description: 'Nước 18 → 21',
        quantity: 3,
        unitPrice: 18_000,
        amount: 54_000,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000016',
        type: 'Service',
        description: 'Phí dịch vụ kỳ 2026-08',
        quantity: 1,
        unitPrice: 80_000,
        amount: 80_000,
      },
    ],
  },
];

export const MOCK_PAYMENTS: readonly Payment[] = [
  {
    id: 'd0000000-0000-4000-8000-000000000001',
    invoiceId: 'b0000000-0000-4000-8000-000000000001',
    amount: 3_664_500,
    method: 'BankTransfer',
    paidAt: '2026-08-03',
    note: null,
    createdAt: '2026-08-03T02:00:00.000Z',
  },
  {
    id: 'd0000000-0000-4000-8000-000000000002',
    invoiceId: 'b0000000-0000-4000-8000-000000000002',
    amount: 2_000_000,
    method: 'BankTransfer',
    paidAt: '2026-08-04',
    note: 'Người ở xin trả nốt vào cuối tháng',
    createdAt: '2026-08-04T02:00:00.000Z',
  },
  {
    id: 'd0000000-0000-4000-8000-000000000003',
    invoiceId: 'b0000000-0000-4000-8000-000000000004',
    amount: 1_000_000,
    method: 'Cash',
    paidAt: '2026-08-20',
    note: 'Trả trước tiền phòng',
    createdAt: '2026-08-20T02:00:00.000Z',
  },
];
