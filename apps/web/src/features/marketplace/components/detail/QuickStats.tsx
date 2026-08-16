import { Building2, Clock3, KeyRound, Users } from 'lucide-react';
import { PROPERTY_TYPE_OPTIONS } from '@/features/marketplace/constants/catalog';
import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';
import { DetailSection } from '@/features/marketplace/components/detail/Section';

export interface QuickStatsProps {
  detail: ListingDetailData;
}

function formatVnd(amount: number) {
  return `${amount.toLocaleString('vi-VN')} đ`;
}

export function QuickStats({ detail }: QuickStatsProps) {
  const { listing } = detail.record;
  const propertyType =
    PROPERTY_TYPE_OPTIONS.find((option) => option.value === listing.propertyType)?.label ??
    listing.propertyType;
  const accessTime =
    listing.accessPolicy === 'Free'
      ? 'Tự do'
      : listing.accessOpenTime && listing.accessCloseTime
        ? `${listing.accessOpenTime} – ${listing.accessCloseTime}`
        : 'Có giới hạn';
  const stats = [
    { icon: Building2, label: 'Diện tích', value: `${listing.area} m²` },
    { icon: Users, label: 'Loại hình', value: propertyType },
    { icon: Clock3, label: 'Giờ giấc', value: accessTime },
    {
      icon: KeyRound,
      label: 'Đặt cọc',
      value: listing.deposit > 0 ? formatVnd(listing.deposit) : 'Chưa cập nhật',
    },
  ];

  return (
    <DetailSection title="Thông tin cơ bản">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            className="rounded-lg border border-line bg-sand-soft px-3 py-4 text-center"
            key={label}
          >
            <Icon
              aria-hidden="true"
              className="mx-auto mb-2 size-5 text-primary"
              strokeWidth={1.8}
            />
            <p className="text-sm font-bold text-ink">{value}</p>
            <p className="mt-0.5 text-[11px] text-ink-muted">{label}</p>
          </div>
        ))}
      </div>
    </DetailSection>
  );
}
