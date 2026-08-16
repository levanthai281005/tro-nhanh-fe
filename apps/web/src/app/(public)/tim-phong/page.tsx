import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchResultsRoute } from '@/features/marketplace/components/search/SearchResultsRoute';

export const metadata: Metadata = {
  title: 'Tìm phòng | Trọ Nhanh',
  description: 'Tìm phòng trọ, căn hộ dịch vụ và chỗ ở phù hợp trên Trọ Nhanh.',
};

interface SearchResultsRoutePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function SearchResultsRoutePage({ searchParams }: SearchResultsRoutePageProps) {
  return (
    <Suspense fallback={null}>
      <SearchResultsRoute searchParams={searchParams} />
    </Suspense>
  );
}
