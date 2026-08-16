import type {
  ListingMedia,
  RentalListing,
  RentalPropertyType,
} from '@/features/marketplace/types/savedListings';

export interface MarketplaceEntityFields {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Amenity extends MarketplaceEntityFields {
  name: string;
  icon: string;
  type: 'Room' | 'Surrounding';
}

export interface ListingRecord {
  listing: RentalListing;
  media: readonly ListingMedia[];
  amenities: readonly Amenity[];
}

export type ListingBadge = 'Tin nổi bật' | 'Mới đăng' | null;

export interface ListingCardView {
  id: string;
  title: string;
  price: number;
  area: number;
  location: string;
  imageUrl: string;
  amenities: readonly Pick<Amenity, 'icon' | 'name'>[];
  propertyType: RentalPropertyType;
  badge: ListingBadge;
}
