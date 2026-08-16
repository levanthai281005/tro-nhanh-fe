'use client';

import { useEffect, useState } from 'react';
import { FilterSidebar } from '@/features/marketplace/components/search/FilterSidebar';
import type { InitialSearchFilters } from '@/features/marketplace/components/search/SearchResultsRoute';
import { useListings } from '@/features/marketplace/hooks/useListings';
import type {
  ListingSearchFilters,
  ListingSort,
} from '@/features/marketplace/types/listings';

export interface SearchResultsPageProps {
  initialFilters: InitialSearchFilters;
}

const PAGE_SIZE = 6;
const EMPTY_FILTERS: ListingSearchFilters = {
  keyword: '',
  propertyTypes: [],
  priceRange: '',
  areaRange: '',
  amenities: [],
};

export function SearchResultsPage({ initialFilters }: SearchResultsPageProps) {
  const [filters, setFilters] = useState<ListingSearchFilters>(initialFilters);
  const [pendingFilters, setPendingFilters] = useState<ListingSearchFilters>(initialFilters);
  const [sort, setSort] = useState<ListingSort>('newest');
  const [page, setPage] = useState(1);
  const listingQuery = useListings({ ...filters, sort, page, pageSize: PAGE_SIZE });

  useEffect(() => {
    setFilters(initialFilters);
    setPendingFilters(initialFilters);
    setSort('newest');
    setPage(1);
  }, [initialFilters]);

  const applyFilters = () => {
    setFilters(pendingFilters);
    setPage(1);
  };
  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPendingFilters(EMPTY_FILTERS);
    setPage(1);
  };

  return (
    <main className="mx-auto flex w-full max-w-[1200px] gap-7 px-4 py-8 md:px-8">
      <aside className="hidden w-[300px] shrink-0 md:block">
        <FilterSidebar
          filters={pendingFilters}
          onApply={applyFilters}
          onChange={setPendingFilters}
          onClear={clearFilters}
        />
      </aside>
      <section className="min-w-0 flex-1" data-listing-count={listingQuery.data?.total ?? 0}>
        <p className="text-sm text-ink-muted">Đang dựng danh sách kết quả…</p>
      </section>
    </main>
  );
}
