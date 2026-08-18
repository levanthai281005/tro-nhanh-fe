export type RentalListingStatus =
  'Draft' | 'PendingApproval' | 'Active' | 'Rejected' | 'Expired' | 'Rented' | 'Hidden';

export type RentalPropertyType = 'BoardingRoom' | 'ServicedApartment' | 'Apartment';
export type AccessPolicy = 'Free' | 'Restricted';

interface EntityFields {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Favorite extends EntityFields {
  renterId: string;
  listingId: string;
}

export interface RentalListing extends EntityFields {
  sellerId: string;
  roomId: string | null;
  propertyId: string | null;
  title: string;
  propertyType: RentalPropertyType;
  address: string;
  district: string;
  area: number;
  price: number;
  description: string;
  electricityPrice: number;
  waterPrice: number;
  servicePrice: number;
  deposit: number;
  accessPolicy: AccessPolicy;
  accessOpenTime: string | null;
  accessCloseTime: string | null;
  contactPhone: string;
  status: RentalListingStatus;
  rejectReason: string | null;
  approvedAt: string | null;
  expireAt: string | null;
  boostExpireAt: string | null;
}

export interface ListingMedia extends EntityFields {
  ownerType: 'RentalListing';
  ownerId: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  isPrivate: boolean;
}

export interface SavedListingRecord {
  favorite: Favorite;
  listing: RentalListing;
  media: readonly ListingMedia[];
}

export interface SavedListingCardView {
  favoriteId: string;
  id: string;
  title: string;
  price: number;
  area: number;
  location: string;
  imageUrl: string;
  status: RentalListingStatus;
}
