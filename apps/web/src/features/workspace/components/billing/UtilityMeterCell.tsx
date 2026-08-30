'use client';

import type { UtilityType } from '@tronhanh/schemas';
import { Droplets, Lock, Zap } from 'lucide-react';
import { NumberField } from '@/components/ui/NumberField';
import type { UtilityReadingCell } from '@/features/workspace/types/utilityReading';
import { formatPeriod } from '@/features/workspace/utils/period';
import { formatVnd } from '@/utils/formatVnd';

const METER_META: Record<UtilityType, { label: string; unit: string; Icon: typeof Zap }> = {
  Electricity: { label: 'Điện', unit: 'kWh', Icon: Zap },
  Water: { label: 'Nước', unit: 'm³', Icon: Droplets },
};

export interface UtilityMeterCellProps {
  type: UtilityType;
  cell: UtilityReadingCell;
  /** Chuỗi người dùng đang gõ. Rỗng = chưa nhập, **khác** với số 0. */
  value: string;
  onValueChange: (value: string) => void;
}

/**
 * Một ô ghi chỉ số.
 *
 * Số tiền hiện **ngay khi gõ**, không đợi tới lúc xuất hóa đơn: chủ trọ nhận ra mình gõ thừa
 * một chữ số ở chỗ thấy "3.080.000 đ tiền điện", chứ không nhận ra ở chỗ thấy "1440".
 */
export function UtilityMeterCell({ type, cell, value, onValueChange }: UtilityMeterCellProps) {
  const meta = METER_META[type];
  const isLocked = cell.invoicedAt !== null;

  // Ô để trống ≠ số 0. `Number('')` ra `0`, nên kiểm chuỗi rỗng trước khi parse — nếu không,
  // ô chưa nhập sẽ lặng lẽ trở thành "chỉ số 0" và tiêu thụ ra một số âm khổng lồ.
  const typed = value.trim() === '' ? null : Number(value);
  const current = typed ?? cell.currentReading;
  const consumption = current === null ? null : current - cell.previousReading;
  const hasError = consumption !== null && consumption < 0;

  return (
    <div className="flex flex-col gap-1.5 rounded-sm border border-line bg-canvas px-3.5 py-3">
      <span className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[13px] font-bold text-ink">
          <meta.Icon aria-hidden="true" className="size-3.5 text-primary" />
          {meta.label}
        </span>
        <span className="text-xs text-ink-muted">
          Cũ: <strong className="font-bold text-ink">{cell.previousReading}</strong> {meta.unit}
        </span>
      </span>

      {isLocked ? (
        <span className="flex items-center gap-1.5 rounded-sm border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-muted">
          <Lock aria-hidden="true" className="size-3.5 shrink-0" />
          <strong className="font-bold text-ink">{cell.currentReading}</strong> {meta.unit}
        </span>
      ) : (
        <NumberField
          aria-label={`Chỉ số ${meta.label.toLowerCase()} mới`}
          hasError={hasError}
          onValueChange={onValueChange}
          placeholder={`Từ ${cell.previousReading} trở lên`}
          suffix={meta.unit}
          value={value}
        />
      )}

      {hasError ? (
        <span className="text-xs font-semibold text-error" role="alert">
          Chỉ số mới không được nhỏ hơn chỉ số cũ.
        </span>
      ) : isLocked ? (
        <span className="text-xs text-ink-muted">
          Đã lên hóa đơn {formatPeriod(cell.invoicedAt ?? '')} — không sửa được nữa.
        </span>
      ) : consumption === null ? (
        <span className="text-xs text-ink-muted">
          Đơn giá {formatVnd(cell.unitPrice, `/${meta.unit}`)}
        </span>
      ) : (
        <span className="text-xs font-semibold text-primary">
          {consumption} {meta.unit} × {cell.unitPrice.toLocaleString('vi-VN')} ={' '}
          {formatVnd(consumption * cell.unitPrice)}
        </span>
      )}
    </div>
  );
}
