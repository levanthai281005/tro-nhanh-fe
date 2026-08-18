export const HOME_QUERY_KEYS = {
  all: ['marketplace', 'home'] as const,
  featuredListings: (limit: number) =>
    [...HOME_QUERY_KEYS.all, 'featured-listings', limit] as const,
  demandPosts: () => [...HOME_QUERY_KEYS.all, 'demand-posts'] as const,
};
