import { MOCK_LISTING_RECORDS } from '@/features/marketplace/constants/mockListings';
import type {
  EntityFields,
  HomeDemandPostRecord,
  Profile,
  RoommateWantedPost,
  RoomWantedPost,
} from '@/features/marketplace/types/home';

const ACTIVE_EXPIRY = '2099-12-31T23:59:59.000Z';

function entityFields(id: string, day: number): EntityFields {
  const timestamp = `2026-08-${String(day).padStart(2, '0')}T08:00:00.000Z`;
  return { id, createdAt: timestamp, updatedAt: timestamp, deletedAt: null };
}

export const MOCK_FEATURED_LISTING_RECORDS = MOCK_LISTING_RECORDS;

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
