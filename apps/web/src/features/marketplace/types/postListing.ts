import type { ListingNearbyCategoryKey } from '@/features/marketplace/types/listingLocation';
import type { AccessPolicy, RentalPropertyType } from '@/features/marketplace/types/savedListings';

/** Cách tính tiền nước — "100.000đ" không nói lên gì nếu thiếu đơn vị. */
export type WaterPricingUnit = 'PerPerson' | 'PerCubicMeter';

/** Điện/nước: hoặc nêu số tiền cụ thể, hoặc nói rõ tính theo giá chung. */
export type UtilityPricingMode = 'Fixed' | 'Official';

export interface OtherFee {
  id: string;
  name: string;
  amount: number;
}

/** Một địa điểm gần phòng do người đăng tự nhập; nhóm lấy từ taxonomy dùng chung. */
export interface NearbyPlaceEntry {
  id: string;
  category: ListingNearbyCategoryKey;
  name: string;
  distance: string;
}

/**
 * PROPOSAL: ba trường dưới đây chưa có cột trong `RentalListing` (`DATA_ENTITIES.md`) —
 * `maxOccupants`, `waterPricingUnit`, `otherFees`.
 *
 * Prototype giải quyết bằng cách nối JSON vào cuối trường mô tả (`---METADATA---`), khiến mô
 * tả vừa là văn bản cho người đọc vừa là kho dữ liệu — đã bị loại khi port `RoomDetailPage`.
 * Ở đây tách riêng thành phần mở rộng, không trộn vào mô tả, chờ backend bổ sung cột thật.
 */
export interface ListingExtras {
  maxOccupants: number | null;
  waterPricingUnit: WaterPricingUnit | null;
  otherFees: readonly OtherFee[];
}

/** Toàn bộ dữ liệu form đăng tin, gộp cả bốn bước. */
export interface PostListingFormValues {
  // Bước 1 — vị trí
  propertyType: RentalPropertyType;
  provinceCode: string;
  wardCode: string;
  district: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  nearbyPlaces: NearbyPlaceEntry[];

  // Bước 2 — thông tin phòng
  area: string;
  price: string;
  maxOccupants: string;
  accessPolicy: AccessPolicy;
  accessOpenTime: string;
  accessCloseTime: string;
  amenities: string[];

  // Bước 3 — ảnh & mô tả
  title: string;
  photoUrls: string[];
  description: string;

  // Bước 4 — chi phí & liên hệ
  electricityMode: UtilityPricingMode;
  electricityPrice: string;
  waterMode: UtilityPricingMode;
  waterPrice: string;
  waterPricingUnit: WaterPricingUnit;
  deposit: string;
  otherFees: OtherFee[];
  contactPhone: string;

  /**
   * Đăng ký đẩy tin nổi bật ngay lúc đăng.
   *
   * BR-005 chỉ cho boost tin `Active`, mà tin vừa gửi thì đang `PendingApproval` — nên đây là
   * **đăng ký trước**, hệ thống áp dụng sau khi tin được duyệt.
   */
  wantsBoost: boolean;
  boostDays: number;
}

export type PostListingStepId = 'location' | 'room' | 'media' | 'costs';

export interface PostListingStep {
  id: PostListingStepId;
  label: string;
  /** Các trường được kiểm khi bấm "Tiếp tục" ở bước này. */
  fields: readonly (keyof PostListingFormValues)[];
}

/** Bản nháp lưu trên máy để cứu khi mất mạng/sập nguồn giữa chừng. */
export interface ListingDraftSnapshot {
  values: PostListingFormValues;
  step: number;
  savedAt: string;
}
