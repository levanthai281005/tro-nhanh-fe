import { Eye, EyeOff, FileText, Star, type LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import type { MyListingStats } from '@/features/marketplace/types/myListings';

export interface MyListingsKpiCardsProps {
  stats: MyListingStats | undefined;
  isPending: boolean;
}

interface KpiMeta {
  key: keyof MyListingStats;
  label: string;
  Icon: LucideIcon;
  className: string;
}

/**
 * Bốn chỉ số suy trực tiếp từ danh sách tin của chính seller.
 *
 * Prototype còn hai ô "Tổng lượt xem" và "Tổng liên hệ", nhưng `RentalListing` trong
 * DATA_ENTITIES.md không có trường đếm nào cho hai số đó — bản prototype điền số cứng.
 * Ở đây bỏ hẳn thay vì hiển thị số không có nguồn.
 */
// TODO(v1): thêm lượt xem/liên hệ khi backend có số liệu thật (lượt liên hệ suy từ ContactEvent).
const KPI_META: readonly KpiMeta[] = [
  {
    key: 'total',
    label: 'Tổng tin đăng',
    Icon: FileText,
    className: 'bg-primary-soft text-primary',
  },
  {
    key: 'active',
    label: 'Đang hiển thị',
    Icon: Eye,
    className: 'bg-status-available-soft text-status-available',
  },
  {
    key: 'boosted',
    label: 'Tin nổi bật',
    Icon: Star,
    className: 'bg-warning-soft text-accent-warn',
  },
  {
    key: 'hidden',
    label: 'Đã ẩn',
    Icon: EyeOff,
    className: 'bg-status-rented-soft text-ink-muted',
  },
];

export function MyListingsKpiCards({ stats, isPending }: MyListingsKpiCardsProps) {
  if (isPending || !stats) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {KPI_META.map((meta) => (
          <div
            className="rounded-lg border border-line bg-surface p-4"
            key={meta.key}
            data-testid="kpi-skeleton"
          >
            <Skeleton count={2} variant="text" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4" data-testid="my-listings-kpis">
      {KPI_META.map(({ key, label, Icon, className }) => (
        <div className="rounded-lg border border-line bg-surface px-4 py-4" key={key}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.05em] text-ink-muted">
              {label}
            </span>
            <span className={`flex size-6 items-center justify-center rounded-full ${className}`}>
              <Icon aria-hidden="true" className="size-3" strokeWidth={2.4} />
            </span>
          </div>
          <span className="text-2xl font-black leading-none text-ink">{stats[key]}</span>
        </div>
      ))}
    </div>
  );
}
