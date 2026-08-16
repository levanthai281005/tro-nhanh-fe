import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '@/components/ui/Badge';
import { PROPERTY_TYPE_OPTIONS } from '@/features/marketplace/constants/catalog';
import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';
import { isFutureDate } from '@/features/marketplace/utils/listingOrdering';

export interface TitleBlockProps {
  detail: ListingDetailData;
}

function formatVnd(amount: number) {
  return `${amount.toLocaleString('vi-VN')} đ/tháng`;
}

function formatDateLabel(value: string) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return 'Chưa cập nhật';

  return formatDistanceToNow(timestamp, { addSuffix: true, locale: vi });
}

export function TitleBlock({ detail }: TitleBlockProps) {
  const { listing } = detail.record;
  const propertyType =
    PROPERTY_TYPE_OPTIONS.find((option) => option.value === listing.propertyType)?.label ??
    listing.propertyType;
  const isBoosted = isFutureDate(listing.boostExpireAt, Date.now());

  return (
    <header className="mb-7 border-b border-line pb-6">
      <nav
        aria-label="Điều hướng đường dẫn"
        className="mb-3 flex flex-wrap items-center gap-1.5 text-xs"
      >
        <Link className="text-ink-muted transition-colors hover:text-primary" href="/tim-phong">
          Tìm phòng
        </Link>
        <span aria-hidden="true" className="text-line">
          /
        </span>
        <span className="text-ink-muted">{listing.district}</span>
        <span aria-hidden="true" className="text-line">
          /
        </span>
        <span aria-current="page" className="font-semibold text-ink">
          Chi tiết phòng
        </span>
      </nav>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
        <div>
          <p className="mb-1 text-sm font-semibold text-primary">{propertyType}</p>
          <h1 className="text-2xl font-extrabold leading-tight tracking-[-0.01em] text-ink md:text-[26px]">
            {listing.title}
          </h1>
        </div>
        <p className="shrink-0 text-xl font-extrabold text-primary md:text-2xl">
          {formatVnd(listing.price)}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1 text-sm text-ink-muted">
          <MapPin aria-hidden="true" className="size-4 text-sand" />
          {listing.address}, {listing.district}
        </span>
        <Badge kind="listing" status={listing.status} />
        {isBoosted ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-[3px] text-[11px] font-bold text-surface">
            <Star aria-hidden="true" className="size-3 fill-surface" strokeWidth={0} />
            Tin nổi bật
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        Đăng {formatDateLabel(listing.createdAt)} · Cập nhật {formatDateLabel(listing.updatedAt)}
      </p>
    </header>
  );
}
