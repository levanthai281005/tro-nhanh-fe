'use client';

import { AlertTriangle, CalendarClock, Ban, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import {
  CONTRACT_EXPIRY_WARNING_DAYS,
  type ContractListItem,
} from '@/features/workspace/types/contract';
import { formatVnd } from '@/utils/formatVnd';
import { formatVnDate } from '@/utils/formatVnDate';

interface ContractCardProps {
  contract: ContractListItem;
  isBusy: boolean;
  onExtend: (contract: ContractListItem) => void;
  onTerminate: (contract: ContractListItem) => void;
}

export function ContractCard({ contract, isBusy, onExtend, onTerminate }: ContractCardProps) {
  const isActive = contract.status === 'Active';
  // BR-006 — job backend chuyển `Expired`, nhưng chủ trọ cần thấy trước để còn thương lượng
  // gia hạn. Ba mươi ngày là khoảng đủ để hai bên nói chuyện mà chưa gấp.
  const isExpiringSoon =
    isActive &&
    contract.daysRemaining >= 0 &&
    contract.daysRemaining <= CONTRACT_EXPIRY_WARNING_DAYS;
  const isOverdue = isActive && contract.daysRemaining < 0;

  return (
    <li className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="m-0 text-[15px] font-bold text-ink">
            Phòng {contract.roomCode} · {contract.occupantName}
          </p>
          <p className="m-0 mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-muted">
            <Building2 aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate">{contract.propertyName}</span>
          </p>
        </div>
        <Badge kind="contract" status={contract.status} />
      </div>

      <dl className="grid grid-cols-2 gap-3 border-t border-line pt-3 text-[13px] sm:grid-cols-4">
        <div>
          <dt className="text-xs text-ink-muted">Bắt đầu</dt>
          <dd className="mt-0.5 font-semibold text-ink">{formatVnDate(contract.startDate)}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Kết thúc</dt>
          <dd className="mt-0.5 font-semibold text-ink">{formatVnDate(contract.endDate)}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Tiền thuê</dt>
          <dd className="mt-0.5 font-semibold text-primary">{formatVnd(contract.rentPrice)}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-muted">Tiền cọc</dt>
          <dd className="mt-0.5 font-semibold text-ink">{formatVnd(contract.deposit)}</dd>
        </div>
      </dl>

      {isOverdue ? (
        <p className="m-0 flex items-start gap-2 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
          <AlertTriangle aria-hidden="true" className="mt-px size-4 shrink-0" />
          Đã quá ngày kết thúc {Math.abs(contract.daysRemaining)} ngày mà chưa gia hạn hay chấm dứt.
        </p>
      ) : isExpiringSoon ? (
        <p className="m-0 flex items-start gap-2 rounded-sm border border-warning bg-warning-soft px-3.5 py-2.5 text-[13px] font-semibold text-warning">
          <CalendarClock aria-hidden="true" className="mt-px size-4 shrink-0" />
          Còn {contract.daysRemaining} ngày là hết hạn.
        </p>
      ) : null}

      {contract.terminateReason ? (
        <p className="m-0 flex items-start gap-2 text-[13px] leading-relaxed text-ink-muted">
          <Ban aria-hidden="true" className="mt-px size-3.5 shrink-0" />
          {contract.terminateReason}
        </p>
      ) : null}

      {isActive ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <WriteGuardButton
            disabled={isBusy}
            onClick={() => onExtend(contract)}
            size="sm"
            surface="workspace"
            variant="outline"
          >
            Gia hạn
          </WriteGuardButton>
          <WriteGuardButton
            className="ml-auto"
            disabled={isBusy}
            onClick={() => onTerminate(contract)}
            size="sm"
            surface="workspace"
            variant="ghost"
          >
            Chấm dứt sớm
          </WriteGuardButton>
        </div>
      ) : null}
    </li>
  );
}
