import type {
  ListingMedia,
  RentalListing,
  RentalPropertyType,
} from '@/features/marketplace/types/savedListings';
import type { AREA_RANGES, PRICE_RANGES } from '@/features/marketplace/constants/catalog';

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

export type PriceRange = (typeof PRICE_RANGES)[number];
export type AreaRange = (typeof AREA_RANGES)[number];
export type ListingSort = 'newest' | 'price-asc' | 'price-desc' | 'area-desc';

export interface ListingSearchFilters {
  keyword: string;
  priceRange: PriceRange | '';
  propertyTypes: readonly RentalPropertyType[];
  areaRange: AreaRange | '';
  amenities: readonly string[];
}

export interface ListingSearchParams extends ListingSearchFilters {
  sort: ListingSort;
  page: number;
  pageSize: number;
}

export interface ListingSearchResult {
  items: readonly ListingCardView[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
