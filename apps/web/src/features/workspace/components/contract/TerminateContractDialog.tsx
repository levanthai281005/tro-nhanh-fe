'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField, inputClassName } from '@/components/ui/FormField';
import { ModalShell } from '@/components/ui/ModalShell';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import type { ContractListItem } from '@/features/workspace/types/contract';

interface TerminateContractDialogProps {
  contract: ContractListItem;
  isSaving: boolean;
  submitError: string | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function TerminateContractDialog({
  contract,
  isSaving,
  submitError,
  onClose,
  onConfirm,
}: TerminateContractDialogProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    if (reason.trim() === '') {
      setError('Vui lòng ghi lý do chấm dứt');
      return;
    }
    setError(null);
    onConfirm(reason);
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
            variant="danger"
          >
            Chấm dứt hợp đồng
          </WriteGuardButton>
        </>
      }
      onClose={onClose}
      title={`Chấm dứt hợp đồng phòng ${contract.roomCode}`}
    >
      <div className="flex flex-col gap-3.5">
        <p className="m-0 text-[13.5px] leading-relaxed text-ink-muted">
          Hợp đồng của <strong className="text-ink">{contract.occupantName}</strong> sẽ chuyển sang
          trạng thái đã chấm dứt. Hóa đơn và lịch sử thanh toán{' '}
          <strong className="text-ink">giữ nguyên</strong>.
        </p>

        {/* BR-031 — phòng KHÔNG tự về `Available`: chủ trọ có thể đang dọn hoặc sửa. Nói trước
            để họ biết còn một bước nữa, thay vì tưởng phòng đã sẵn sàng đón khách. */}
        <p className="m-0 rounded-sm border border-line bg-canvas px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-muted">
          Phòng <strong className="text-ink">{contract.roomCode}</strong> vẫn giữ trạng thái hiện
          tại. Khi dọn xong, bạn tự chuyển phòng về <strong className="text-ink">Trống</strong> ở
          màn quản lý phòng.
        </p>

        <FormField
          error={error ?? undefined}
          hint="Ghi lại để sau này còn đối chiếu khi có tranh chấp."
          isRequired
          label="Lý do chấm dứt"
        >
          <textarea
            className={inputClassName}
            onChange={(event) => {
              setReason(event.target.value);
              setError(null);
            }}
            placeholder="VD: Người ở chuyển công tác, hai bên thống nhất kết thúc sớm"
            rows={3}
            value={reason}
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
