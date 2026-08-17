import { Building2, ChevronRight, Globe, MapPin, WalletCards } from 'lucide-react';
import Link from 'next/link';
import type { PropertyListItem } from '@/features/workspace/types/property';

/**
 * Một khu trọ trong danh sách B6.
 *
 * Cả thẻ là một link sang màn phòng của khu — đó là việc chủ trọ làm gần như mọi lần vào đây.
 * Các lối phụ (sửa khu, nhận tiền) thuộc B7 và đi qua màn chi tiết.
 */
export function PropertyCard({ property }: { property: PropertyListItem }) {
  return (
    <Link
      className="flex flex-col gap-3 rounded-md border-[1.5px] border-line bg-surface p-[18px] shadow-sm transition-colors hover:border-sand"
      href={`/chu-tro/khu-tro/${property.id}/phong`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-cream">
            <Building2 aria-hidden="true" className="size-[19px] text-primary" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold text-ink">
              {property.name}
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
              <MapPin aria-hidden="true" className="size-3 shrink-0" />
              <span className="truncate">{property.address || property.district || '—'}</span>
            </span>
          </span>
        </span>
        <ChevronRight aria-hidden="true" className="size-[18px] shrink-0 text-ink-muted" />
      </div>

      <dl className="grid grid-cols-4 gap-2 border-t border-line pt-3">
        <PropertyStat label="Tổng phòng" value={property.roomCount} />
        <PropertyStat label="Trống" tone="available" value={property.availableCount} />
        <PropertyStat label="Đã cọc" tone="deposited" value={property.depositedCount} />
        <PropertyStat label="Đang thuê" tone="rented" value={property.rentedCount} />
      </dl>

      {/* Hai cảnh báo này quan trọng hơn vẻ ngoài của chúng: thiếu thông tin nhận tiền thì
          hóa đơn xuất ra không có VietQR, và chủ trọ chỉ phát hiện lúc sắp gửi cho người ở. */}
      {!property.hasPayoutInfo || !property.isPublicProfileEnabled ? (
        <div className="flex flex-wrap gap-1.5 border-t border-line pt-3">
          {!property.hasPayoutInfo ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-1 text-[11.5px] font-bold text-warning">
              <WalletCards aria-hidden="true" className="size-3" />
              Chưa có thông tin nhận tiền
            </span>
          ) : null}
          {!property.isPublicProfileEnabled ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1 text-[11.5px] font-medium text-ink-muted">
              <Globe aria-hidden="true" className="size-3" />
              Chưa bật hồ sơ công khai
            </span>
          ) : null}
        </div>
      ) : null}
    </Link>
  );
}

function PropertyStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'available' | 'deposited' | 'rented';
}) {
  const toneClass =
    tone === 'available'
      ? 'text-status-available'
      : tone === 'deposited'
        ? 'text-status-deposited'
        : tone === 'rented'
          ? 'text-status-rented'
          : 'text-ink';

  return (
    <div>
      <dd className={`text-lg font-extrabold ${toneClass}`}>{value}</dd>
      <dt className="text-[11.5px] text-ink-muted">{label}</dt>
    </div>
  );
}
