/** Khu trọ — entity `Property`, `DATA_ENTITIES.md`. */
export interface Property {
  id: string;
  sellerId: string;
  name: string;
  address: string;
  district: string;
  provinceCode: number | null;
  wardCode: number | null;
  floorCount: number | null;
  note: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  isPublicProfileEnabled: boolean;
  publicSlug: string | null;
  /** Đơn giá mặc định của khu; phòng để `null` thì thừa hưởng các giá trị này. */
  electricityPrice: number;
  waterPrice: number;
  servicePrice: number;
  createdAt: string;
  updatedAt: string;
}

/** Một dòng trong danh sách B6 — đã gộp sẵn số liệu phòng để không phải đếm ở component. */
export interface PropertyListItem {
  id: string;
  name: string;
  address: string;
  district: string;
  roomCount: number;
  availableCount: number;
  depositedCount: number;
  rentedCount: number;
  hiddenCount: number;
  isPublicProfileEnabled: boolean;
  /** Đã điền đủ thông tin nhận tiền chưa — thiếu thì chưa xuất được hóa đơn kèm VietQR. */
  hasPayoutInfo: boolean;
}

export interface PropertiesResult {
  items: readonly PropertyListItem[];
  totalRooms: number;
  totalAvailable: number;
}

export interface CreatePropertyInput {
  name: string;
  address: string;
  district: string;
  provinceCode: number | null;
  wardCode: number | null;
}
