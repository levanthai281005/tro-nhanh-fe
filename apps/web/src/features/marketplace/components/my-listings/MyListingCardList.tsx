'use client';

import Image from 'next/image';
import {
  ListingActionGroup,
  ListingStatusChip,
  RejectionNotice,
} from '@/features/marketplace/components/my-listings/ListingRowActions';
import type { MyListingsTableProps } from '@/features/marketplace/components/my-listings/MyListingsTable';
import type { MyListingRow } from '@/features/marketplace/types/myListings';

export type MyListingCardListProps = MyListingsTableProps;

function formatVnd(price: number) {
  return `${price.toLocaleString('vi-VN')} đ`;
}

function shortCode(id: string) {
  return `TNH-${id.slice(0, 8).toUpperCase()}`;
}

/** Bản mobile của bảng quản lý tin: cùng dữ liệu và cùng bộ thao tác, khác cách xếp khối. */
export function MyListingCardList({
  rows,
  busyListingId,
  onView,
  onEdit,
  onToggleVisibility,
  onBoost,
  onRenew,
  onDelete,
}: MyListingCardListProps) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row: MyListingRow) => (
        <article
          className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4"
          data-listing-id={row.id}
          data-listing-status={row.status}
          data-testid="my-listing-card"
          key={row.id}
        >
          <div className="flex gap-3">
            <span className="relative size-[68px] shrink-0 overflow-hidden rounded-md border border-line">
              <Image alt="" className="object-cover" fill sizes="68px" src={row.imageUrl} />
            </span>
            <div className="flex min-w-0 flex-col justify-between">
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink">{row.title}</h3>
              <span className="text-[11px] text-ink-muted">{shortCode(row.id)}</span>
            </div>
          </div>

          <dl className="flex flex-col gap-1.5 border-t border-line pt-2.5 text-xs">
            <div className="flex items-center justify-between">
              <dt className="text-ink-muted">Giá hiển thị</dt>
              <dd className="font-extrabold text-primary">{formatVnd(row.price)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-muted">Khu vực</dt>
              <dd className="font-semibold text-ink">{row.district}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-muted">Trạng thái</dt>
              <dd>
                <ListingStatusChip row={row} />
              </dd>
            </div>
          </dl>

          <RejectionNotice onEdit={() => onEdit(row)} reason={row.rejectReason} />

          <div className="flex justify-end border-t border-line pt-2.5">
            <ListingActionGroup
              isBusy={busyListingId === row.id}
              onBoost={() => onBoost(row)}
              onDelete={() => onDelete(row)}
              onEdit={() => onEdit(row)}
              onRenew={() => onRenew(row)}
              onToggleVisibility={() => onToggleVisibility(row)}
              onView={() => onView(row)}
              row={row}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
