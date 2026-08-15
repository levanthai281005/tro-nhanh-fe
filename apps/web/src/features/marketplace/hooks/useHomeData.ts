'use client';

import { useQuery } from '@tanstack/react-query';
import { HOME_QUERY_KEYS } from '@/features/marketplace/constants/homeQueryKeys';
import {
  getFeaturedListings,
  listActiveDemandPosts,
} from '@/features/marketplace/services/homeService';

export function useFeaturedListings(limit = 4) {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.featuredListings(limit),
    queryFn: () => getFeaturedListings(limit),
    staleTime: 30_000,
  });
}

export function useActiveDemandPosts() {
  return useQuery({
    queryKey: HOME_QUERY_KEYS.demandPosts(),
    queryFn: listActiveDemandPosts,
    staleTime: 30_000,
  });
}
