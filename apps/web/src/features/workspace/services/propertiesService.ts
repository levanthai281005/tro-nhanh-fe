import type {
  CreatePropertyInput,
  PropertiesResult,
  Property,
  PropertyListItem,
} from '@/features/workspace/types/property';
import {
  createLocalId,
  findProperty,
  listProperties,
  listRooms,
  saveProperty,
  waitForMockRequest,
} from '@/features/workspace/services/workspaceStore';

function toListItem(property: Property): PropertyListItem {
  const rooms = listRooms(property.id);

  return {
    id: property.id,
    name: property.name,
    address: property.address,
    district: property.district,
    roomCount: rooms.length,
    availableCount: rooms.filter((room) => room.status === 'Available').length,
    depositedCount: rooms.filter((room) => room.status === 'Deposited').length,
    rentedCount: rooms.filter((room) => room.status === 'Rented').length,
    hiddenCount: rooms.filter((room) => room.status === 'Hidden').length,
    isPublicProfileEnabled: property.isPublicProfileEnabled,
    hasPayoutInfo: Boolean(property.bankAccountNumber && property.bankAccountName),
  };
}

// TODO: nối API thật khi packages/types sinh xong: GET /management/properties.
// Danh tính seller lấy từ session, không nhận từ client (BR-007).
export async function getProperties(sellerId: string | undefined): Promise<PropertiesResult> {
  await waitForMockRequest();
  if (!sellerId) return { items: [], totalRooms: 0, totalAvailable: 0 };

  const items = listProperties(sellerId).map(toListItem);

  return {
    items,
    totalRooms: items.reduce((sum, item) => sum + item.roomCount, 0),
    totalAvailable: items.reduce((sum, item) => sum + item.availableCount, 0),
  };
}

// TODO: nối API thật khi packages/types sinh xong: GET /management/properties/{id}.
export async function getPropertyById(propertyId: string): Promise<Property | null> {
  await waitForMockRequest();
  return findProperty(propertyId) ?? null;
}

/**
 * Tạo khu trọ.
 *
 * Cố ý chỉ hỏi ba thông tin nhận dạng. Đơn giá điện/nước/dịch vụ và tài khoản ngân hàng nhập ở
 * màn chi tiết khu (B7) — nơi có validate và xem trước mã VietQR. Nhồi hết vào đây thì bước
 * đầu tiên của người dùng mới thành một form dài, và họ sẽ điền số bừa cho xong.
 */
// TODO: nối API thật khi packages/types sinh xong: POST /management/properties.
export async function createProperty(
  sellerId: string,
  input: CreatePropertyInput,
): Promise<Property> {
  await waitForMockRequest();

  const timestamp = new Date().toISOString();
  const property: Property = {
    id: createLocalId(),
    sellerId,
    name: input.name.trim(),
    address: input.address.trim(),
    district: input.district.trim(),
    provinceCode: input.provinceCode,
    wardCode: input.wardCode,
    floorCount: null,
    note: null,
    bankName: null,
    bankAccountNumber: null,
    bankAccountName: null,
    isPublicProfileEnabled: false,
    publicSlug: null,
    // Mức phổ biến ở TP.HCM, chủ trọ sửa lại ở màn chi tiết khu. Để 0 thì hóa đơn đầu tiên ra
    // số sai mà không ai để ý.
    electricityPrice: 3500,
    waterPrice: 15000,
    servicePrice: 100000,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  saveProperty(property);
  return property;
}
