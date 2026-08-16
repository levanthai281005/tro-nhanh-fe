import type {
  ListingRecord,
  MarketplaceEntityFields,
} from '@/features/marketplace/types/listings';
import type {
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
  amenityIcons: readonly string[];
  status?: RentalListingStatus;
  expireAt?: string;
  boostExpireAt?: string | null;
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
    amenityIcons: ['wifi', 'ac', 'furniture'],
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
  },
];

export const MOCK_LISTING_RECORDS: readonly ListingRecord[] = LISTING_SEEDS.map((seed, index) => {
  const fields = entityFields(seed.id, index + 2);
  const listing: RentalListing = {
    ...fields,
    sellerId: seed.sellerId,
    roomId: null,
    propertyId: null,
    title: seed.title,
    propertyType: seed.propertyType,
    address: seed.address,
    district: seed.district,
    area: seed.area,
    price: seed.price,
    description: 'Không gian sạch sẽ, thuận tiện đi lại và sẵn sàng vào ở.',
    electricityPrice: 3_500,
    waterPrice: 100_000,
    servicePrice: 150_000,
    deposit: seed.price,
    accessPolicy: 'Free',
    accessOpenTime: null,
    accessCloseTime: null,
    contactPhone: '0901234567',
    status: seed.status ?? 'Active',
    rejectReason: null,
    approvedAt: BASE_DATE,
    expireAt: seed.expireAt ?? ACTIVE_EXPIRY,
    boostExpireAt: seed.boostExpireAt ?? null,
  };

  return {
    listing,
    amenities: MOCK_AMENITIES.filter((amenity) => seed.amenityIcons.includes(amenity.icon)),
    media: [
      {
        ...entityFields(`52000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`, 2),
        ownerType: 'RentalListing',
        ownerId: seed.id,
        url: seed.imageUrl,
        mimeType: 'image/jpeg',
        sizeBytes: 240_000,
        isPrivate: false,
      },
    ],
  };
});
