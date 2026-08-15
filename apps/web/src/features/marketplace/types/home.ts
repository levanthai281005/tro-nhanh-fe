import type {
  ListingMedia,
  RentalListing,
  RentalListingStatus,
  RentalPropertyType,
} from '@/features/marketplace/types/savedListings';

export interface EntityFields {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Amenity extends EntityFields {
  name: string;
  icon: string;
  type: 'Room' | 'Surrounding';
}

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

export interface FeaturedListingRecord {
  listing: RentalListing;
  media: readonly ListingMedia[];
  amenities: readonly Amenity[];
}

export type HomeDemandPostRecord =
  | { kind: 'RoomWanted'; post: RoomWantedPost; poster: Profile }
  | { kind: 'RoommateWanted'; post: RoommateWantedPost; poster: Profile };

export interface FeaturedListingCardView {
  id: string;
  title: string;
  price: number;
  area: number;
  location: string;
  imageUrl: string;
  amenities: readonly Pick<Amenity, 'icon' | 'name'>[];
  badge: string | null;
}

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
