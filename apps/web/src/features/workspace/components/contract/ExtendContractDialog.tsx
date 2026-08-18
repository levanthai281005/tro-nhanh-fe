'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField, inputClassName } from '@/components/ui/FormField';
import { ModalShell } from '@/components/ui/ModalShell';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import type { ContractListItem } from '@/features/workspace/types/contract';
import { formatVnDate } from '@/utils/formatVnDate';

interface ExtendContractDialogProps {
  contract: ContractListItem;
  isSaving: boolean;
  submitError: string | null;
  onClose: () => void;
  onConfirm: (newEndDate: string) => void;
}

/** Cộng thêm một năm kể từ ngày kết thúc hiện tại — kỳ hạn phổ biến nhất. */
function defaultNewEndDate(currentEndDate: string): string {
  const next = new Date(`${currentEndDate}T00:00:00.000Z`);
  next.setUTCFullYear(next.getUTCFullYear() + 1);
  return next.toISOString().slice(0, 10);
}

export function ExtendContractDialog({
  contract,
  isSaving,
  submitError,
  onClose,
  onConfirm,
}: ExtendContractDialogProps) {
  const [newEndDate, setNewEndDate] = useState(() => defaultNewEndDate(contract.endDate));
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    if (newEndDate <= contract.endDate) {
      setError('Ngày kết thúc mới phải sau ngày kết thúc hiện tại');
      return;
    }
    setError(null);
    onConfirm(newEndDate);
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
            Gia hạn
          </WriteGuardButton>
        </>
      }
      onClose={onClose}
      title={`Gia hạn hợp đồng phòng ${contract.roomCode}`}
    >
      <div className="flex flex-col gap-3.5">
        <p className="m-0 text-[13.5px] leading-relaxed text-ink-muted">
          Hợp đồng của <strong className="text-ink">{contract.occupantName}</strong> đang có hạn tới{' '}
          <strong className="text-ink">{formatVnDate(contract.endDate)}</strong>. Gia hạn chỉ dời
          ngày kết thúc — người đại diện, tiền thuê và hóa đơn cũ giữ nguyên.
        </p>

        <FormField error={error ?? undefined} isRequired label="Ngày kết thúc mới">
          <input
            className={inputClassName}
            min={contract.endDate}
            onChange={(event) => {
              setNewEndDate(event.target.value);
              setError(null);
            }}
            type="date"
            value={newEndDate}
          />
        </FormField>

        {submitError ? (
          <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
            {submitError}
          </p>
        ) : null}
      </div>
    </ModalShell>
  );
}
