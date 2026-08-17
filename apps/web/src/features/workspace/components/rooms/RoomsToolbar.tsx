'use client';

import { Plus, Search } from 'lucide-react';
import { AppSelect } from '@/components/ui/AppSelect';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { ROOM_FILTER_CHIPS, ROOM_SORT_OPTIONS } from '@/features/workspace/constants/roomStatus';
import type { RoomFilter, RoomSort, RoomsResult } from '@/features/workspace/types/room';
import { cn } from '@/utils/cn';

interface RoomsToolbarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  filter: RoomFilter;
  onFilterChange: (value: RoomFilter) => void;
  sort: RoomSort;
  onSortChange: (value: RoomSort) => void;
  counts: RoomsResult['counts'];
  onAddRoom: () => void;
  addRoomBlockReason: string | null;
}

export function RoomsToolbar({
  keyword,
  onKeywordChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  counts,
  onAddRoom,
  addRoomBlockReason,
}: RoomsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-surface p-4">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        <label className="relative min-w-[200px] flex-[1_1_200px]">
          <span className="sr-only">Tìm phòng</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-ink-muted"
          />
          <input
            className="w-full rounded-sm border border-line bg-canvas py-2.5 pl-9 pr-3 text-[13.5px] text-ink outline-none transition-colors focus:border-sand"
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Tìm mã phòng, người ở..."
            type="search"
            value={keyword}
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {ROOM_FILTER_CHIPS.map((chip) => {
            const isActive = filter === chip.value;
            return (
              <button
                key={chip.value}
                className={cn(
                  'rounded-full border px-3.5 py-[7px] text-[12.5px] transition-colors',
                  isActive
                    ? 'border-primary bg-primary font-bold text-surface'
                    : 'border-line bg-surface font-medium text-ink hover:border-sand',
                )}
                onClick={() => onFilterChange(chip.value)}
                type="button"
              >
                {chip.label}
                <span className={cn('ml-1.5', isActive ? 'text-surface/80' : 'text-ink-muted')}>
                  {counts[chip.value]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="min-w-[168px] rounded-sm border border-line bg-canvas px-3 py-2">
          <AppSelect
            onChange={(value) => onSortChange(value as RoomSort)}
            options={[...ROOM_SORT_OPTIONS.map((option) => ({ ...option }))]}
            value={sort}
          />
        </div>

        <WriteGuardButton
          disabled={addRoomBlockReason !== null}
          icon={<Plus aria-hidden="true" className="size-4" />}
          onClick={onAddRoom}
          surface="workspace"
          title={addRoomBlockReason ?? undefined}
          variant="primary"
        >
          Thêm phòng
        </WriteGuardButton>
      </div>
    </div>
  );
}
