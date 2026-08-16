import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import {
  PRICE_RANGES,
  PROPERTY_TYPES,
  PROPERTY_TYPE_VALUE_BY_LABEL,
} from '@/features/marketplace/constants/catalog';
import { LISTING_QUERY_KEYS } from '@/features/marketplace/constants/listingQueryKeys';
import { SearchResultsPage } from '@/features/marketplace/components/search/SearchResultsPage';
import { searchListings } from '@/features/marketplace/services/listingsService';
import type {
  ListingSearchFilters,
  ListingSearchParams,
  PriceRange,
} from '@/features/marketplace/types/listings';

export type InitialSearchFilters = ListingSearchFilters;

export interface SearchResultsRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readSearchParam(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return (Array.isArray(value) ? (value[0] ?? '') : (value ?? '')).trim();
}

function isPriceRange(value: string): value is PriceRange {
  return (PRICE_RANGES as readonly string[]).includes(value);
}

function initialFiltersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): InitialSearchFilters {
  const propertyTypeLabel = readSearchParam(searchParams, 'type');
  const propertyType = (PROPERTY_TYPES as readonly string[]).includes(propertyTypeLabel)
    ? PROPERTY_TYPE_VALUE_BY_LABEL[propertyTypeLabel as keyof typeof PROPERTY_TYPE_VALUE_BY_LABEL]
    : undefined;
  const priceRange = readSearchParam(searchParams, 'price');

  return {
    keyword: readSearchParam(searchParams, 'loc'),
    propertyTypes: propertyType ? [propertyType] : [],
    priceRange: isPriceRange(priceRange) ? priceRange : '',
    areaRange: '',
    amenities: [],
  };
}

export async function SearchResultsRoute({ searchParams }: SearchResultsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const initialFilters = initialFiltersFromSearchParams(resolvedSearchParams);
  const initialListingParams: ListingSearchParams = {
    ...initialFilters,
    sort: 'newest',
    page: 1,
    pageSize: 6,
  };
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: LISTING_QUERY_KEYS.search(initialListingParams),
    queryFn: () => searchListings(initialListingParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchResultsPage initialFilters={initialFilters} />
    </HydrationBoundary>
  );
}
