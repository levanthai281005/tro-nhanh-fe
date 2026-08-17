'use client';

import { FileSignature, LogOut, Send, Star } from 'lucide-react';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { OccupantLinkBadge } from '@/features/workspace/components/occupancy/OccupantLinkBadge';
import type { Occupancy } from '@/features/workspace/types/occupancy';
import { isEndingSoon } from '@/features/workspace/types/occupancy';
import { formatVnDate } from '@/utils/formatVnDate';

interface OccupancyCardProps {
  occupancy: Occupancy;
  /** Lịch sử thì chỉ hiển thị, không có thao tác nào. */
  isPast?: boolean;
  isBusy: boolean;
  onEnd: (occupancy: Occupancy) => void;
  onMakeRepresentative: (occupancy: Occupancy) => void;
  onInviteLink: (occupancy: Occupancy) => void;
}

export function OccupancyCard({
  occupancy,
  isPast = false,
  isBusy,
  onEnd,
  onMakeRepresentative,
  onInviteLink,
}: OccupancyCardProps) {
  // Gửi lời mời chỉ có nghĩa khi chưa liên kết hoặc họ đã từ chối. `Pending` thì đang chờ họ,
  // gửi thêm chỉ làm phiền; `Confirmed` thì xong rồi.
  const canInvite =
    !isPast && (occupancy.linkStatus === null || occupancy.linkStatus === 'Rejected');

  return (
    <li className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="m-0 flex flex-wrap items-center gap-2 text-[15px] font-bold text-ink">
            {occupancy.fullName}
            {occupancy.isContractRepresentative ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold text-primary">
                <FileSignature aria-hidden="true" className="size-3" />
                Đại diện hợp đồng
              </span>
            ) : null}
          </p>
          <p className="m-0 mt-0.5 text-[13px] text-ink-muted">
            {occupancy.phoneNumber}
            {occupancy.occupantCount > 1 ? <> · {occupancy.occupantCount} người</> : null}
          </p>
        </div>

        <OccupantLinkBadge linkStatus={occupancy.linkStatus} />
      </div>

      <dl className="grid grid-cols-2 gap-3 border-t border-line pt-3 text-[13px]">
        <div>
          <dt className="text-xs text-ink-muted">Bắt đầu ở</dt>
          <dd className="mt-0.5 font-semibold text-ink">{formatVnDate(occupancy.startDate)}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Kết thúc</dt>
          <dd className="mt-0.5 font-semibold text-ink">
            {occupancy.endDate === null ? (
              'Đang ở'
            ) : isEndingSoon(occupancy) ? (
              <span className="text-warning">Sắp rời {formatVnDate(occupancy.endDate)}</span>
            ) : (
              formatVnDate(occupancy.endDate)
            )}
          </dd>
        </div>
      </dl>

      {occupancy.note ? (
        <p className="m-0 whitespace-pre-line text-[13px] leading-relaxed text-ink-muted">
          {occupancy.note}
        </p>
      ) : null}

      {isPast ? null : (
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
          {!occupancy.isContractRepresentative ? (
            <WriteGuardButton
              disabled={isBusy}
              icon={<Star aria-hidden="true" className="size-3.5" />}
              onClick={() => onMakeRepresentative(occupancy)}
              size="sm"
              surface="workspace"
              variant="outline"
            >
              Đặt làm đại diện
            </WriteGuardButton>
          ) : null}

          {canInvite ? (
            <WriteGuardButton
              disabled={isBusy}
              icon={<Send aria-hidden="true" className="size-3.5" />}
              onClick={() => onInviteLink(occupancy)}
              size="sm"
              surface="workspace"
              variant="ghost"
            >
              Gửi lời mời liên kết
            </WriteGuardButton>
          ) : null}

          <WriteGuardButton
            className="ml-auto"
            disabled={isBusy}
            icon={<LogOut aria-hidden="true" className="size-3.5" />}
            onClick={() => onEnd(occupancy)}
            size="sm"
            surface="workspace"
            variant="ghost"
          >
            Kết thúc ở
          </WriteGuardButton>
        </div>
      )}
    </li>
  );
}
