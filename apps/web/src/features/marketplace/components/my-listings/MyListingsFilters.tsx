'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import type {
  MyListingFilters,
  MyListingSort,
  MyListingStatusFilter,
} from '@/features/marketplace/types/myListings';
import { cn } from '@/utils/cn';

const ALL_DISTRICTS = 'all';

const STATUS_CHIPS: readonly { label: string; value: MyListingStatusFilter }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang hiển thị', value: 'Active' },
  { label: 'Tin nổi bật', value: 'Boosted' },
  { label: 'Chờ duyệt', value: 'PendingApproval' },
  { label: 'Bị từ chối', value: 'Rejected' },
  { label: 'Hết hạn', value: 'Expired' },
  { label: 'Đã ẩn', value: 'Hidden' },
  { label: 'Bản nháp', value: 'Draft' },
];

const SORT_OPTIONS: readonly { label: string; value: MyListingSort }[] = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Cũ nhất', value: 'oldest' },
  { label: 'Giá thấp đến cao', value: 'price-asc' },
  { label: 'Giá cao đến thấp', value: 'price-desc' },
];

export interface MyListingsFiltersProps {
  filters: MyListingFilters;
  sort: MyListingSort;
  districts: readonly string[];
  advancedCount: number;
  isAdvancedOpen: boolean;
  onFiltersChange: (patch: Partial<MyListingFilters>) => void;
  onSortChange: (sort: MyListingSort) => void;
  onToggleAdvanced: () => void;
  onReset: () => void;
}

export function MyListingsFilters({
  filters,
  sort,
  districts,
  advancedCount,
  isAdvancedOpen,
  onFiltersChange,
  onSortChange,
  onToggleAdvanced,
  onReset,
}: MyListingsFiltersProps) {
  return (
    <div className="flex flex-col gap-3.5 rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-full flex-1 md:min-w-[320px]">
          <Search
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
          />
          <input
            aria-label="Tìm tin đăng của tôi"
            className="w-full rounded-sm border-[1.5px] border-line bg-surface py-2.5 pl-10 pr-10 text-sm text-ink outline-none placeholder:text-ink-muted/70 focus:border-sand"
            data-testid="my-listings-search"
            onChange={(event) => onFiltersChange({ keyword: event.target.value })}
            placeholder="Tìm theo tiêu đề hoặc khu vực..."
            value={filters.keyword}
          />
          {filters.keyword ? (
            <button
              aria-label="Xóa từ khóa"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              onClick={() => onFiltersChange({ keyword: '' })}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>

        <button
          className={cn(
            'relative inline-flex items-center gap-2 rounded-sm border-[1.5px] px-4 py-2.5 text-sm font-bold transition-colors',
            isAdvancedOpen
              ? 'border-primary bg-cream text-primary'
              : 'border-line bg-surface text-ink-muted hover:border-primary',
          )}
          data-testid="my-listings-advanced-toggle"
          onClick={onToggleAdvanced}
          type="button"
        >
          <SlidersHorizontal aria-hidden="true" className="size-3.5" />
          Bộ lọc nâng cao
          {advancedCount > 0 ? (
            <span className="absolute -right-2 -top-2 flex size-[18px] items-center justify-center rounded-full bg-primary text-[10.5px] font-extrabold text-surface">
              {advancedCount}
            </span>
          ) : null}
        </button>

        <div className="min-w-[180px]">
          <AppSelect
            data-testid="my-listings-sort"
            onChange={(value) => onSortChange(value as MyListingSort)}
            options={[...SORT_OPTIONS]}
            value={sort}
          />
        </div>
      </div>

      {isAdvancedOpen ? (
        <div className="flex flex-col gap-3.5 rounded-md border border-line bg-canvas p-4">
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-ink">Khu vực quận/huyện</span>
              <AppSelect
                onChange={(value) => onFiltersChange({ district: value })}
                options={[
                  { label: 'Tất cả quận/huyện', value: ALL_DISTRICTS },
                  ...districts.map((district) => ({ label: district, value: district })),
                ]}
                value={filters.district}
              />
            </label>

            <RangeField
              label="Khoảng giá (đ)"
              maxValue={filters.priceMax}
              minValue={filters.priceMin}
              onMaxChange={(priceMax) => onFiltersChange({ priceMax })}
              onMinChange={(priceMin) => onFiltersChange({ priceMin })}
            />

            <RangeField
              label="Diện tích (m²)"
              maxValue={filters.areaMax}
              minValue={filters.areaMin}
              onMaxChange={(areaMax) => onFiltersChange({ areaMax })}
              onMinChange={(areaMin) => onFiltersChange({ areaMin })}
            />
          </div>

          <div className="flex justify-end gap-2.5 border-t border-line pt-3">
            <Button onClick={onReset} size="sm" variant="outline">
              Xóa bộ lọc
            </Button>
            <Button onClick={onToggleAdvanced} size="sm">
              Áp dụng
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex gap-2 overflow-x-auto border-t border-line pt-3.5">
        {STATUS_CHIPS.map((chip) => {
          const isActive = filters.status === chip.value;
          return (
            <button
              aria-pressed={isActive}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full border-[1.5px] px-3.5 py-1.5 text-xs transition-colors',
                isActive
                  ? 'border-primary bg-primary font-bold text-surface'
                  : 'border-line bg-surface text-ink-muted hover:border-primary',
              )}
              key={chip.value}
              onClick={() => onFiltersChange({ status: chip.value })}
              type="button"
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface RangeFieldProps {
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

function RangeField({ label, minValue, maxValue, onMinChange, onMaxChange }: RangeFieldProps) {
  const inputClassName =
    'w-full rounded-sm border-[1.5px] border-line bg-surface px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-ink-muted/70 focus:border-sand';

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-ink">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          aria-label={`${label} tối thiểu`}
          className={inputClassName}
          inputMode="numeric"
          onChange={(event) => onMinChange(event.target.value)}
          placeholder="Tối thiểu"
          type="number"
          value={minValue}
        />
        <span className="text-xs text-ink-muted">–</span>
        <input
          aria-label={`${label} tối đa`}
          className={inputClassName}
          inputMode="numeric"
          onChange={(event) => onMaxChange(event.target.value)}
          placeholder="Tối đa"
          type="number"
          value={maxValue}
        />
      </div>
    </div>
  );
}

export { ALL_DISTRICTS };
