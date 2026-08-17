'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField, inputClassName } from '@/components/ui/FormField';
import { ModalShell } from '@/components/ui/ModalShell';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import type { Occupancy } from '@/features/workspace/types/occupancy';

interface EndOccupancyDialogProps {
  occupancy: Occupancy;
  isSaving: boolean;
  submitError: string | null;
  onClose: () => void;
  onConfirm: (endDate: string) => void;
}

export function EndOccupancyDialog({
  occupancy,
  isSaving,
  submitError,
  onClose,
  onConfirm,
}: EndOccupancyDialogProps) {
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!endDate) {
      setError('Vui lòng chọn ngày kết thúc');
      return;
    }
    if (endDate < occupancy.startDate) {
      setError('Ngày kết thúc không được trước ngày bắt đầu ở');
      return;
    }
    setError(null);
    onConfirm(endDate);
  };

  return (
    <ModalShell
      footer={
        <>
          <Button disabled={isSaving} onClick={onClose} variant="ghost">
            Hủy
          </Button>
          <WriteGuardButton
            loading={isSaving}
            onClick={handleConfirm}
            surface="workspace"
            variant="primary"
          >
            Kết thúc ở
          </WriteGuardButton>
        </>
      }
      onClose={onClose}
      title={`Kết thúc ở — ${occupancy.fullName}`}
    >
      <div className="flex flex-col gap-3.5">
        {/* Nói rõ dữ liệu không mất: đây là chỗ chủ trọ hay ngần ngại vì sợ xóa nhầm lịch sử. */}
        <p className="m-0 text-[13.5px] leading-relaxed text-ink-muted">
          <strong className="text-ink">{occupancy.fullName}</strong> sẽ chuyển vào lịch sử của
          phòng. Bản ghi <strong className="text-ink">không bị xóa</strong> — hợp đồng, hóa đơn và
          quyền viết đánh giá của họ vẫn giữ nguyên.
        </p>

        <FormField error={error ?? undefined} isRequired label="Ngày kết thúc">
          <input
            className={inputClassName}
            min={occupancy.startDate}
            onChange={(event) => {
              setEndDate(event.target.value);
              setError(null);
            }}
            type="date"
            value={endDate}
          />
        </FormField>

        {occupancy.isContractRepresentative ? (
          <p className="m-0 rounded-sm border border-warning bg-warning-soft px-3.5 py-2.5 text-[13px] font-semibold text-warning">
            Người này đang đứng tên hợp đồng. Sau khi kết thúc, phòng sẽ chưa có ai đại diện — nhớ
            chỉ định người khác.
          </p>
        ) : null}

        {submitError ? (
          <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
            {submitError}
          </p>
        ) : null}
      </div>
    </ModalShell>
  );
}
