import { ArrowUpDown, LayoutGrid, List, Map, SlidersHorizontal } from 'lucide-react';
import { AppSelect, type SelectOption } from '@/components/ui/AppSelect';
import type { ListingSort } from '@/features/marketplace/types/listings';
import { cn } from '@/utils/cn';

const SORT_OPTIONS: readonly SelectOption[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp đến cao' },
  { value: 'price-desc', label: 'Giá cao đến thấp' },
  { value: 'area-desc', label: 'Diện tích lớn nhất' },
];

export type ListingViewMode = 'grid' | 'list' | 'map';

export interface ListingToolbarProps {
  total: number;
  sort: ListingSort;
  viewMode: ListingViewMode;
  onSortChange: (sort: ListingSort) => void;
  onViewModeChange: (viewMode: ListingViewMode) => void;
}

export function ListingToolbar({
  total,
  sort,
  viewMode,
  onSortChange,
  onViewModeChange,
}: ListingToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink-muted">
        {total > 0 ? (
          <>
            Tìm thấy <strong className="text-ink">{total.toLocaleString('vi-VN')}</strong> phòng
          </>
        ) : (
          'Chưa có phòng nào phù hợp'
        )}
      </p>
      <div className="flex items-center gap-2.5">
        <div className="w-[172px] rounded-sm border border-line bg-surface px-3 py-2">
          <AppSelect
            onChange={(value) => onSortChange(value as ListingSort)}
            options={[...SORT_OPTIONS]}
            value={sort}
          />
        </div>
        <div className="flex overflow-hidden rounded-sm border border-line bg-surface">
          <ViewButton
            active={viewMode === 'grid'}
            Icon={LayoutGrid}
            label="Lưới"
            onClick={() => onViewModeChange('grid')}
          />
          <ViewButton
            active={viewMode === 'list'}
            Icon={List}
            label="Danh sách"
            onClick={() => onViewModeChange('list')}
          />
        </div>
        <button
          className={cn(
            'inline-flex items-center gap-1.5 rounded-sm border px-3 py-2 text-[13px] font-semibold transition-colors',
            viewMode === 'map'
              ? 'border-primary bg-primary text-surface'
              : 'border-line bg-surface text-ink-muted hover:border-sand hover:bg-cream',
          )}
          onClick={() => onViewModeChange(viewMode === 'map' ? 'grid' : 'map')}
          type="button"
        >
          <Map aria-hidden="true" className="size-3.5" />
          Bản đồ
        </button>
      </div>
    </div>
  );
}

export interface MobileListingToolbarProps {
  total: number;
  isMapActive: boolean;
  onFilter: () => void;
  onSort: () => void;
  onMap: () => void;
}

export function MobileListingToolbar({
  total,
  isMapActive,
  onFilter,
  onSort,
  onMap,
}: MobileListingToolbarProps) {
  return (
    <div className="flex items-center gap-2 border-y border-line bg-surface px-4 py-2.5">
      <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink">
        {total.toLocaleString('vi-VN')} phòng
      </span>
      <ToolbarButton Icon={SlidersHorizontal} label="Lọc" onClick={onFilter} primary />
      <ToolbarButton Icon={ArrowUpDown} label="Sắp xếp" onClick={onSort} />
      <ToolbarButton Icon={Map} label="Bản đồ" onClick={onMap} active={isMapActive} compact />
    </div>
  );
}

function ViewButton({
  active,
  Icon,
  label,
  onClick,
}: {
  active: boolean;
  Icon: typeof LayoutGrid;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold transition-colors',
        active ? 'bg-primary text-surface' : 'text-ink-muted hover:bg-cream',
      )}
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {label}
    </button>
  );
}

function ToolbarButton({
  active = false,
  compact = false,
  Icon,
  label,
  onClick,
  primary = false,
}: {
  active?: boolean;
  compact?: boolean;
  Icon: typeof LayoutGrid;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active || undefined}
      className={cn(
        'inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-sm border px-3 text-[13px] font-semibold transition-colors',
        primary
          ? 'border-primary text-primary hover:bg-sand-soft'
          : active
            ? 'border-primary bg-primary text-surface'
            : 'border-line text-ink-muted hover:bg-cream',
        compact && 'px-2.5',
      )}
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {compact ? <span className="sr-only">{label}</span> : label}
    </button>
  );
}
