'use client';

import { MessageSquare, Phone, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ModalShell } from '@/components/ui/ModalShell';
import { PhoneModal } from '@/features/marketplace/components/detail/PhoneModal';
import { ReportListingDialog } from '@/features/marketplace/components/detail/ReportListingDialog';
import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';

export interface MobileContactCardProps {
  detail: ListingDetailData;
  viewerId?: string;
}

export function MobileContactCard({ detail, viewerId }: MobileContactCardProps) {
  const router = useRouter();
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [chatNoticeOpen, setChatNoticeOpen] = useState(false);
  const { listing } = detail.record;
  const redirectPath = `/phong/${listing.id}`;
  const isOwnListing = viewerId === listing.sellerId;

  const handleMessage = () => {
    if (!viewerId) {
      router.push(`/dang-nhap?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
    if (isOwnListing) return;
    setChatNoticeOpen(true);
  };

  return (
    <>
      <Card className="mb-6 p-4">
        <h2 className="mb-3 text-[15px] font-bold text-ink">Liên hệ chủ phòng</h2>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-sand-soft text-primary">
            <UserRound aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">Chủ phòng</p>
            <p className="mt-0.5 text-[11px] text-ink-muted">Liên hệ để hỏi thêm về phòng</p>
          </div>
        </div>

        {isOwnListing ? (
          <p className="rounded-md bg-sand-soft px-3 py-2.5 text-sm text-ink-muted">
            Bạn đang xem tin do mình đăng.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              fullWidth
              icon={<MessageSquare aria-hidden="true" className="size-4" />}
              onClick={handleMessage}
              size="sm"
            >
              Nhắn tin
            </Button>
            <Button
              fullWidth
              icon={<Phone aria-hidden="true" className="size-4" />}
              onClick={() => setPhoneOpen(true)}
              size="sm"
              variant="outline"
            >
              Gọi điện
            </Button>
          </div>
        )}

        <p className="mt-3 text-[11px] leading-5 text-ink-muted">
          Hãy kiểm tra phòng trực tiếp trước khi đặt cọc hoặc chuyển tiền.
        </p>
        <div className="mt-3 border-t border-line pt-3">
          <ReportListingDialog
            listingId={listing.id}
            redirectPath={redirectPath}
            viewerId={viewerId}
          />
        </div>
      </Card>

      <PhoneModal
        onClose={() => setPhoneOpen(false)}
        open={phoneOpen}
        phone={listing.contactPhone}
        redirectPath={redirectPath}
        viewerId={viewerId}
      />
      {chatNoticeOpen ? (
        <ModalShell
          footer={<Button onClick={() => setChatNoticeOpen(false)}>Đã hiểu</Button>}
          onClose={() => setChatNoticeOpen(false)}
          title="Tin nhắn đang được hoàn thiện"
          variant="bottom-sheet"
        >
          <p className="text-sm leading-6 text-ink-muted">
            Hộp thư sẽ được kết nối ở nhánh chat. Bạn vẫn có thể gọi trực tiếp cho chủ phòng.
          </p>
        </ModalShell>
      ) : null}
    </>
  );
}
