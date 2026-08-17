import type {
  PostListingFormValues,
  PostListingStep,
} from '@/features/marketplace/types/postListing';

/**
 * Bốn bước chia theo **công sức bỏ ra**, không theo chủ đề.
 *
 * Prototype dồn 10 trường vào bước 1 rồi để bước 3 chỉ có 1 trường — người dùng đâm vào bức
 * tường ngay màn hình đầu, đúng chỗ dễ bỏ cuộc nhất. Ở đây:
 * việc dễ ở hai đầu, việc nặng (ảnh, mô tả) nằm giữa — lúc đó người dùng đã đầu tư hai bước
 * nên ít bỏ hơn, và bước cuối nhẹ để có cảm giác sắp xong.
 */
export const POST_LISTING_STEPS: readonly PostListingStep[] = [
  {
    id: 'location',
    label: 'Phòng ở đâu',
    fields: ['propertyType', 'provinceCode', 'wardCode', 'district', 'address'],
  },
  {
    id: 'room',
    label: 'Phòng thế nào',
    fields: ['area', 'price', 'maxOccupants', 'accessPolicy', 'accessOpenTime', 'accessCloseTime'],
  },
  {
    id: 'media',
    label: 'Ảnh & mô tả',
    fields: ['title', 'photoUrls', 'description'],
  },
  {
    id: 'costs',
    label: 'Chi phí & liên hệ',
    fields: [
      'electricityMode',
      'electricityPrice',
      'waterMode',
      'waterPrice',
      'waterPricingUnit',
      'deposit',
      'contactPhone',
    ],
  },
];

export const EMPTY_POST_LISTING_VALUES: PostListingFormValues = {
  propertyType: 'BoardingRoom',
  provinceCode: '',
  wardCode: '',
  district: '',
  address: '',
  latitude: null,
  longitude: null,
  nearbyPlaces: [],

  area: '',
  price: '',
  maxOccupants: '',
  accessPolicy: 'Free',
  accessOpenTime: '',
  accessCloseTime: '',
  amenities: [],

  title: '',
  photoUrls: [],
  description: '',

  electricityMode: 'Fixed',
  electricityPrice: '',
  waterMode: 'Fixed',
  waterPrice: '',
  waterPricingUnit: 'PerPerson',
  deposit: '',
  otherFees: [],
  contactPhone: '',
  wantsBoost: false,
  boostDays: 7,
};

/** Gợi ý dàn ý cho ô mô tả — ô trống trơn là thứ khiến người ta chần chừ lâu nhất. */
export const DESCRIPTION_HINTS: readonly string[] = [
  'Nội thất sẵn có trong phòng',
  'An ninh, giờ giấc, chỗ để xe',
  'Gần trường/chợ/bến xe nào',
  'Phù hợp với ai (sinh viên, người đi làm, gia đình)',
];
