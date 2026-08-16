'use client';

import { MessageSquare, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ModalShell } from '@/components/ui/ModalShell';
import { PhoneModal } from '@/features/marketplace/components/detail/PhoneModal';
import { ReportListingDialog } from '@/features/marketplace/components/detail/ReportListingDialog';
import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';

export interface StickyContactCardProps {
  detail: ListingDetailData;
  viewerId?: string;
}

function formatVnd(value: number, suffix = '') {
  return value > 0 ? `${value.toLocaleString('vi-VN')} đ${suffix}` : 'Chưa cập nhật';
}

function getMaskedPhone(phone: string) {
  const normalizedPhone = phone.replace(/\s+/g, '');
  if (normalizedPhone.length < 7) return '****';
  return `${normalizedPhone.slice(0, 4)}****${normalizedPhone.slice(-3)}`;
}

export function StickyContactCard({ detail, viewerId }: StickyContactCardProps) {
  const router = useRouter();
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [chatNoticeOpen, setChatNoticeOpen] = useState(false);
  const { listing } = detail.record;
  const redirectPath = `/phong/${listing.id}`;
  const isOwnListing = viewerId === listing.sellerId;
  const displayPhone = viewerId ? listing.contactPhone : getMaskedPhone(listing.contactPhone);

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
      <Card className="overflow-hidden p-0 shadow-lg">
        <div className="bg-primary px-6 py-5 text-surface">
          <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-surface/70">
            Giá thuê hàng tháng
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-[-0.02em]">
            {formatVnd(listing.price)}
            <span className="ml-1 text-sm font-medium text-surface/70">/tháng</span>
          </p>
          <div className="mt-3 space-y-1 border-t border-surface/20 pt-3 text-xs text-surface/75">
            <p className="flex justify-between gap-3">
              <span>Điện</span>
              <span className="font-semibold text-surface">
                {formatVnd(listing.electricityPrice, '/kWh')}
              </span>
            </p>
            <p className="flex justify-between gap-3">
              <span>Nước</span>
              <span className="font-semibold text-surface">{formatVnd(listing.waterPrice)}</span>
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-center gap-3 border-b border-line pb-4">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-sand-soft text-primary">
              <UserRound aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="font-bold text-ink">Chủ phòng</p>
              <p className="mt-0.5 text-xs text-ink-muted">Liên hệ để trao đổi thêm về phòng</p>
            </div>
          </div>

          {isOwnListing ? (
            <p className="rounded-md bg-sand-soft px-3 py-2.5 text-sm text-ink-muted">
              Bạn đang xem tin do mình đăng.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              <Button
                fullWidth
                icon={<MessageSquare aria-hidden="true" className="size-4" />}
                onClick={handleMessage}
              >
                Gửi tin nhắn
              </Button>
              <Button
                fullWidth
                icon={<Phone aria-hidden="true" className="size-4" />}
                onClick={() => setPhoneOpen(true)}
                variant="outline"
              >
                Gọi {displayPhone}
              </Button>
            </div>
          )}

          <p className="mt-3 text-center text-xs leading-5 text-ink-muted">
            Hãy kiểm tra phòng trực tiếp trước khi đặt cọc hoặc chuyển tiền.
          </p>
          <div className="mt-3 flex gap-2 rounded-md bg-sand-soft p-3 text-xs leading-5 text-ink-muted">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sand" />
            <span>Trao đổi rõ ràng và chỉ đặt cọc sau khi đã xác nhận thông tin phù hợp.</span>
          </div>
          <div className="mt-4 border-t border-line pt-3">
            <ReportListingDialog
              listingId={listing.id}
              redirectPath={redirectPath}
              viewerId={viewerId}
            />
          </div>
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
        >
          <p className="text-sm leading-6 text-ink-muted">
            Hộp thư sẽ được kết nối ở nhánh chat. Bạn vẫn có thể gọi trực tiếp cho chủ phòng.
          </p>
        </ModalShell>
      ) : null}
    </>
  );
}
