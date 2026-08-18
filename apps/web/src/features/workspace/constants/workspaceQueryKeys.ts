/** Registry query key cục bộ của feature workspace — không dùng chung với feature khác. */
export const PROPERTY_QUERY_KEYS = {
  all: ['workspace', 'properties'] as const,
  list: (sellerId: string | undefined) =>
    [...PROPERTY_QUERY_KEYS.all, 'list', sellerId ?? 'guest'] as const,
  detail: (propertyId: string) => [...PROPERTY_QUERY_KEYS.all, 'detail', propertyId] as const,
};

export const ROOM_QUERY_KEYS = {
  all: ['workspace', 'rooms'] as const,
  byProperty: (propertyId: string) => [...ROOM_QUERY_KEYS.all, 'by-property', propertyId] as const,
};
