'use client';

import Image from 'next/image';
import { Fragment } from 'react';
import {
  ListingActionGroup,
  ListingStatusChip,
  RejectionNotice,
} from '@/features/marketplace/components/my-listings/ListingRowActions';
import type { MyListingRow } from '@/features/marketplace/types/myListings';
import { cn } from '@/utils/cn';

const COLUMNS = ['Tin đăng', 'Khu vực', 'Giá hiển thị', 'Trạng thái tin', 'Cập nhật', 'Thao tác'];

export interface MyListingsTableProps {
  rows: readonly MyListingRow[];
  busyListingId: string | null;
  onView: (row: MyListingRow) => void;
  onEdit: (row: MyListingRow) => void;
  onToggleVisibility: (row: MyListingRow) => void;
  onBoost: (row: MyListingRow) => void;
  onRenew: (row: MyListingRow) => void;
  onDelete: (row: MyListingRow) => void;
}

function formatVnd(price: number) {
  return `${price.toLocaleString('vi-VN')} đ`;
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  return {
    day: date.toLocaleDateString('vi-VN'),
    time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  };
}

/** Mã ngắn cho người bán đọc/đối chiếu nhanh, không thay thế `id` thật. */
function shortCode(id: string) {
  return `TNH-${id.slice(0, 8).toUpperCase()}`;
}

export function MyListingsTable({
  rows,
  busyListingId,
  onView,
  onEdit,
  onToggleVisibility,
  onBoost,
  onRenew,
  onDelete,
}: MyListingsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse">
          <thead>
            <tr className="border-b-[1.5px] border-line bg-cream/40">
              {COLUMNS.map((column) => (
                <th
                  className="whitespace-nowrap px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.06em] text-ink-muted"
                  key={column}
                  scope="col"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const updated = formatUpdatedAt(row.updatedAt);
              const isBusy = busyListingId === row.id;

              return (
                <Fragment key={row.id}>
                  <tr
                    className={cn(
                      'hover:bg-cream/20',
                      row.rejectReason ? '' : 'border-b border-line last:border-b-0',
                    )}
                    data-listing-id={row.id}
                    data-listing-status={row.status}
                    data-testid="my-listing-row"
                  >
                    <td className="max-w-[320px] px-4 py-3.5 align-middle">
                      <div className="flex items-center gap-3">
                        <span className="relative size-[54px] shrink-0 overflow-hidden rounded-md border border-line">
                          <Image
                            alt=""
                            className="object-cover"
                            fill
                            sizes="54px"
                            src={row.imageUrl}
                          />
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span
                            className="truncate text-[13.5px] font-extrabold text-ink"
                            title={row.title}
                          >
                            {row.title}
                          </span>
                          <span className="text-[11px] font-semibold text-ink-muted">
                            {shortCode(row.id)}
                          </span>
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 align-middle text-[13.5px] font-semibold text-ink-muted">
                      {row.district}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 align-middle text-sm font-extrabold text-primary">
                      {formatVnd(row.price)}
                    </td>

                    <td className="px-4 py-3.5 align-middle">
                      <ListingStatusChip row={row} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 align-middle text-xs text-ink-muted">
                      <span className="block font-semibold">{updated.day}</span>
                      <span className="block text-[10.5px]">{updated.time}</span>
                    </td>

                    <td className="px-4 py-3.5 align-middle">
                      <ListingActionGroup
                        isBusy={isBusy}
                        onBoost={() => onBoost(row)}
                        onDelete={() => onDelete(row)}
                        onEdit={() => onEdit(row)}
                        onRenew={() => onRenew(row)}
                        onToggleVisibility={() => onToggleVisibility(row)}
                        onView={() => onView(row)}
                        row={row}
                      />
                    </td>
                  </tr>

                  {/* Lý do từ chối trải hết chiều rộng bảng: nhét vào ô trạng thái (~130px) thì
                    mỗi từ rơi một dòng, đẩy chiều cao hàng lên gấp năm lần hàng thường. */}
                  {row.rejectReason ? (
                    <tr className="border-b border-line last:border-b-0">
                      <td className="px-4 pb-3.5 pt-0" colSpan={COLUMNS.length}>
                        <RejectionNotice onEdit={() => onEdit(row)} reason={row.rejectReason} />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
