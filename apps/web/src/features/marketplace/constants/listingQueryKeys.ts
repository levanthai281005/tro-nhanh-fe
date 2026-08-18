import type { ListingSearchParams } from '@/features/marketplace/types/listings';

export const LISTING_QUERY_KEYS = {
  all: ['marketplace', 'listings'] as const,
  search: (params: ListingSearchParams) => [...LISTING_QUERY_KEYS.all, 'search', params] as const,
};
