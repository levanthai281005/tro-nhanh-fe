import type { ListingRecord, MarketplaceEntityFields } from '@/features/marketplace/types/listings';
import type { ListingDetailLocation } from '@/features/marketplace/types/listingLocation';
import type {
  AccessPolicy,
  RentalListing,
  RentalListingStatus,
  RentalPropertyType,
} from '@/features/marketplace/types/savedListings';

const BASE_DATE = '2026-08-10T08:00:00.000Z';
const ACTIVE_EXPIRY = '2099-12-31T23:59:59.000Z';

function entityFields(id: string, day: number): MarketplaceEntityFields {
  const timestamp = `2026-08-${String(day).padStart(2, '0')}T08:00:00.000Z`;
  return { id, createdAt: timestamp, updatedAt: timestamp, deletedAt: null };
}

const AMENITY_SEEDS = [
  ['wifi', 'Wifi'],
  ['ac', 'Máy lạnh'],
  ['parking', 'Chỗ để xe'],
  ['bath', 'WC riêng'],
  ['clock', 'Giờ giấc tự do'],
  ['loft', 'Gác lửng'],
  ['furniture', 'Nội thất'],
  ['pets', 'Cho nuôi thú cưng'],
] as const;

const MOCK_AMENITIES: ListingRecord['amenities'] = AMENITY_SEEDS.map(([icon, name], index) => ({
  ...entityFields(`51000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`, 1),
  icon,
  name,
  type: 'Room',
}));

interface ListingSeed {
  id: string;
  sellerId: string;
  title: string;
  propertyType: RentalPropertyType;
  address: string;
  district: string;
  area: number;
  price: number;
  imageUrl: string;
  imageUrls?: readonly string[];
  amenityIcons: readonly string[];
  propertyId?: string | null;
  description?: string;
  electricityPrice?: number;
  waterPrice?: number;
  servicePrice?: number;
  deposit?: number;
  accessPolicy?: AccessPolicy;
  accessOpenTime?: string | null;
  accessCloseTime?: string | null;
  contactPhone?: string;
  status?: RentalListingStatus;
  expireAt?: string;
  boostExpireAt?: string | null;
  location: ListingDetailLocation;
}

const LISTING_SEEDS: readonly ListingSeed[] = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    sellerId: '40000000-0000-4000-8000-000000000001',
    title: 'Phòng trọ cao cấp, full nội thất, gần ĐH Bách Khoa',
    propertyType: 'BoardingRoom',
    address: '268 Lý Thường Kiệt, Phường 14',
    district: 'Quận 10',
    area: 25,
    price: 3_200_000,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    amenityIcons: ['wifi', 'ac', 'furniture'],
    boostExpireAt: ACTIVE_EXPIRY,
    location: {
      latitude: 10.773691,
      longitude: 106.657368,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Vạn Hạnh Mall', distance: '950 m' }] },
        { key: 'edu', places: [{ name: 'Đại học Bách khoa TP.HCM', distance: '550 m' }] },
        { key: 'health', places: [{ name: 'Bệnh viện Trưng Vương', distance: '1,1 km' }] },
        { key: 'food', places: [{ name: 'Chợ Hòa Hưng', distance: '650 m' }] },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    sellerId: '40000000-0000-4000-8000-000000000002',
    title: 'Căn hộ 2 phòng ngủ đầy đủ tiện nghi, khu dân cư an ninh',
    propertyType: 'Apartment',
    address: '120 Nguyễn Hữu Thọ, Phường Tân Hưng',
    district: 'Quận 7',
    area: 58,
    price: 9_200_000,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    amenityIcons: ['parking', 'ac', 'furniture'],
    location: {
      latitude: 10.733157,
      longitude: 106.707115,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Lotte Mart Quận 7', distance: '1,4 km' }] },
        { key: 'edu', places: [{ name: 'RMIT University Vietnam', distance: '1,7 km' }] },
        { key: 'health', places: [{ name: 'Bệnh viện FV', distance: '2,1 km' }] },
        { key: 'food', places: [{ name: 'Chợ Tân Mỹ', distance: '850 m' }] },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    sellerId: '40000000-0000-4000-8000-000000000003',
    title: 'Phòng trọ mới xây có gác, gần khu công nghệ cao',
    propertyType: 'BoardingRoom',
    address: '36 Lê Văn Việt, Phường Hiệp Phú',
    district: 'Thủ Đức',
    area: 24,
    price: 3_000_000,
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    amenityIcons: ['wifi', 'loft', 'bath'],
    location: {
      latitude: 10.8475,
      longitude: 106.7859,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Vincom Plaza Lê Văn Việt', distance: '450 m' }] },
        { key: 'edu', places: [{ name: 'Đại học Giao thông Vận tải CS2', distance: '1,3 km' }] },
        { key: 'health', places: [{ name: 'Bệnh viện Lê Văn Việt', distance: '1,1 km' }] },
        { key: 'food', places: [{ name: 'Chợ Hiệp Phú', distance: '500 m' }] },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    sellerId: '40000000-0000-4000-8000-000000000004',
    title: 'Căn hộ dịch vụ ban công thoáng, gần trung tâm',
    propertyType: 'ServicedApartment',
    address: '81 Trần Quang Diệu, Phường 13',
    district: 'Quận 3',
    area: 30,
    price: 5_800_000,
    imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
    amenityIcons: ['wifi', 'clock', 'parking'],
    location: {
      latitude: 10.7865,
      longitude: 106.6824,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Chợ Nguyễn Văn Trỗi', distance: '700 m' }] },
        { key: 'edu', places: [{ name: 'Trường THPT Lê Quý Đôn', distance: '1,5 km' }] },
        { key: 'health', places: [{ name: 'Bệnh viện An Sinh', distance: '1,0 km' }] },
        { key: 'food', places: [{ name: 'Chợ Bàn Cờ', distance: '1,2 km' }] },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000005',
    sellerId: '40000000-0000-4000-8000-000000000005',
    title: 'Phòng trọ giá tốt, gần chợ và trường học',
    propertyType: 'BoardingRoom',
    address: '14 Nguyễn Văn Quá, Phường Đông Hưng Thuận',
    district: 'Quận 12',
    area: 18,
    price: 1_800_000,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    amenityIcons: ['wifi', 'parking'],
    location: {
      latitude: 10.8554,
      longitude: 106.6273,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Co.opmart Nguyễn Ảnh Thủ', distance: '1,3 km' }] },
        { key: 'edu', places: [{ name: 'Cao đẳng Điện lực TP.HCM', distance: '1,1 km' }] },
        { key: 'health', places: [{ name: 'Bệnh viện Quận 12', distance: '2,4 km' }] },
        { key: 'food', places: [{ name: 'Chợ Cầu', distance: '900 m' }] },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000006',
    sellerId: '40000000-0000-4000-8000-000000000006',
    title: 'Căn hộ dịch vụ mới, có thang máy và bảo vệ',
    propertyType: 'ServicedApartment',
    address: '22 Nguyễn Gia Trí, Phường 25',
    district: 'Bình Thạnh',
    area: 35,
    price: 6_500_000,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    amenityIcons: ['wifi', 'ac', 'parking'],
    boostExpireAt: ACTIVE_EXPIRY,
    location: {
      latitude: 10.8044,
      longitude: 106.7142,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Pearl Plaza', distance: '1,2 km' }] },
        { key: 'edu', places: [{ name: 'Đại học HUTECH', distance: '550 m' }] },
        { key: 'health', places: [{ name: 'Bệnh viện Bình Thạnh', distance: '1,8 km' }] },
        { key: 'food', places: [{ name: 'Chợ Văn Thánh', distance: '800 m' }] },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000007',
    sellerId: '40000000-0000-4000-8000-000000000007',
    title: 'Căn hộ yên tĩnh gần công viên, vào ở ngay',
    propertyType: 'Apartment',
    address: '43 Hoàng Văn Thụ, Phường 8',
    district: 'Tân Bình',
    area: 46,
    price: 7_800_000,
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    amenityIcons: ['ac', 'bath', 'pets'],
    location: {
      latitude: 10.7961,
      longitude: 106.6648,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Pico Plaza Cộng Hòa', distance: '1,7 km' }] },
        { key: 'edu', places: [{ name: 'Đại học Tài chính - Marketing', distance: '1,6 km' }] },
        { key: 'health', places: [{ name: 'Bệnh viện Thống Nhất', distance: '2,1 km' }] },
        { key: 'food', places: [{ name: 'Chợ Phạm Văn Hai', distance: '1,2 km' }] },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000008',
    sellerId: '40000000-0000-4000-8000-000000000008',
    title: 'Phòng trọ sạch sẽ, giờ giấc tự do',
    propertyType: 'BoardingRoom',
    address: '109 Lê Đức Thọ, Phường 6',
    district: 'Gò Vấp',
    area: 21,
    price: 2_400_000,
    imageUrl: 'https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=800&q=80',
    amenityIcons: ['wifi', 'clock', 'bath'],
    location: {
      latitude: 10.8364,
      longitude: 106.6674,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Emart Gò Vấp', distance: '1,1 km' }] },
        { key: 'edu', places: [{ name: 'Đại học Công nghiệp TP.HCM', distance: '1,4 km' }] },
        { key: 'health', places: [{ name: 'Bệnh viện Quân y 175', distance: '1,9 km' }] },
        { key: 'food', places: [{ name: 'Chợ Hạnh Thông Tây', distance: '650 m' }] },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000009',
    sellerId: '40000000-0000-4000-8000-000000000009',
    title: 'Căn hộ dịch vụ gần sân bay, nội thất đầy đủ',
    propertyType: 'ServicedApartment',
    address: '45 Bạch Đằng, Phường 2',
    district: 'Tân Bình',
    area: 40,
    price: 8_100_000,
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=85',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1600&q=85',
    ],
    amenityIcons: ['wifi', 'ac', 'furniture'],
    propertyId: '60000000-0000-4000-8000-000000000009',
    description:
      'Căn hộ dịch vụ yên tĩnh, đầy đủ nội thất và chỉ cách sân bay vài phút di chuyển. Phòng có cửa sổ lớn, bếp riêng, máy lạnh, máy nước nóng và khu vực để xe trong nhà. Phù hợp người đi làm hoặc sinh viên muốn ở lâu dài.',
    electricityPrice: 3_800,
    waterPrice: 120_000,
    servicePrice: 200_000,
    deposit: 8_100_000,
    accessPolicy: 'Restricted',
    accessOpenTime: '06:00',
    accessCloseTime: '23:00',
    contactPhone: '0938456789',
    location: {
      latitude: 10.8125,
      longitude: 106.6653,
      nearbyPlaces: [
        {
          key: 'shopping',
          places: [
            { name: 'Menas Mall', distance: '850 m' },
            { name: 'Vincom Plaza Cộng Hòa', distance: '1,5 km' },
          ],
        },
        {
          key: 'edu',
          places: [
            { name: 'Học viện Hàng không Việt Nam', distance: '1,1 km' },
            { name: 'Trường THPT Nguyễn Chí Thanh', distance: '700 m' },
          ],
        },
        {
          key: 'health',
          places: [
            { name: 'Bệnh viện Tân Bình', distance: '1,8 km' },
            { name: 'Bệnh viện Hoàn Mỹ Sài Gòn', distance: '2,2 km' },
          ],
        },
        {
          key: 'food',
          places: [
            { name: 'Chợ Tân Sơn Nhất', distance: '900 m' },
            { name: 'Chợ Phạm Văn Hai', distance: '2,3 km' },
          ],
        },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000010',
    sellerId: '40000000-0000-4000-8000-000000000010',
    title: 'Phòng trọ có gác, khu dân cư an ninh',
    propertyType: 'BoardingRoom',
    address: '8 Nguyễn Xí, Phường 26',
    district: 'Bình Thạnh',
    area: 28,
    price: 3_900_000,
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    amenityIcons: ['loft', 'parking', 'bath'],
    location: {
      latitude: 10.8151,
      longitude: 106.709,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Landmark 81', distance: '2,3 km' }] },
        { key: 'edu', places: [{ name: 'Đại học Hồng Bàng CS Nguyễn Xí', distance: '700 m' }] },
        { key: 'health', places: [{ name: 'Bệnh viện Ung bướu TP.HCM cơ sở 2', distance: '2,2 km' }] },
        { key: 'food', places: [{ name: 'Chợ Cây Quéo', distance: '1,4 km' }] },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000011',
    sellerId: '40000000-0000-4000-8000-000000000011',
    title: 'Căn hộ một phòng ngủ gần đại học',
    propertyType: 'Apartment',
    address: '92 Võ Văn Ngân, Phường Linh Chiểu',
    district: 'Thủ Đức',
    area: 42,
    price: 6_000_000,
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    amenityIcons: ['wifi', 'ac', 'parking'],
    location: {
      latitude: 10.8493,
      longitude: 106.7704,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Vincom Plaza Thủ Đức', distance: '700 m' }] },
        { key: 'edu', places: [{ name: 'Đại học Sư phạm Kỹ thuật TP.HCM', distance: '1,2 km' }] },
        { key: 'health', places: [{ name: 'Bệnh viện thành phố Thủ Đức', distance: '1,4 km' }] },
        { key: 'food', places: [{ name: 'Chợ Thủ Đức', distance: '1,0 km' }] },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000012',
    sellerId: '40000000-0000-4000-8000-000000000012',
    title: 'Tin đã ẩn không xuất hiện trong kết quả công khai',
    propertyType: 'BoardingRoom',
    address: 'TP. Hồ Chí Minh',
    district: 'TP. Hồ Chí Minh',
    area: 20,
    price: 2_000_000,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    amenityIcons: ['wifi'],
    status: 'Hidden',
    location: {
      latitude: 10.7742,
      longitude: 106.698,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Takashimaya Saigon Centre', distance: '1,1 km' }] },
        { key: 'edu', places: [{ name: 'Đại học Khoa học Xã hội và Nhân văn', distance: '1,4 km' }] },
        { key: 'health', places: [{ name: 'Bệnh viện Nhi Đồng 2', distance: '1,9 km' }] },
        { key: 'food', places: [{ name: 'Chợ Bến Thành', distance: '1,2 km' }] },
      ],
    },
  },
  {
    id: '10000000-0000-4000-8000-000000000013',
    sellerId: '40000000-0000-4000-8000-000000000013',
    title: 'Tin đã hết hạn không xuất hiện trong kết quả công khai',
    propertyType: 'BoardingRoom',
    address: 'Khu vực trung tâm',
    district: 'Quận 1',
    area: 22,
    price: 4_100_000,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    amenityIcons: ['wifi', 'ac'],
    expireAt: '2026-08-01T00:00:00.000Z',
    location: {
      latitude: 10.7752,
      longitude: 106.7001,
      nearbyPlaces: [
        { key: 'shopping', places: [{ name: 'Saigon Centre', distance: '750 m' }] },
        { key: 'edu', places: [{ name: 'Đại học Hoa Sen cơ sở Quang Trung', distance: '900 m' }] },
        { key: 'health', places: [{ name: 'Bệnh viện Răng Hàm Mặt TP.HCM', distance: '1,5 km' }] },
        { key: 'food', places: [{ name: 'Phố ẩm thực Bùi Viện', distance: '1,1 km' }] },
      ],
    },
  },
];

export const MOCK_LISTING_LOCATIONS: Readonly<Record<string, ListingDetailLocation>> =
  Object.fromEntries(LISTING_SEEDS.map((seed) => [seed.id, seed.location] as const));

export const MOCK_LISTING_RECORDS: readonly ListingRecord[] = LISTING_SEEDS.map((seed, index) => {
  const fields = entityFields(seed.id, index + 2);
  const listing: RentalListing = {
    ...fields,
    sellerId: seed.sellerId,
    roomId: null,
    propertyId: seed.propertyId ?? null,
    title: seed.title,
    propertyType: seed.propertyType,
    address: seed.address,
    district: seed.district,
    area: seed.area,
    price: seed.price,
    description: seed.description ?? 'Không gian sạch sẽ, thuận tiện đi lại và sẵn sàng vào ở.',
    electricityPrice: seed.electricityPrice ?? 3_500,
    waterPrice: seed.waterPrice ?? 100_000,
    servicePrice: seed.servicePrice ?? 150_000,
    deposit: seed.deposit ?? seed.price,
    accessPolicy: seed.accessPolicy ?? 'Free',
    accessOpenTime: seed.accessOpenTime ?? null,
    accessCloseTime: seed.accessCloseTime ?? null,
    contactPhone: seed.contactPhone ?? '0901234567',
    status: seed.status ?? 'Active',
    rejectReason: null,
    approvedAt: BASE_DATE,
    expireAt: seed.expireAt ?? ACTIVE_EXPIRY,
    boostExpireAt: seed.boostExpireAt ?? null,
  };

  return {
    listing,
    amenities: MOCK_AMENITIES.filter((amenity) => seed.amenityIcons.includes(amenity.icon)),
    media: (seed.imageUrls ?? [seed.imageUrl]).map((url, mediaIndex) => ({
      ...entityFields(
        `52000000-0000-4000-8000-${String(index * 10 + mediaIndex + 1).padStart(12, '0')}`,
        2,
      ),
      ownerType: 'RentalListing',
      ownerId: seed.id,
      url,
      mimeType: 'image/jpeg',
      sizeBytes: 240_000,
      isPrivate: false,
    })),
  };
});
