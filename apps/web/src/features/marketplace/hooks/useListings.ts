'use client';

import { useQuery } from '@tanstack/react-query';
import { LISTING_QUERY_KEYS } from '@/features/marketplace/constants/listingQueryKeys';
import { searchListings } from '@/features/marketplace/services/listingsService';
import type { ListingSearchParams } from '@/features/marketplace/types/listings';

export function useListings(params: ListingSearchParams) {
  return useQuery({
    queryKey: LISTING_QUERY_KEYS.search(params),
    queryFn: () => searchListings(params),
    staleTime: 30_000,
  });
}
