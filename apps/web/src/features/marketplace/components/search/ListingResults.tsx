import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { RoomCard } from '@/features/marketplace/components/RoomCard';
import type { ListingCardView } from '@/features/marketplace/types/listings';
import type { ListingViewMode } from '@/features/marketplace/components/search/ListingToolbar';

export interface ListingResultsProps {
  items: readonly ListingCardView[];
  total: number;
  page: number;
  pageSize: number;
  isPending: boolean;
  isError: boolean;
  isFiltered: boolean;
  viewMode: Exclude<ListingViewMode, 'map'>;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export function ListingResults({
  items,
  total,
  page,
  pageSize,
  isPending,
  isError,
  isFiltered,
  viewMode,
  onClearFilters,
  onPageChange,
  onRetry,
}: ListingResultsProps) {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: pageSize }, (_, index) => (
          <Skeleton key={index} count={1} variant="card" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="py-12 text-center" role="alert">
        <p className="font-semibold text-error">Không tải được danh sách phòng. Vui lòng thử lại.</p>
        <Button className="mt-4" onClick={onRetry} variant="outline">
          Thử lại
        </Button>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="py-12">
        <EmptyState
          action={
            isFiltered ? (
              <Button onClick={onClearFilters} variant="outline">
                Xóa lọc
              </Button>
            ) : undefined
          }
          description={
            isFiltered
              ? 'Thử mở rộng khu vực, thay đổi khoảng giá hoặc xóa bớt tiện ích.'
              : 'Hiện chưa có phòng nào được đăng công khai.'
          }
          icon={<Search aria-hidden="true" className="size-7" />}
          title={isFiltered ? 'Không tìm thấy phòng phù hợp' : 'Chưa có tin đăng nào'}
        />
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:hidden">
        {items.map((listing) => (
          <RoomCard key={listing.id} listing={listing} variant="mobile" />
        ))}
      </div>
      <div
        className={
          viewMode === 'list'
            ? 'hidden flex-col gap-4 md:flex'
            : 'hidden grid-cols-2 gap-5 md:grid lg:grid-cols-3'
        }
      >
        {items.map((listing) => (
          <RoomCard key={listing.id} listing={listing} variant={viewMode === 'list' ? 'list' : 'desktop'} />
        ))}
      </div>
      <Pagination className="mt-8 border-t border-line pt-7" onChange={onPageChange} page={page} pageSize={pageSize} total={total} />
    </>
  );
}
