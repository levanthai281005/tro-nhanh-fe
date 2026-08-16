'use client';

import type { InitialSearchFilters } from '@/features/marketplace/components/search/SearchResultsRoute';

export interface SearchResultsPageProps {
  initialFilters: InitialSearchFilters;
}

export function SearchResultsPage({ initialFilters }: SearchResultsPageProps) {
  return <main data-initial-keyword={initialFilters.keyword} />;
}
