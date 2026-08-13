'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { SavedListingCard } from '@/features/marketplace/components/SavedListingCard';
import { useSavedListings } from '@/features/marketplace/hooks/useSavedListings';
import { cn } from '@/utils/cn';

export interface SavedListingsPageProps {
  renterId: string;
}

const SKELETON_ITEMS = Array.from({ length: 6 });

export function SavedListingsPage({ renterId }: SavedListingsPageProps) {
  const router = useRouter();
  const { data: listings = [], isPending, isError } = useSavedListings({ renterId });

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-1.5 mt-0 text-[22px] font-black tracking-[-0.02em] text-ink md:text-[28px]">
          Tin đã lưu
        </h1>
        <p className="m-0 text-sm text-ink-muted">
          {listings.length > 0
            ? `${listings.length} tin bạn đã lưu. Bấm vào trái tim để bỏ khỏi danh sách.`
            : 'Những tin bạn bấm trái tim sẽ được lưu ở đây để xem lại sau.'}
        </p>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
          {SKELETON_ITEMS.map((_, index) => (
            <Skeleton
              key={index}
              className={cn(index >= 2 && 'hidden md:flex')}
              count={1}
              variant="card"
            />
          ))}
        </div>
      ) : isError ? (
        <Card className="px-6 py-12 text-center" role="alert">
          <p className="m-0 text-[15px] font-semibold text-error">
            Không tải được danh sách tin đã lưu. Vui lòng thử lại.
          </p>
        </Card>
      ) : listings.length === 0 ? (
        <Card className="px-6 py-12">
          <EmptyState
            action={
              <Button onClick={() => router.push('/tim-phong')} variant="primary">
                Xem tin đang đăng
              </Button>
            }
            data-testid="saved-listings-empty"
            description="Khi xem một tin phù hợp, bấm vào biểu tượng trái tim để lưu lại. Danh sách này chỉ bạn thấy."
            icon={<Heart aria-hidden="true" className="size-8" />}
            title="Bạn chưa lưu tin nào"
          />
        </Card>
      ) : (
        <div
          className="grid grid-cols-1 gap-[18px] md:grid-cols-3"
          data-testid="saved-listings-grid"
        >
          {listings.map((listing) => (
            <SavedListingCard key={listing.id} listing={listing} renterId={renterId} />
          ))}
        </div>
      )}
    </div>
  );
}
