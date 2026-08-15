import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export type RoomStatus = 'Available' | 'Deposited' | 'Rented' | 'Hidden';
export type ListingStatus =
  'Draft' | 'PendingApproval' | 'Active' | 'Rejected' | 'Expired' | 'Rented' | 'Hidden';
export type InvoiceStatus = 'Unpaid' | 'PartiallyPaid' | 'Paid' | 'Overdue';
export type ContractStatus = 'Draft' | 'Active' | 'Expired' | 'Terminated';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  (
    | { kind?: 'room'; status: RoomStatus }
    | { kind: 'listing'; status: ListingStatus }
    | { kind: 'invoice'; status: InvoiceStatus }
    | { kind: 'contract'; status: ContractStatus }
  );

interface BadgeMeta {
  label: string;
  className: string;
}

const ROOM_META: Record<RoomStatus, BadgeMeta> = {
  Available: { label: 'Trống', className: 'bg-status-available text-surface' },
  Deposited: { label: 'Đã cọc', className: 'bg-status-deposited text-surface' },
  Rented: { label: 'Đang thuê', className: 'bg-status-rented text-surface' },
  Hidden: { label: 'Đã ẩn', className: 'bg-ink-muted text-surface' },
};

const LISTING_META: Record<ListingStatus, BadgeMeta> = {
  Draft: { label: 'Bản nháp', className: 'bg-status-rented-soft text-ink-muted' },
  PendingApproval: { label: 'Chờ duyệt', className: 'bg-warning-soft text-warning' },
  Active: {
    label: 'Đang hiển thị',
    className: 'bg-status-available-soft text-status-available',
  },
  Rejected: { label: 'Bị từ chối', className: 'bg-error-soft text-error' },
  Expired: { label: 'Hết hạn', className: 'bg-status-rented-soft text-ink-muted' },
  Rented: { label: 'Đã cho thuê', className: 'bg-status-rented-soft text-status-rented' },
  Hidden: { label: 'Đã ẩn', className: 'bg-status-rented-soft text-ink-muted' },
};

const INVOICE_META: Record<InvoiceStatus, BadgeMeta> = {
  Unpaid: { label: 'Chưa thanh toán', className: 'bg-status-rented-soft text-ink-muted' },
  PartiallyPaid: { label: 'Thu một phần', className: 'bg-warning-soft text-warning' },
  Paid: { label: 'Đã thanh toán', className: 'bg-success-soft text-success' },
  Overdue: { label: 'Quá hạn', className: 'bg-error-soft text-error' },
};

const CONTRACT_META: Record<ContractStatus, BadgeMeta> = {
  Draft: { label: 'Bản nháp', className: 'bg-status-rented text-surface' },
  Active: { label: 'Đang hiệu lực', className: 'bg-success text-surface' },
  Expired: { label: 'Hết hạn', className: 'bg-error text-surface' },
  Terminated: { label: 'Đã chấm dứt', className: 'bg-error text-surface' },
};

function getBadgeMeta(props: BadgeProps): BadgeMeta {
  if (props.kind === 'listing') return LISTING_META[props.status];
  if (props.kind === 'invoice') return INVOICE_META[props.status];
  if (props.kind === 'contract') return CONTRACT_META[props.status];
  return ROOM_META[props.status];
}

export function Badge(props: BadgeProps) {
  const meta = getBadgeMeta(props);
  const { kind, status, className, children, ...spanProps } = props;
  void kind;
  void status;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-bold leading-[1.4]',
        meta.className,
        className,
      )}
      {...spanProps}
    >
      {children ?? meta.label}
    </span>
  );
}
