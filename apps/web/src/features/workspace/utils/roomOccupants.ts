import type { RoomListItem, RoomOccupant } from '@/features/workspace/types/room';

/**
 * Người đứng tên hợp đồng của phòng.
 *
 * Trả `null` khi phòng có người ở nhưng chưa ai được chỉ định đại diện — trạng thái hợp lệ:
 * chủ trọ có thể thêm người ở trước rồi mới lập hợp đồng. Đừng lấy tạm `occupants[0]` thay
 * thế: thứ tự mảng không mang ý nghĩa nghiệp vụ nào.
 */
export function getContractRepresentative(room: RoomListItem): RoomOccupant | null {
  return room.occupants.find((occupant) => occupant.isContractRepresentative) ?? null;
}

/** Người hiển thị đại diện cho phòng trên thẻ: ưu tiên người đứng hợp đồng. */
export function getPrimaryOccupant(room: RoomListItem): RoomOccupant | null {
  return getContractRepresentative(room) ?? room.occupants[0] ?? null;
}
