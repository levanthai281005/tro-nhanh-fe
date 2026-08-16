/** Loại hình cho thuê dùng trong bộ lọc Marketplace. */
export const PROPERTY_TYPES = [
  'Phòng trọ',
  'Căn hộ dịch vụ',
  'Căn hộ',
] as const;

/** Khoảng giá thống nhất cho Home và trang tìm kiếm. */
export const PRICE_RANGES = ['Dưới 2 triệu', '2 – 4 triệu', '4 – 6 triệu', 'Trên 6 triệu'] as const;

export const AMENITIES = [
  'Máy lạnh',
  'Wifi',
  'Gác lửng',
  'Chỗ để xe',
  'WC riêng',
  'Giờ giấc tự do',
  'Cho nuôi thú cưng',
] as const;

export const AREA_RANGES = ['Dưới 20 m²', '20 – 30 m²', '30 – 45 m²', 'Trên 45 m²'] as const;

export const TAGLINE = 'Tìm trọ nhanh — Quản lý gọn';
