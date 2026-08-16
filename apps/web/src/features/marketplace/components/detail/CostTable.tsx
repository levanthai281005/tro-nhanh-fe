import { Droplets, KeyRound, ReceiptText, Wrench, Zap } from 'lucide-react';
import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';
import { DetailSection } from '@/features/marketplace/components/detail/Section';

export interface CostTableProps {
  detail: ListingDetailData;
}

function formatVnd(value: number, suffix = '') {
  if (!Number.isFinite(value) || value <= 0) return 'Chưa cập nhật';
  return `${value.toLocaleString('vi-VN')} đ${suffix}`;
}

export function CostTable({ detail }: CostTableProps) {
  const { listing } = detail.record;
  const costs = [
    { icon: ReceiptText, label: 'Giá thuê', value: formatVnd(listing.price, '/tháng') },
    { icon: Zap, label: 'Tiền điện', value: formatVnd(listing.electricityPrice, '/kWh') },
    { icon: Droplets, label: 'Tiền nước', value: formatVnd(listing.waterPrice) },
    { icon: Wrench, label: 'Phí dịch vụ', value: formatVnd(listing.servicePrice, '/tháng') },
    { icon: KeyRound, label: 'Đặt cọc', value: formatVnd(listing.deposit) },
  ];

  return (
    <DetailSection title="Chi phí hàng tháng">
      <div className="overflow-hidden rounded-lg border border-line">
        {costs.map(({ icon: Icon, label, value }, index) => (
          <div
            className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${
              index % 2 === 0 ? 'bg-surface' : 'bg-sand-soft'
            } ${index < costs.length - 1 ? 'border-b border-line' : ''}`}
            key={label}
          >
            <span className="inline-flex items-center gap-2.5 text-ink-muted">
              <Icon aria-hidden="true" className="size-4 text-sand" strokeWidth={1.8} />
              {label}
            </span>
            <span className="text-right font-semibold text-ink">{value}</span>
          </div>
        ))}
      </div>
    </DetailSection>
  );
}
