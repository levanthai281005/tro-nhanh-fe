export const MY_LISTING_QUERY_KEYS = {
  all: ['marketplace', 'my-listings'] as const,
  list: (sellerId: string | undefined) =>
    [...MY_LISTING_QUERY_KEYS.all, 'list', sellerId ?? 'guest'] as const,
  boostPackages: () => [...MY_LISTING_QUERY_KEYS.all, 'boost-packages'] as const,
};
