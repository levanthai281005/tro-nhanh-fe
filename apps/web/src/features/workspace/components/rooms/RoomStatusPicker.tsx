'use client';

import { ROOM_STATUS_VALUES, type RoomStatus } from '@tronhanh/schemas';
import { Check } from 'lucide-react';
import { ROOM_STATUS_LABELS } from '@/features/workspace/constants/roomStatus';
import { cn } from '@/utils/cn';

/** Chấm màu khớp badge trạng thái, để form và lưới phòng nói cùng một ngôn ngữ màu. */
const STATUS_DOT_CLASSES: Record<RoomStatus, string> = {
  Available: 'bg-status-available',
  Deposited: 'bg-status-deposited',
  Rented: 'bg-status-rented',
  Hidden: 'bg-ink-muted',
};

/**
 * Chọn trạng thái phòng.
 *
 * Dùng chip thay `<select>`: chỉ có **bốn** giá trị và chúng là thứ chủ trọ nhìn liên tục
 * trên lưới phòng. Dropdown giấu ba lựa chọn sau một cú bấm, và nuốt mất màu — thứ duy nhất
 * giúp nhận ra trạng thái ở màn danh sách.
 */
export function RoomStatusPicker({
  value,
  onChange,
}: {
  value: RoomStatus;
  onChange: (status: RoomStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {ROOM_STATUS_VALUES.map((status) => {
        const isActive = value === status;
        return (
          <button
            key={status}
            aria-checked={isActive}
            className={cn(
              'inline-flex items-center gap-2 rounded-sm border-[1.5px] px-3.5 py-2 text-[13px] transition-colors',
              isActive
                ? 'border-primary bg-cream font-bold text-primary'
                : 'border-sand/55 bg-canvas font-medium text-ink hover:border-sand',
            )}
            onClick={() => onChange(status)}
            role="radio"
            type="button"
          >
            {isActive ? (
              <Check aria-hidden="true" className="size-3.5" />
            ) : (
              <span
                aria-hidden="true"
                className={cn('size-2.5 rounded-full', STATUS_DOT_CLASSES[status])}
              />
            )}
            {ROOM_STATUS_LABELS[status]}
          </button>
        );
      })}
    </div>
  );
}
