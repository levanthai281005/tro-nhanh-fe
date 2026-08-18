import type {
  Amenity,
  ListingCardView,
  ListingRecord,
  MarketplaceEntityFields,
} from '@/features/marketplace/types/listings';
import type {
  RentalListingStatus,
  RentalPropertyType,
} from '@/features/marketplace/types/savedListings';

export type EntityFields = MarketplaceEntityFields;
export type { Amenity };

export interface Profile extends EntityFields {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  contactPhone: string;
  displaySettings: Readonly<Record<string, unknown>>;
}

export type DemandPostStatus = RentalListingStatus;

export interface RoomWantedPost extends EntityFields {
  renterId: string;
  desiredDistricts: readonly string[];
  priceMin: number | null;
  priceMax: number | null;
  propertyType: RentalPropertyType;
  minArea: number | null;
  desiredAmenities: readonly string[];
  moveInDate: string | null;
  description: string;
  status: DemandPostStatus;
  expireAt: string;
}

export interface RoommateWantedPost extends EntityFields {
  renterId: string;
  currentAddress: string;
  district: string;
  sharePrice: number | null;
  neededCount: number;
  genderRequirement: 'Male' | 'Female' | 'Any';
  requirements: readonly string[];
  status: DemandPostStatus;
  expireAt: string;
}

export type FeaturedListingRecord = ListingRecord;

export type HomeDemandPostRecord =
  | { kind: 'RoomWanted'; post: RoomWantedPost; poster: Profile }
  | { kind: 'RoommateWanted'; post: RoommateWantedPost; poster: Profile };

export type FeaturedListingCardView = ListingCardView;

interface DemandPostCardBase {
  id: string;
  renterId: string;
  name: string;
  initials: string;
  title: string;
  tags: readonly string[];
}

export interface RoomWantedCardView extends DemandPostCardBase {
  kind: 'RoomWanted';
  desiredDistricts: readonly string[];
  priceMin: number | null;
  priceMax: number | null;
  propertyType: RentalPropertyType;
  moveInDate: string | null;
}

export interface RoommateWantedCardView extends DemandPostCardBase {
  kind: 'RoommateWanted';
  district: string;
  sharePrice: number | null;
  neededCount: number;
  genderRequirement: 'Male' | 'Female' | 'Any';
}

export type DemandPostCardView = RoomWantedCardView | RoommateWantedCardView;
