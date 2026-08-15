import type {
  Amenity,
  EntityFields,
  FeaturedListingRecord,
  HomeDemandPostRecord,
  Profile,
  RoommateWantedPost,
  RoomWantedPost,
} from '@/features/marketplace/types/home';
import type {
  RentalListing,
  RentalListingStatus,
  RentalPropertyType,
} from '@/features/marketplace/types/savedListings';

const BASE_DATE = '2026-08-10T08:00:00.000Z';
const ACTIVE_EXPIRY = '2099-12-31T23:59:59.000Z';

function entityFields(id: string, day: number): EntityFields {
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
] as const;

const MOCK_AMENITIES: readonly Amenity[] = AMENITY_SEEDS.map(([icon, name], index) => ({
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
    id: '10000000-0000-4000-8000-000000000005',
    sellerId: '40000000-0000-4000-8000-000000000005',
    title: 'Căn hộ 2PN đầy đủ tiện nghi, khu dân cư an ninh',
    propertyType: 'Apartment',
    address: '120 Nguyễn Hữu Thọ, Phường Tân Hưng',
    district: 'Quận 7',
    area: 58,
    price: 9_200_000,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    amenityIcons: ['parking', 'ac', 'furniture'],
  },
  {
    id: '10000000-0000-4000-8000-000000000006',
    sellerId: '40000000-0000-4000-8000-000000000006',
    title: 'Phòng trọ mới xây, có gác, gần khu công nghệ cao',
    propertyType: 'BoardingRoom',
    address: '36 Lê Văn Việt, Phường Hiệp Phú',
    district: 'Thủ Đức',
    area: 24,
    price: 3_000_000,
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    amenityIcons: ['wifi', 'loft', 'bath'],
  },
  {
    id: '10000000-0000-4000-8000-000000000007',
    sellerId: '40000000-0000-4000-8000-000000000007',
    title: 'Studio ban công thoáng, giờ giấc tự do, gần trung tâm',
    propertyType: 'ServicedApartment',
    address: '81 Trần Quang Diệu, Phường 13',
    district: 'Quận 3',
    area: 30,
    price: 5_800_000,
    imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
    amenityIcons: ['wifi', 'clock', 'parking'],
  },
  {
    id: '10000000-0000-4000-8000-000000000008',
    sellerId: '40000000-0000-4000-8000-000000000008',
    title: 'Tin đã ẩn không được xuất hiện trên trang chủ',
    propertyType: 'BoardingRoom',
    address: 'TP. Hồ Chí Minh',
    district: 'TP. Hồ Chí Minh',
    area: 20,
    price: 2_000_000,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    amenityIcons: ['wifi'],
    status: 'Hidden',
  },
];

export const MOCK_FEATURED_LISTING_RECORDS: readonly FeaturedListingRecord[] = LISTING_SEEDS.map(
  (seed, index) => {
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
      expireAt: ACTIVE_EXPIRY,
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
  },
);

function profile(userId: string, fullName: string, index: number): Profile {
  return {
    ...entityFields(`53000000-0000-4000-8000-${String(index).padStart(12, '0')}`, index + 2),
    userId,
    fullName,
    avatarUrl: null,
    contactPhone: `09000000${String(index).padStart(2, '0')}`,
    displaySettings: {},
  };
}

const ROOM_WANTED_SEEDS = [
  ['An Nguyễn', ['Quận 7', 'Quận 4'], 2_500_000, 4_000_000, 'Apartment', ['Máy lạnh', 'Wifi']],
  ['Minh Trần', ['Bình Thạnh'], 3_000_000, 5_000_000, 'ServicedApartment', ['Chỗ để xe']],
  ['Hà Phạm', ['Thủ Đức'], 2_000_000, 3_500_000, 'BoardingRoom', ['Gác lửng', 'Wifi']],
  ['Linh Võ', ['Gò Vấp'], null, 3_000_000, 'BoardingRoom', ['WC riêng']],
] as const;

const ROOMMATE_SEEDS = [
  ['Khoa Lê', 'Quận 10', 1_800_000, 1, 'Any', ['Sạch sẽ', 'Không hút thuốc']],
  ['Vy Nguyễn', 'Bình Thạnh', 2_200_000, 1, 'Female', ['Nữ văn phòng']],
  ['Nam Phan', 'Thủ Đức', 1_500_000, 2, 'Male', ['Sinh viên', 'Gọn gàng']],
  ['Trang Đỗ', 'Quận 7', 2_500_000, 1, 'Female', ['Đi làm giờ hành chính']],
] as const;

const roomWantedRecords: HomeDemandPostRecord[] = ROOM_WANTED_SEEDS.map((seed, index) => {
  const [fullName, desiredDistricts, priceMin, priceMax, propertyType, desiredAmenities] = seed;
  const renterId = `54000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;
  const post: RoomWantedPost = {
    ...entityFields(`55000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`, index + 2),
    renterId,
    desiredDistricts,
    priceMin,
    priceMax,
    propertyType,
    minArea: 20,
    desiredAmenities,
    moveInDate: '2026-09-01',
    description: 'Cần tìm phòng sạch sẽ, thuận tiện đi học và đi làm.',
    status: 'Active',
    expireAt: ACTIVE_EXPIRY,
  };
  return { kind: 'RoomWanted', post, poster: profile(renterId, fullName, index + 1) };
});

const roommateRecords: HomeDemandPostRecord[] = ROOMMATE_SEEDS.map((seed, index) => {
  const [fullName, district, sharePrice, neededCount, genderRequirement, requirements] = seed;
  const renterId = `56000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;
  const post: RoommateWantedPost = {
    ...entityFields(`57000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`, index + 6),
    renterId,
    currentAddress: `${district}, TP. Hồ Chí Minh`,
    district,
    sharePrice,
    neededCount,
    genderRequirement,
    requirements,
    status: 'Active',
    expireAt: ACTIVE_EXPIRY,
  };
  return { kind: 'RoommateWanted', post, poster: profile(renterId, fullName, index + 5) };
});

export const MOCK_HOME_DEMAND_POST_RECORDS: readonly HomeDemandPostRecord[] = [
  ...roomWantedRecords,
  ...roommateRecords,
];
