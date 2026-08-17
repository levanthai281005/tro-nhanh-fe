import type { RoomStatus } from '@tronhanh/schemas';
import type { RoomFilter, RoomSort } from '@/features/workspace/types/room';

/**
 * Nhãn trạng thái phòng dùng cho form và menu đổi trạng thái.
 *
 * **Màu badge không nằm ở đây** — `components/ui/Badge` đã sở hữu nó. Bản prototype có hai
 * chỗ cùng định nghĩa màu trạng thái phòng (`theme.ts` và `statusMaps.ts`) và chúng lệch
 * nhau; không lặp lại lỗi đó.
 */
export const ROOM_STATUS_LABELS: Record<RoomStatus, string> = {
  Available: 'Trống',
  Deposited: 'Đã cọc',
  Rented: 'Đang thuê',
  Hidden: 'Đang ẩn / bảo trì',
};

export const ROOM_FILTER_CHIPS: ReadonlyArray<{ label: string; value: RoomFilter }> = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Trống', value: 'Available' },
  { label: 'Đã cọc', value: 'Deposited' },
  { label: 'Đang thuê', value: 'Rented' },
  { label: 'Đã ẩn', value: 'Hidden' },
];

export const ROOM_SORT_OPTIONS: ReadonlyArray<{ label: string; value: RoomSort }> = [
  { label: 'Mới cập nhật', value: 'recent' },
  { label: 'Mã phòng', value: 'code' },
  { label: 'Giá thuê cao nhất', value: 'price-desc' },
  { label: 'Trạng thái', value: 'status' },
];

/** Thứ tự hiển thị khi sắp xếp theo trạng thái: việc cần làm trước, việc yên ổn sau. */
export const ROOM_STATUS_SORT_ORDER: Record<RoomStatus, number> = {
  Available: 0,
  Deposited: 1,
  Rented: 2,
  Hidden: 3,
};
