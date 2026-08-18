'use client';

import {
  ArrowUpCircle,
  Eye,
  EyeOff,
  Pencil,
  RefreshCw,
  Star,
  Trash2,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { MyListingRow } from '@/features/marketplace/types/myListings';
import { cn } from '@/utils/cn';

/**
 * Chip trạng thái phía người bán. Nhãn và màu lấy nguyên từ `Badge kind="listing"` để bám
 * đúng STATUS_ENUMS.md; riêng tin Active còn hạn nổi bật thì thêm dấu sao cho phân biệt.
 */
export function ListingStatusChip({ row }: { row: MyListingRow }) {
  if (row.isBoosted && row.status === 'Active') {
    return (
      <Badge className="gap-1 bg-accent-warn/15 text-accent-warn" kind="listing" status="Active">
        <Star aria-hidden="true" className="size-2.5 fill-accent-warn" strokeWidth={0} />
        Hiển thị (VIP)
      </Badge>
    );
  }

  return <Badge kind="listing" status={row.status} />;
}

/**
 * Lý do từ chối kèm lối sửa lại. Thiếu khối này thì tin `Rejected` là ngõ cụt: người bán
 * thấy nhãn đỏ mà không biết mình sai ở đâu.
 */
export function RejectionNotice({ reason, onEdit }: { reason: string | null; onEdit: () => void }) {
  if (!reason) return null;

  return (
    <div
      className="mt-2 flex items-start gap-2 rounded-sm border border-error bg-cream px-3 py-2"
      data-testid="listing-rejection-notice"
    >
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-error" />
      <div className="min-w-0 flex-1">
        <p className="m-0 text-xs leading-normal text-error">
          <strong>Lý do từ chối:</strong> {reason}
        </p>
        <button
          className="pt-1 text-xs font-bold text-primary hover:underline"
          data-testid="listing-resubmit-btn"
          onClick={onEdit}
          type="button"
        >
          Sửa &amp; gửi lại →
        </button>
      </div>
    </div>
  );
}

interface IconActionProps {
  Icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: 'default' | 'boost' | 'danger';
}

function IconAction({ Icon, label, onClick, disabled, tone = 'default' }: IconActionProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'flex size-8 items-center justify-center rounded-sm border transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        tone === 'boost' && 'border-accent-warn bg-warning-soft text-accent-warn',
        tone === 'danger' && 'border-line bg-surface text-error hover:border-error',
        tone === 'default' && 'border-line bg-surface text-ink-muted hover:border-primary',
      )}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      <Icon aria-hidden="true" className="size-3.5" />
    </button>
  );
}

export interface ListingActionGroupProps {
  row: MyListingRow;
  isBusy: boolean;
  onView: () => void;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onBoost: () => void;
  onRenew: () => void;
  onDelete: () => void;
}

export function ListingActionGroup({
  row,
  isBusy,
  onView,
  onEdit,
  onToggleVisibility,
  onBoost,
  onRenew,
  onDelete,
}: ListingActionGroupProps) {
  const isHidden = row.status === 'Hidden';
  // BR-005: chỉ tin Active mới boost được, và đang nổi bật thì không boost chồng.
  const canBoost = row.status === 'Active' && !row.isBoosted;
  // Chỉ Active/Hidden mới có nghĩa ẩn/hiện; Draft, chờ duyệt, bị từ chối thì không.
  const canToggleVisibility = row.status === 'Active' || isHidden;

  return (
    <div className="flex gap-1.5" data-testid="listing-actions">
      <IconAction Icon={Eye} disabled={isBusy} label="Xem tin" onClick={onView} />
      <IconAction Icon={Pencil} disabled={isBusy} label="Chỉnh sửa" onClick={onEdit} />
      {canToggleVisibility ? (
        <IconAction
          Icon={isHidden ? Eye : EyeOff}
          disabled={isBusy}
          label={isHidden ? 'Hiện tin' : 'Ẩn tin'}
          onClick={onToggleVisibility}
        />
      ) : null}
      {row.canRenew ? (
        <IconAction Icon={RefreshCw} disabled={isBusy} label="Gia hạn tin" onClick={onRenew} />
      ) : null}
      <IconAction
        Icon={ArrowUpCircle}
        disabled={isBusy || !canBoost}
        label="Đẩy tin nổi bật"
        onClick={onBoost}
        tone="boost"
      />
      <IconAction
        Icon={Trash2}
        disabled={isBusy}
        label="Xóa tin"
        onClick={onDelete}
        tone="danger"
      />
    </div>
  );
}
