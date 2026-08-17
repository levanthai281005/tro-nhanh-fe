import { ROOM_STATUS_SORT_ORDER } from '@/features/workspace/constants/roomStatus';
import type { RoomFilter, RoomListItem, RoomSort } from '@/features/workspace/types/room';

/** Hàm thuần, không giữ trạng thái — tách khỏi component để test được và đọc được. */
export function filterAndSortRooms(
  rooms: readonly RoomListItem[],
  { keyword, filter, sort }: { keyword: string; filter: RoomFilter; sort: RoomSort },
): readonly RoomListItem[] {
  const normalizedKeyword = keyword.trim().toLowerCase();

  const filtered = rooms.filter((room) => {
    const matchesKeyword =
      !normalizedKeyword ||
      room.roomCode.toLowerCase().includes(normalizedKeyword) ||
      (room.note?.toLowerCase().includes(normalizedKeyword) ?? false) ||
      // Tìm theo **mọi** người ở, không chỉ người đại diện: chủ trọ hay nhớ tên bạn cùng
      // phòng chứ không nhớ ai là người đứng tên hợp đồng.
      room.occupants.some(
        (occupant) =>
          occupant.fullName.toLowerCase().includes(normalizedKeyword) ||
          occupant.phoneNumber.includes(normalizedKeyword),
      );

    return matchesKeyword && (filter === 'all' || room.status === filter);
  });

  return [...filtered].sort((left, right) => {
    switch (sort) {
      case 'code':
        // `numeric` để P2 đứng trước P10 — so sánh chuỗi thuần cho thứ tự P1, P10, P2.
        return left.roomCode.localeCompare(right.roomCode, 'vi-VN', { numeric: true });
      case 'price-desc':
        return right.price - left.price;
      case 'status':
        return ROOM_STATUS_SORT_ORDER[left.status] - ROOM_STATUS_SORT_ORDER[right.status];
      case 'recent':
        return right.updatedAt.localeCompare(left.updatedAt);
    }
  });
}
