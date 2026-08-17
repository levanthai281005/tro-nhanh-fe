export const SESSION_QUERY_KEYS = {
  all: ['session'] as const,
  context: () => [...SESSION_QUERY_KEYS.all, 'context'] as const,
};
