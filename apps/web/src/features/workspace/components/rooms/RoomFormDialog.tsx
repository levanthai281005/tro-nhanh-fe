'use client';

import { roomSchema, ROOM_STATUS_VALUES, type RoomStatus } from '@tronhanh/schemas';
import { useState } from 'react';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import { FormField, inputClassName } from '@/components/ui/FormField';
import { ModalShell } from '@/components/ui/ModalShell';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { ROOM_STATUS_LABELS } from '@/features/workspace/constants/roomStatus';
import type { RoomWriteInput } from '@/features/workspace/services/roomsService';
import type { RoomFormValues, RoomListItem } from '@/features/workspace/types/room';

interface RoomFormDialogProps {
  propertyId: string;
  propertyName: string;
  /** Có giá trị = sửa; `null` = thêm mới. Một dialog cho cả hai vì hai form trùng ~80%. */
  room: RoomListItem | null;
  isSaving: boolean;
  /**
   * Lỗi trả về từ mutation (trùng mã phòng, mất mạng…).
   *
   * Phải hiển thị **bên trong** dialog: modal phủ kín màn hình, nên banner lỗi đặt ở trang
   * nền nằm sau lớp phủ và người dùng chỉ thấy dialog đứng im không rõ lý do.
   */
  submitError: string | null;
  onClose: () => void;
  onSubmit: (input: RoomWriteInput) => void;
}

const STATUS_OPTIONS = ROOM_STATUS_VALUES.map((value) => ({
  value,
  label: ROOM_STATUS_LABELS[value],
}));

/** Ô số cho phép người dùng gõ "3.200.000" — chỉ giữ chữ số khi đọc ra. */
function toNumber(raw: string): number {
  return Number(raw.replace(/\D/g, ''));
}

/**
 * Phân biệt "" (chưa khai, thừa hưởng giá khu) với "0" (miễn phí). Gộp hai ý này làm một là
 * cách chắc chắn nhất để hóa đơn ra sai số.
 */
function toOptionalNumber(raw: string): number | null {
  const digits = raw.replace(/\D/g, '');
  return digits === '' ? null : Number(digits);
}

function toFormValues(propertyId: string, room: RoomListItem | null): RoomFormValues {
  const hasCustomPricing =
    room !== null &&
    (room.electricityPrice !== null || room.waterPrice !== null || room.servicePrice !== null);

  return {
    propertyId,
    roomCode: room?.roomCode ?? '',
    floor: room ? String(room.floor) : '1',
    area: room ? String(room.area) : '',
    price: room ? String(room.price) : '',
    status: room?.status ?? 'Available',
    note: room?.note ?? '',
    hasCustomPricing,
    electricityPrice: room?.electricityPrice != null ? String(room.electricityPrice) : '',
    waterPrice: room?.waterPrice != null ? String(room.waterPrice) : '',
    servicePrice: room?.servicePrice != null ? String(room.servicePrice) : '',
  };
}

export function RoomFormDialog({
  propertyId,
  propertyName,
  room,
  isSaving,
  submitError,
  onClose,
  onSubmit,
}: RoomFormDialogProps) {
  const [values, setValues] = useState<RoomFormValues>(() => toFormValues(propertyId, room));
  const [validationError, setValidationError] = useState<string | null>(null);

  // Lỗi nhập liệu tại chỗ được ưu tiên: nó nói về thứ người dùng vừa gõ, còn lỗi mutation là
  // của lần gửi trước đó.
  const error = validationError ?? submitError;

  const setField = <TKey extends keyof RoomFormValues>(key: TKey, value: RoomFormValues[TKey]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = () => {
    setValidationError(null);

    const parsed = roomSchema.safeParse({
      propertyId,
      roomCode: values.roomCode,
      floor: toNumber(values.floor),
      area: toNumber(values.area),
      price: toNumber(values.price),
      status: values.status,
      note: values.note,
      electricityPrice: values.hasCustomPricing ? toOptionalNumber(values.electricityPrice) : null,
      waterPrice: values.hasCustomPricing ? toOptionalNumber(values.waterPrice) : null,
      servicePrice: values.hasCustomPricing ? toOptionalNumber(values.servicePrice) : null,
    });

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Dữ liệu chưa hợp lệ.');
      return;
    }

    onSubmit({ ...parsed.data, note: parsed.data.note ?? '' });
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
            onClick={handleSubmit}
            surface="workspace"
            variant="primary"
          >
            {room ? 'Lưu thay đổi' : 'Thêm phòng'}
          </WriteGuardButton>
        </>
      }
      onClose={onClose}
      title={room ? `Sửa phòng ${room.roomCode}` : 'Thêm phòng mới'}
    >
      <div className="flex flex-col gap-3">
        <p className="m-0 text-[13px] text-ink-muted">
          Khu trọ: <strong className="text-ink">{propertyName}</strong>
        </p>

        {error ? (
          <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
            {error}
          </p>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <FormField isRequired label="Mã phòng">
            <input
              className={inputClassName}
              onChange={(event) => setField('roomCode', event.target.value)}
              placeholder="VD: P101"
              value={values.roomCode}
            />
          </FormField>

          <FormField label="Số tầng">
            <input
              className={inputClassName}
              inputMode="numeric"
              onChange={(event) => setField('floor', event.target.value)}
              placeholder="VD: 1"
              value={values.floor}
            />
          </FormField>

          <FormField isRequired label="Diện tích (m²)">
            <input
              className={inputClassName}
              inputMode="numeric"
              onChange={(event) => setField('area', event.target.value)}
              placeholder="VD: 25"
              value={values.area}
            />
          </FormField>

          <FormField isRequired label="Giá thuê (đ/tháng)">
            <input
              className={inputClassName}
              inputMode="numeric"
              onChange={(event) => setField('price', event.target.value)}
              placeholder="VD: 3.200.000"
              value={values.price}
            />
          </FormField>
        </div>

        <FormField label="Trạng thái">
          <div className="rounded-sm border-[1.5px] border-sand/55 bg-canvas px-3.5 py-2.5">
            <AppSelect
              onChange={(value) => setField('status', value as RoomStatus)}
              options={STATUS_OPTIONS}
              value={values.status}
            />
          </div>
        </FormField>

        {/* Đơn giá riêng — mặc định TẮT. Giá điện nước không cố định một mức cho cả khu: chủ
            trọ có thể thu 3.500đ/kWh với hợp đồng cũ và 3.700đ/kWh với phòng ký mới. Nhưng
            phần lớn phòng dùng chung giá khu, nên bắt nhập cho từng phòng sẽ khiến người dùng
            điền số bừa. */}
        <div className="border-t border-line pt-3">
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              checked={values.hasCustomPricing}
              className="mt-[3px] size-4 accent-primary"
              onChange={(event) => setField('hasCustomPricing', event.target.checked)}
              type="checkbox"
            />
            <span>
              <span className="block text-[13.5px] font-bold text-ink">
                Phòng này có đơn giá riêng
              </span>
              <span className="block text-xs leading-snug text-ink-muted">
                Bỏ trống thì phòng dùng đơn giá của khu trọ. Bật khi phòng này ký hợp đồng ở mức giá
                khác các phòng còn lại.
              </span>
            </span>
          </label>

          {values.hasCustomPricing ? (
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <FormField label="Điện (đ/kWh)">
                <input
                  className={inputClassName}
                  inputMode="numeric"
                  onChange={(event) => setField('electricityPrice', event.target.value)}
                  placeholder="Theo khu"
                  value={values.electricityPrice}
                />
              </FormField>
              <FormField label="Nước (đ/m³)">
                <input
                  className={inputClassName}
                  inputMode="numeric"
                  onChange={(event) => setField('waterPrice', event.target.value)}
                  placeholder="Theo khu"
                  value={values.waterPrice}
                />
              </FormField>
              <FormField label="Dịch vụ (đ/tháng)">
                <input
                  className={inputClassName}
                  inputMode="numeric"
                  onChange={(event) => setField('servicePrice', event.target.value)}
                  placeholder="Theo khu"
                  value={values.servicePrice}
                />
              </FormField>
            </div>
          ) : null}
        </div>

        <FormField label="Ghi chú nội bộ">
          <textarea
            className={inputClassName}
            onChange={(event) => setField('note', event.target.value)}
            placeholder="Ghi chú về phòng này"
            rows={3}
            value={values.note}
          />
        </FormField>
      </div>
    </ModalShell>
  );
}
