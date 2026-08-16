'use client';

import { ArrowRight, Building2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PostTypeModal } from '@/features/marketplace/components/home/PostTypeModal';
import { cn } from '@/utils/cn';

const POSTING_OPTIONS = [
  {
    Icon: Search,
    title: 'Tôi đang tìm phòng',
    description:
      'Đăng nhu cầu tìm phòng hoặc tìm bạn ở ghép để chủ nhà và các thành viên khác chủ động liên hệ.',
    button: 'Đăng tin tìm phòng',
    kind: 'renter',
  },
  {
    Icon: Building2,
    title: 'Tôi có phòng cho thuê',
    description:
      'Đăng phòng trống, quản lý danh sách phòng, xuất hóa đơn điện nước và kết nối nhanh chóng với khách hàng.',
    button: 'Đăng tin cho thuê',
    kind: 'landlord',
  },
] as const;

export function PostingCTASection() {
  const router = useRouter();
  const [isPostTypeOpen, setIsPostTypeOpen] = useState(false);

  const selectPostType = (kind: 'RoomWanted' | 'RoommateWanted') => {
    setIsPostTypeOpen(false);
    const kindParam = kind === 'RoommateWanted' ? 'o-ghep' : 'tim-phong';
    router.push(`/tai-khoan/dang-tin-nhu-cau?kind=${kindParam}`);
  };

  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-[1200px] px-4 py-[52px] md:px-8 md:py-[72px]">
        <div className="mb-6 text-center md:mb-8">
          <h2 className="mb-2 text-[22px] font-black tracking-[-0.02em] text-ink md:text-3xl">
            Bạn muốn đăng tin?
          </h2>
          <p className="text-[13px] text-ink-muted">
            Chọn nhu cầu phù hợp để bắt đầu kết nối trên Trọ Nhanh.
          </p>
        </div>

        <div className="mx-auto grid max-w-[920px] grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-5">
          {POSTING_OPTIONS.map(({ Icon, title, description, button, kind }) => {
            const isRenter = kind === 'renter';
            return (
              <div
                key={title}
                className={cn(
                  'flex flex-col gap-5 rounded-[20px] border-[1.5px] border-line p-6 text-left md:p-8',
                  isRenter ? 'bg-canvas' : 'bg-surface',
                )}
              >
                <span
                  className={cn(
                    'flex size-[52px] shrink-0 items-center justify-center rounded-lg',
                    isRenter ? 'bg-primary text-surface' : 'bg-cream text-primary',
                  )}
                >
                  <Icon aria-hidden="true" className="size-[22px]" />
                </span>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-extrabold text-ink">{title}</h3>
                  <p className="mb-5 text-[13.5px] leading-[1.65] text-ink-muted">{description}</p>
                  <Button
                    icon={<ArrowRight aria-hidden="true" className="size-3.5" />}
                    onClick={() => {
                      if (isRenter) setIsPostTypeOpen(true);
                      else router.push('/dang-tin-cho-thue');
                    }}
                    variant={isRenter ? 'primary' : 'outline'}
                  >
                    {button}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isPostTypeOpen ? (
        <PostTypeModal onClose={() => setIsPostTypeOpen(false)} onSelect={selectPostType} />
      ) : null}
    </section>
  );
}
