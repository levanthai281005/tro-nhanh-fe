import { BadgeCheck, Clock, UserX } from 'lucide-react';
import type { Occupancy } from '@/features/workspace/types/occupancy';

/**
 * Trạng thái liên kết tài khoản của người ở — BR-029.
 *
 * `null` = chưa gắn tài khoản nào, thêm tay bằng tên + SĐT. Đây là trạng thái **bình thường**
 * chứ không phải lỗi — phần lớn người ở chưa cài app; nên hiển thị nhạt, không cảnh báo.
 *
 * `Rejected` cũng không phải lỗi: người ta có quyền từ chối bị gắn vào phòng, và đó chính là
 * điều BR-029 bảo vệ.
 */
export function OccupantLinkBadge({ linkStatus }: { linkStatus: Occupancy['linkStatus'] }) {
  if (linkStatus === 'Confirmed') {
    return (
      <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-status-available">
        <BadgeCheck aria-hidden="true" className="size-3.5" />
        Đã liên kết
      </span>
    );
  }

  if (linkStatus === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-warning">
        <Clock aria-hidden="true" className="size-3.5" />
        Chờ họ xác nhận
      </span>
    );
  }

  if (linkStatus === 'Rejected') {
    return (
      <span className="inline-flex items-center gap-1 text-[11.5px] text-ink-muted">
        <UserX aria-hidden="true" className="size-3.5" />
        Đã từ chối liên kết
      </span>
    );
  }

  return <span className="text-[11.5px] text-ink-muted">Chưa liên kết tài khoản</span>;
}
