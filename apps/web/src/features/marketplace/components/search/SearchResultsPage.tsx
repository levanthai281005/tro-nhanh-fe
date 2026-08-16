'use client';

import { useEffect, useState } from 'react';
import {
  ActiveFilterChips,
  type ActiveFilterChip,
} from '@/features/marketplace/components/search/ActiveFilterChips';
import { FilterSidebar } from '@/features/marketplace/components/search/FilterSidebar';
import {
  ListingResults,
} from '@/features/marketplace/components/search/ListingResults';
import {
  ListingToolbar,
  type ListingViewMode,
} from '@/features/marketplace/components/search/ListingToolbar';
import { MapPlaceholder } from '@/features/marketplace/components/search/MapPlaceholder';
import { SearchPageHeader } from '@/features/marketplace/components/search/SearchPageHeader';
import type { InitialSearchFilters } from '@/features/marketplace/components/search/SearchResultsRoute';
import { PROPERTY_TYPE_OPTIONS } from '@/features/marketplace/constants/catalog';
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

function getActiveFilterChips(filters: ListingSearchFilters): readonly ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  if (filters.keyword) chips.push({ id: 'keyword', label: filters.keyword });
  if (filters.priceRange) chips.push({ id: 'priceRange', label: filters.priceRange });
  if (filters.areaRange) chips.push({ id: 'areaRange', label: filters.areaRange });
  filters.propertyTypes.forEach((propertyType) => {
    const label = PROPERTY_TYPE_OPTIONS.find((option) => option.value === propertyType)?.label;
    if (label) chips.push({ id: `propertyType:${propertyType}`, label });
  });
  filters.amenities.forEach((amenity) => {
    chips.push({ id: `amenity:${amenity}`, label: amenity });
  });
  return chips;
}

export function SearchResultsPage({ initialFilters }: SearchResultsPageProps) {
  const [filters, setFilters] = useState<ListingSearchFilters>(initialFilters);
  const [pendingFilters, setPendingFilters] = useState<ListingSearchFilters>(initialFilters);
  const [sort, setSort] = useState<ListingSort>('newest');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ListingViewMode>('grid');
  const listingQuery = useListings({ ...filters, sort, page, pageSize: PAGE_SIZE });

  useEffect(() => {
    setFilters(initialFilters);
    setPendingFilters(initialFilters);
    setSort('newest');
    setPage(1);
    setViewMode('grid');
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
  const removeFilter = (chipId: string) => {
    const nextFilters = ((): ListingSearchFilters => {
      if (chipId === 'keyword') return { ...filters, keyword: '' };
      if (chipId === 'priceRange') return { ...filters, priceRange: '' };
      if (chipId === 'areaRange') return { ...filters, areaRange: '' };
      if (chipId.startsWith('propertyType:')) {
        const propertyType = chipId.slice('propertyType:'.length);
        return {
          ...filters,
          propertyTypes: filters.propertyTypes.filter((value) => value !== propertyType),
        };
      }
      if (chipId.startsWith('amenity:')) {
        const amenity = chipId.slice('amenity:'.length);
        return { ...filters, amenities: filters.amenities.filter((value) => value !== amenity) };
      }
      return filters;
    })();
    setFilters(nextFilters);
    setPendingFilters(nextFilters);
    setPage(1);
  };
  const activeFilterChips = getActiveFilterChips(filters);
  const isFiltered = activeFilterChips.length > 0;
  const listingData = listingQuery.data;
  const total = listingData?.total ?? 0;

  return (
    <>
      <div className="hidden md:block">
        <SearchPageHeader isFiltered={isFiltered} total={total} />
      </div>
      <main className="mx-auto flex w-full max-w-[1200px] gap-7 px-4 py-6 md:px-8 md:py-8">
        <aside className="hidden w-[300px] shrink-0 md:block">
          <div className="sticky top-[84px] max-h-[calc(100vh-100px)] overflow-y-auto pb-6">
            <FilterSidebar
              filters={pendingFilters}
              onApply={applyFilters}
              onChange={setPendingFilters}
              onClear={clearFilters}
            />
          </div>
        </aside>
        <section className="min-w-0 flex-1">
          <div className="hidden space-y-4 md:block">
            <ListingToolbar
              onSortChange={(nextSort) => {
                setSort(nextSort);
                setPage(1);
              }}
              onViewModeChange={setViewMode}
              sort={sort}
              total={total}
              viewMode={viewMode}
            />
            <ActiveFilterChips chips={activeFilterChips} onRemove={removeFilter} />
          </div>

          <div className="mt-4 md:mt-5">
            {viewMode === 'map' ? (
              <MapPlaceholder />
            ) : (
              <ListingResults
                isError={listingQuery.isError}
                isFiltered={isFiltered}
                isPending={listingQuery.isPending}
                items={listingData?.items ?? []}
                onClearFilters={clearFilters}
                onPageChange={setPage}
                onRetry={() => void listingQuery.refetch()}
                page={listingData?.page ?? page}
                pageSize={listingData?.pageSize ?? PAGE_SIZE}
                total={total}
                viewMode={viewMode}
              />
            )}
          </div>
        </section>
      </main>
    </>
  );
}
