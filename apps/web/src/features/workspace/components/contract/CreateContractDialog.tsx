'use client';

import { contractSchema } from '@tronhanh/schemas';
import { useEffect, useMemo, useState } from 'react';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import { FormField, inputClassName } from '@/components/ui/FormField';
import { FormSection } from '@/components/ui/FormSection';
import { ModalShell } from '@/components/ui/ModalShell';
import { NumberField } from '@/components/ui/NumberField';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import type { ContractRoomOption, CreateContractInput } from '@/features/workspace/types/contract';

interface CreateContractDialogProps {
  rooms: readonly ContractRoomOption[];
  isSaving: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: (input: CreateContractInput) => void;
}

type FieldErrors = Partial<
  Record<'roomId' | 'occupancyId' | 'startDate' | 'endDate' | 'rentPrice', string>
>;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Kỳ hạn một năm, kết thúc vào ngày liền trước — kỳ hạn phổ biến nhất của hợp đồng thuê. */
function oneYearFrom(isoDate: string): string {
  const next = new Date(`${isoDate}T00:00:00.000Z`);
  next.setUTCFullYear(next.getUTCFullYear() + 1);
  next.setUTCDate(next.getUTCDate() - 1);
  return next.toISOString().slice(0, 10);
}

function toDigits(raw: string): number {
  return Number(raw.replace(/\D/g, ''));
}

export function CreateContractDialog({
  rooms,
  isSaving,
  submitError,
  onClose,
  onSubmit,
}: CreateContractDialogProps) {
  const selectableRooms = useMemo(
    () => rooms.filter((room) => !room.hasActiveContract && room.occupants.length > 0),
    [rooms],
  );

  const [roomId, setRoomId] = useState(selectableRooms[0]?.roomId ?? '');
  const [occupancyId, setOccupancyId] = useState('');
  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState(() => oneYearFrom(todayIso()));
  const [rentPrice, setRentPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const selectedRoom = selectableRooms.find((room) => room.roomId === roomId) ?? null;

  // Đổi phòng thì điền lại người đại diện và giá thuê theo phòng mới — giữ nguyên giá của
  // phòng cũ là cách âm thầm ký hợp đồng sai số tiền.
  useEffect(() => {
    if (!selectedRoom) return;
    const representative =
      selectedRoom.occupants.find((item) => item.isContractRepresentative) ??
      selectedRoom.occupants[0];
    setOccupancyId(representative?.occupancyId ?? '');
    setRentPrice(String(selectedRoom.defaultRentPrice));
    setDeposit(String(selectedRoom.defaultRentPrice));
  }, [selectedRoom]);

  const handleSubmit = () => {
    const parsed = contractSchema.safeParse({
      roomId,
      occupancyId,
      startDate,
      endDate,
      rentPrice: toDigits(rentPrice),
      deposit: toDigits(deposit),
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        roomId: flattened.roomId?.[0],
        occupancyId: flattened.occupancyId?.[0],
        startDate: flattened.startDate?.[0],
        endDate: flattened.endDate?.[0],
        rentPrice: flattened.rentPrice?.[0],
      });
      return;
    }

    setFieldErrors({});
    onSubmit(parsed.data);
  };

  if (selectableRooms.length === 0) {
    return (
      <ModalShell
        footer={
          <Button onClick={onClose} variant="primary">
            Đã hiểu
          </Button>
        }
        onClose={onClose}
        title="Chưa lập được hợp đồng"
      >
        <p className="m-0 text-[13.5px] leading-relaxed text-ink-muted">
          Chưa có phòng nào đủ điều kiện. Một phòng chỉ lập được hợp đồng khi{' '}
          <strong className="text-ink">đã có người ở</strong> và{' '}
          <strong className="text-ink">chưa có hợp đồng nào đang hiệu lực</strong> (BR-006). Hãy
          thêm người ở cho phòng trước.
        </p>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      footer={
        <>
          <Button disabled={isSaving} onClick={onClose} variant="ghost">
            Hủy
          </Button>
          <WriteGuardButton
            loading={isSaving}
            onClick={handleSubmit}
            surface="workspace"
            variant="primary"
          >
            Lập hợp đồng
          </WriteGuardButton>
        </>
      }
      onClose={onClose}
      title="Lập hợp đồng mới"
    >
      <div className="flex flex-col gap-6">
        {submitError ? (
          <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
            {submitError}
          </p>
        ) : null}

        <FormSection
          description="Chỉ hiện phòng đã có người ở và chưa có hợp đồng nào đang hiệu lực."
          title="Phòng và người đứng tên"
        >
          <FormField error={fieldErrors.roomId} isRequired label="Phòng">
            <div className="rounded-sm border-[1.5px] border-sand/55 bg-canvas px-3.5 py-2.5">
              <AppSelect
                onChange={setRoomId}
                options={selectableRooms.map((room) => ({
                  value: room.roomId,
                  label: `${room.roomCode} · ${room.propertyName}`,
                }))}
                searchable
                value={roomId}
              />
            </div>
          </FormField>

          <FormField
            error={fieldErrors.occupancyId}
            hint="Hợp đồng gắn một người đại diện; những người còn lại vẫn ở bình thường."
            isRequired
            label="Người đứng tên"
          >
            <div className="rounded-sm border-[1.5px] border-sand/55 bg-canvas px-3.5 py-2.5">
              <AppSelect
                onChange={setOccupancyId}
                options={(selectedRoom?.occupants ?? []).map((occupant) => ({
                  value: occupant.occupancyId,
                  label: `${occupant.fullName} · ${occupant.phoneNumber}`,
                }))}
                value={occupancyId}
              />
            </div>
          </FormField>
        </FormSection>

        <FormSection title="Thời hạn">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <FormField error={fieldErrors.startDate} isRequired label="Ngày bắt đầu">
              <input
                className={inputClassName}
                onChange={(event) => setStartDate(event.target.value)}
                type="date"
                value={startDate}
              />
            </FormField>
            <FormField error={fieldErrors.endDate} isRequired label="Ngày kết thúc">
              <input
                className={inputClassName}
                min={startDate}
                onChange={(event) => setEndDate(event.target.value)}
                type="date"
                value={endDate}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Tiền">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <FormField error={fieldErrors.rentPrice} isRequired label="Tiền thuê">
              <NumberField
                hasError={Boolean(fieldErrors.rentPrice)}
                onValueChange={setRentPrice}
                suffix="đ/tháng"
                value={rentPrice}
                withThousandSeparator
              />
            </FormField>
            <FormField hint="Thường bằng một tháng tiền thuê." label="Tiền cọc">
              <NumberField
                onValueChange={setDeposit}
                suffix="đ"
                value={deposit}
                withThousandSeparator
              />
            </FormField>
          </div>
        </FormSection>

        {/* BR-031 — nói trước hệ quả, vì đổi trạng thái phòng là thứ chủ trọ thấy ở màn khác. */}
        <p className="m-0 rounded-sm border border-line bg-canvas px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-muted">
          Lập hợp đồng sẽ tự chuyển phòng sang <strong className="text-ink">Đang thuê</strong>.
        </p>
      </div>
    </ModalShell>
  );
}
