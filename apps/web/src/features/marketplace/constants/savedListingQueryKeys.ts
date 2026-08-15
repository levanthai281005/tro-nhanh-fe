export const SAVED_LISTING_QUERY_KEYS = {
  all: ['marketplace', 'saved-listings'] as const,
  list: (renterId: string | undefined) =>
    [...SAVED_LISTING_QUERY_KEYS.all, 'list', renterId ?? 'guest'] as const,
  ids: (renterId: string | undefined) =>
    [...SAVED_LISTING_QUERY_KEYS.all, 'ids', renterId ?? 'guest'] as const,
};
