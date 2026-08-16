import { SearchResultsPage } from '@/features/marketplace/components/search/SearchResultsPage';

export interface InitialSearchFilters {
  keyword: string;
  propertyType: string;
  priceRange: string;
}

export interface SearchResultsRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export async function SearchResultsRoute({ searchParams }: SearchResultsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const initialFilters: InitialSearchFilters = {
    keyword: readSearchParam(resolvedSearchParams, 'loc'),
    propertyType: readSearchParam(resolvedSearchParams, 'type'),
    priceRange: readSearchParam(resolvedSearchParams, 'price'),
  };

  return <SearchResultsPage initialFilters={initialFilters} />;
}
