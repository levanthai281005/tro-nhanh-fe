'use client';

import { Megaphone, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { RoomListItem } from '@/features/workspace/types/room';
import { getPrimaryOccupant } from '@/features/workspace/utils/roomOccupants';
import { formatVnd } from '@/utils/formatVnd';

/**
 * Thẻ phòng trong lưới B8.
 *
 * Không có nút "Điện nước" / "Hóa đơn" như bản prototype: hai màn đó thuộc B12 và chưa dựng.
 * Nút dẫn tới màn chưa có là nút chết, và repo này đã có tiền lệ bỏ hẳn thay vì để lại
 * (bộ lọc "Trạng thái" ở màn tìm phòng).
 */
export function RoomCard({
  room,
  onSelect,
}: {
  room: RoomListItem;
  onSelect: (room: RoomListItem) => void;
}) {
  const primaryOccupant = getPrimaryOccupant(room);

  return (
    <button
      className="flex flex-col gap-3 rounded-md border-[1.5px] border-line bg-surface p-[18px] text-left shadow-sm transition-colors hover:border-sand"
      onClick={() => onSelect(room)}
      type="button"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-lg font-extrabold text-ink">Phòng {room.roomCode}</span>
        <Badge kind="room" status={room.status} />
      </div>

      <div className="flex flex-col gap-1 text-[13px] text-ink-muted">
        <span>
          Tầng <strong className="text-ink">{room.floor}</strong> · Diện tích{' '}
          <strong className="text-ink">{room.area} m²</strong>
        </span>
        <span>
          Giá thuê <strong className="text-sm text-primary">{formatVnd(room.price)}</strong>
        </span>
        {primaryOccupant ? (
          <span className="mt-0.5 flex items-center gap-1.5 font-semibold text-ink">
            <Users aria-hidden="true" className="size-[13px] shrink-0 text-primary" />
            <span className="truncate">{primaryOccupant.fullName}</span>
            {/* Số người còn lại, không phải "occupantCount" của một bản ghi: mỗi người ở là
                một Occupancy riêng (Module 7). */}
            {room.occupants.length > 1 ? (
              <span className="shrink-0 font-medium text-ink-muted">
                +{room.occupants.length - 1} người
              </span>
            ) : null}
          </span>
        ) : null}
      </div>

      {/* BR-027 — phòng đang có tin chạy thì không tạo tin thứ hai từ chính nó. */}
      {room.hasActiveListing ? (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-status-available-soft px-2.5 py-1 text-[11.5px] font-bold text-status-available">
          <Megaphone aria-hidden="true" className="size-3" />
          Có tin đang chạy
        </span>
      ) : null}
    </button>
  );
}
