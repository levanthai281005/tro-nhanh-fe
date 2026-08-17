import type { Property } from '@/features/workspace/types/property';
import type { RoomListItem } from '@/features/workspace/types/room';
import { MOCK_PROPERTIES, MOCK_ROOMS } from '@/features/workspace/constants/mockWorkspaceData';

/**
 * Kho dữ liệu tạm cho phiên demo, để mutation có hiệu lực thật mà không phải sửa file mock.
 *
 * Khi nối API thật thì **bỏ hẳn** file này — service gọi thẳng backend. Đặt riêng thay vì nhét
 * vào từng service vì cả khu trọ lẫn phòng cùng đọc/ghi một trạng thái (thêm phòng phải làm
 * đổi số liệu trên thẻ khu).
 */

const properties = new Map<string, Property>(MOCK_PROPERTIES.map((item) => [item.id, item]));
const rooms = new Map<string, RoomListItem>(MOCK_ROOMS.map((item) => [item.id, item]));

const MOCK_REQUEST_DELAY_MS = 180;

export function waitForMockRequest() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_REQUEST_DELAY_MS);
  });
}

export function listProperties(sellerId: string): Property[] {
  return [...properties.values()]
    .filter((item) => item.sellerId === sellerId)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export function findProperty(propertyId: string): Property | undefined {
  return properties.get(propertyId);
}

export function saveProperty(property: Property): void {
  properties.set(property.id, property);
}

/**
 * Xóa khu khỏi danh sách quản lý.
 *
 * Backend thật là **xóa mềm** (`deletedAt`) — hóa đơn, hợp đồng và đánh giá cũ phải còn
 * nguyên. Ở kho mock chưa có khái niệm cột nên bỏ khỏi Map; phòng thuộc khu cũng được gỡ để
 * số liệu tổng không đếm nhầm.
 */
export function removeProperty(propertyId: string): void {
  properties.delete(propertyId);
  for (const room of listRooms(propertyId)) {
    rooms.delete(room.id);
  }
}

export function listRooms(propertyId: string): RoomListItem[] {
  return [...rooms.values()].filter((item) => item.propertyId === propertyId);
}

export function listRoomsBySeller(sellerId: string): RoomListItem[] {
  const ownedIds = new Set(listProperties(sellerId).map((item) => item.id));
  return [...rooms.values()].filter((item) => ownedIds.has(item.propertyId));
}

export function findRoom(roomId: string): RoomListItem | undefined {
  return rooms.get(roomId);
}

export function saveRoom(room: RoomListItem): void {
  rooms.set(room.id, room);
}

export function removeRoom(roomId: string): void {
  rooms.delete(roomId);
}

/** Id tạm cho bản ghi tạo trong phiên demo. Backend thật sinh uuid của nó. */
export function createLocalId(): string {
  return crypto.randomUUID();
}
