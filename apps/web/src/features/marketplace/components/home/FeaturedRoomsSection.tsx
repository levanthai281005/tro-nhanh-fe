'use client';

import { ArrowRight, FileText, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { QuickFilterChips } from '@/features/marketplace/components/home/QuickFilterChips';
import { RoomCard } from '@/features/marketplace/components/home/RoomCard';
import { useFeaturedListings } from '@/features/marketplace/hooks/useHomeData';

const FEATURED_LIMIT = 4;

export function FeaturedRoomsSection() {
  const router = useRouter();
  const { data: listings = [], isPending, isError } = useFeaturedListings(FEATURED_LIMIT);

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-8 md:py-[60px]">
      <div className="mb-5 flex items-center justify-between md:hidden">
        <div>
          <h2 className="mb-0.5 text-xl font-extrabold text-ink">Phòng mới đăng tải</h2>
          <p className="text-xs text-ink-muted">Được cập nhật gần đây</p>
        </div>
        <button
          className="inline-flex min-h-11 items-center gap-1 text-[13px] font-semibold text-primary"
          onClick={() => router.push('/tim-phong')}
          type="button"
        >
          Xem tất cả <ArrowRight aria-hidden="true" className="size-3.5" />
        </button>
      </div>

      <div className="mb-6 hidden items-center justify-between md:flex">
        <div className="flex items-start gap-2.5 text-left">
          <FileText aria-hidden="true" className="mt-1 size-7 shrink-0 text-primary" />
          <div>
            <h2 className="text-[28px] font-black tracking-[-0.015em] text-ink">
              Phòng mới đăng tải
            </h2>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              Khám phá những phòng trọ mới nhất được cập nhật mỗi ngày.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-hover"
            onClick={() => router.push('/tim-phong')}
            type="button"
          >
            Xem tất cả <ArrowRight aria-hidden="true" className="size-[15px]" />
          </button>
          <Button
            icon={<SlidersHorizontal aria-hidden="true" className="size-[13px]" />}
            onClick={() => router.push('/tim-phong')}
            size="sm"
            variant="outline"
          >
            Bộ lọc nâng cao
          </Button>
        </div>
      </div>

      <QuickFilterChips className="mb-5 md:mb-6" />

      {isPending ? (
        <>
          <div className="flex flex-col gap-4 md:hidden" data-testid="featured-loading-mobile">
            <Skeleton count={2} variant="card" />
          </div>
          <div
            className="hidden grid-cols-2 gap-5 md:grid lg:grid-cols-4"
            data-testid="featured-loading-desktop"
          >
            {Array.from({ length: FEATURED_LIMIT }, (_, index) => (
              <Skeleton key={index} count={1} variant="card" />
            ))}
          </div>
        </>
      ) : isError ? (
        <Card className="px-6 py-10 text-center" role="alert">
          <p className="font-semibold text-error">
            Không tải được danh sách phòng nổi bật. Vui lòng thử lại.
          </p>
        </Card>
      ) : listings.length === 0 ? (
        <Card className="px-6 py-10">
          <EmptyState
            action={
              <Button onClick={() => router.push('/chu-tro/dang-tin')}>Đăng tin ngay</Button>
            }
            description="Hiện chưa có tin đăng phòng trọ công khai nào trên hệ thống."
            title="Chưa có tin đăng phòng trọ nào"
          />
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-4 md:hidden" data-testid="featured-rooms-mobile">
            {listings.map((listing) => (
              <RoomCard key={listing.id} listing={listing} variant="mobile" />
            ))}
          </div>
          <div
            className="hidden grid-cols-2 gap-5 md:grid lg:grid-cols-4"
            data-testid="featured-rooms-desktop"
          >
            {listings.map((listing) => (
              <RoomCard key={listing.id} listing={listing} variant="desktop" />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
