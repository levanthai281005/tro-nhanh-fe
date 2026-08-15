'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { SAVED_LISTING_QUERY_KEYS } from '@/features/marketplace/constants/savedListingQueryKeys';
import {
  getSavedListingIds,
  getSavedListings,
} from '@/features/marketplace/services/savedListingsService';

export interface UseSavedListingsOptions {
  renterId?: string;
}

export function useSavedListings({ renterId }: UseSavedListingsOptions) {
  return useQuery({
    queryKey: SAVED_LISTING_QUERY_KEYS.list(renterId),
    queryFn: () => getSavedListings(renterId),
    enabled: Boolean(renterId),
    staleTime: 30_000,
  });
}

export function useSavedListingIds({ renterId }: UseSavedListingsOptions) {
  const query = useQuery({
    queryKey: SAVED_LISTING_QUERY_KEYS.ids(renterId),
    queryFn: () => getSavedListingIds(renterId),
    enabled: Boolean(renterId),
    staleTime: 30_000,
  });
  const savedIds = useMemo(() => new Set(query.data ?? []), [query.data]);

  return { ...query, savedIds };
}
