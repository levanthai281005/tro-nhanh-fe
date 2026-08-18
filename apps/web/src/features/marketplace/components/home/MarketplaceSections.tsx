'use client';

import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { DemandPostCard } from '@/features/marketplace/components/DemandPostCard';
import { useActiveDemandPosts } from '@/features/marketplace/hooks/useHomeData';
import type { DemandPostCardView } from '@/features/marketplace/types/home';
import { cn } from '@/utils/cn';

type DemandPostKind = DemandPostCardView['kind'];
const PREVIEW_LIMIT = 4;

function demandListPath(kind: DemandPostKind) {
  return kind === 'RoomWanted' ? '/tin-tim-phong' : '/tin-o-ghep';
}

export function MarketplaceSections() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DemandPostKind>('RoomWanted');
  const { data: posts = [], isPending, isError } = useActiveDemandPosts();
  const roomWantedPosts = posts.filter((post) => post.kind === 'RoomWanted');
  const roommateWantedPosts = posts.filter((post) => post.kind === 'RoommateWanted');
  const activePosts = activeTab === 'RoomWanted' ? roomWantedPosts : roommateWantedPosts;

  const handleMessage = (post: DemandPostCardView) => {
    // TODO: nối AuthContext và API tạo Conversation khi hai capability này sẵn sàng.
    const redirect = demandListPath(post.kind);
    router.push(`/dang-nhap?redirect=${encodeURIComponent(redirect)}`);
  };

  return (
    <section className="border-y border-line bg-cream">
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-8 md:py-16">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="flex items-start gap-2.5 text-left">
            <Home aria-hidden="true" className="mt-1 size-7 shrink-0 text-primary" />
            <div>
              <h2 className="text-[22px] font-black text-ink md:text-3xl">
                Nhu cầu khách thuê &amp; Ở ghép
              </h2>
              <p className="mt-1 text-[13px] leading-[1.5] text-ink-muted md:text-[15px]">
                Tìm kiếm khách thuê đang tìm phòng hoặc các tin tìm người ở ghép cùng chia sẻ chi
                phí.
              </p>
            </div>
          </div>
          <button
            className="inline-flex min-h-11 shrink-0 items-center px-1 text-[13px] font-bold text-primary hover:text-primary-hover"
            onClick={() => router.push(demandListPath(activeTab))}
            type="button"
          >
            Xem tất cả nhu cầu →
          </button>
        </div>

        <div className="mb-6 flex w-full gap-2 rounded-md bg-primary/5 p-1 md:w-fit">
          <DemandTab
            isActive={activeTab === 'RoomWanted'}
            label={`Khách tìm phòng (${roomWantedPosts.length})`}
            onClick={() => setActiveTab('RoomWanted')}
          />
          <DemandTab
            isActive={activeTab === 'RoommateWanted'}
            label={`Tìm bạn ở ghép (${roommateWantedPosts.length})`}
            onClick={() => setActiveTab('RoommateWanted')}
          />
        </div>

        {isPending ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: PREVIEW_LIMIT }, (_, index) => (
              <Skeleton key={index} count={1} variant="card" />
            ))}
          </div>
        ) : isError ? (
          <Card className="px-6 py-10 text-center" role="alert">
            <p className="font-semibold text-error">
              Không tải được danh sách tin nhu cầu. Vui lòng thử lại.
            </p>
          </Card>
        ) : activePosts.length === 0 ? (
          <EmptyState
            description="Hiện chưa có tin đăng nhu cầu nào thuộc danh mục này."
            title={
              activeTab === 'RoomWanted'
                ? 'Chưa có nhu cầu tìm phòng nào'
                : 'Chưa có nhu cầu tìm bạn ở ghép nào'
            }
          />
        ) : (
          <div
            className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-4 lg:grid-cols-4"
            data-testid="home-demand-grid"
          >
            {activePosts.slice(0, PREVIEW_LIMIT).map((post) => (
              <DemandPostCard
                key={post.id}
                onMessage={() => handleMessage(post)}
                onView={() => router.push(demandListPath(post.kind))}
                post={post}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface DemandTabProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

function DemandTab({ isActive, label, onClick }: DemandTabProps) {
  return (
    <button
      aria-pressed={isActive}
      className={cn(
        'min-h-10 flex-1 rounded-sm px-3 text-xs font-bold transition md:flex-none md:px-5 md:text-[13.5px]',
        isActive ? 'bg-surface text-primary shadow-sm' : 'text-ink-muted hover:text-primary',
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
