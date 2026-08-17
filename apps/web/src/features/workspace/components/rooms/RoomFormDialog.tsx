'use client';

import { roomSchema, type RoomStatus } from '@tronhanh/schemas';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField, inputClassName } from '@/components/ui/FormField';
import { ModalShell } from '@/components/ui/ModalShell';
import { NumberField } from '@/components/ui/NumberField';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { RoomStatusPicker } from '@/features/workspace/components/rooms/RoomStatusPicker';
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

/** Lỗi theo từng ô — đặt ngay dưới ô sai thay vì dồn lên một banner ở đầu form. */
type FieldErrors = Partial<Record<'roomCode' | 'floor' | 'area' | 'price', string>>;

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const setField = <TKey extends keyof RoomFormValues>(key: TKey, value: RoomFormValues[TKey]) => {
    setValues((current) => ({ ...current, [key]: value }));
    // Xóa lỗi của đúng ô vừa sửa: giữ lại thì người dùng sửa xong vẫn thấy chữ đỏ và tưởng
    // mình chưa sửa đúng.
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = () => {
    /*
     * Ô để trống ≠ số 0, và schema thực thể không phân biệt được hai thứ đó.
     *
     * `roomPriceSchema` cố ý cho `price ≥ 0` vì phòng cho người nhà ở nhờ là dữ liệu hợp lệ.
     * Nhưng `Number('')` ra `0`, nên bỏ trống ô giá sẽ **lặng lẽ** lưu phòng giá 0 đ/tháng —
     * đúng thứ chảy thẳng xuống hóa đơn. Ràng buộc "phải khai" thuộc về form, không thuộc về
     * thực thể, nên kiểm ở đây.
     */
    const blankFieldErrors: FieldErrors = {};
    if (values.area.trim() === '') blankFieldErrors.area = 'Vui lòng nhập diện tích';
    if (values.price.trim() === '') blankFieldErrors.price = 'Vui lòng nhập giá thuê';

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

    const schemaFieldErrors: FieldErrors = parsed.success
      ? {}
      : (() => {
          const flattened = parsed.error.flatten().fieldErrors;
          return {
            roomCode: flattened.roomCode?.[0],
            floor: flattened.floor?.[0],
            area: flattened.area?.[0],
            price: flattened.price?.[0],
          };
        })();

    // Gộp cả hai nguồn rồi mới hiện, thay vì chặn sớm ở nhóm đầu: hiện lần lượt thì người
    // dùng sửa một lỗi, bấm lại, lại gặp lỗi mới — mỗi vòng một lần bấm.
    const merged: FieldErrors = { ...schemaFieldErrors, ...blankFieldErrors };
    if (Object.values(merged).some(Boolean)) {
      setFieldErrors(merged);
      return;
    }

    if (!parsed.success) return;

    setFieldErrors({});
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
      <div className="flex flex-col gap-6">
        {submitError ? (
          <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
            {submitError}
          </p>
        ) : null}

        <FormSection
          description={`Phòng sẽ được thêm vào khu ${propertyName}.`}
          title="Thông tin phòng"
        >
          <div className="grid gap-3.5 sm:grid-cols-[1.4fr_1fr]">
            <FormField error={fieldErrors.roomCode} isRequired label="Mã phòng">
              <input
                autoFocus
                className={inputClassName}
                onChange={(event) => setField('roomCode', event.target.value)}
                placeholder="VD: P101"
                value={values.roomCode}
              />
            </FormField>

            <FormField error={fieldErrors.floor} label="Tầng">
              <NumberField
                hasError={Boolean(fieldErrors.floor)}
                onValueChange={(value) => setField('floor', value)}
                placeholder="1"
                value={values.floor}
              />
            </FormField>

            <FormField error={fieldErrors.area} isRequired label="Diện tích">
              <NumberField
                hasError={Boolean(fieldErrors.area)}
                onValueChange={(value) => setField('area', value)}
                placeholder="25"
                suffix="m²"
                value={values.area}
              />
            </FormField>

            <FormField error={fieldErrors.price} isRequired label="Giá thuê">
              <NumberField
                hasError={Boolean(fieldErrors.price)}
                onValueChange={(value) => setField('price', value)}
                placeholder="3.200.000"
                suffix="đ/tháng"
                value={values.price}
                withThousandSeparator
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Trạng thái">
          <RoomStatusPicker
            onChange={(status: RoomStatus) => setField('status', status)}
            value={values.status}
          />
        </FormSection>

        {/* Đơn giá riêng — mặc định TẮT. Giá điện nước không cố định một mức cho cả khu: chủ
            trọ có thể thu 3.500đ/kWh với hợp đồng cũ và 3.700đ/kWh với phòng ký mới. Nhưng
            phần lớn phòng dùng chung giá khu, nên bắt nhập cho từng phòng sẽ khiến người dùng
            điền số bừa. */}
        <FormSection title="Đơn giá & ghi chú">
          <label className="flex cursor-pointer items-start gap-2.5 rounded-sm border border-line bg-canvas px-3.5 py-3">
            <input
              checked={values.hasCustomPricing}
              className="mt-[3px] size-4 shrink-0 accent-primary"
              onChange={(event) => setField('hasCustomPricing', event.target.checked)}
              type="checkbox"
            />
            <span>
              <span className="block text-[13.5px] font-bold text-ink">
                Phòng này có đơn giá riêng
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-ink-muted">
                Để tắt thì phòng dùng đơn giá của khu trọ. Bật khi phòng này ký hợp đồng ở mức giá
                khác các phòng còn lại.
              </span>
            </span>
          </label>

          {values.hasCustomPricing ? (
            <div className="grid gap-3.5 sm:grid-cols-3">
              <FormField label="Tiền điện">
                <NumberField
                  onValueChange={(value) => setField('electricityPrice', value)}
                  placeholder="Theo khu"
                  suffix="đ/kWh"
                  value={values.electricityPrice}
                  withThousandSeparator
                />
              </FormField>
              <FormField label="Tiền nước">
                <NumberField
                  onValueChange={(value) => setField('waterPrice', value)}
                  placeholder="Theo khu"
                  suffix="đ/m³"
                  value={values.waterPrice}
                  withThousandSeparator
                />
              </FormField>
              <FormField label="Phí dịch vụ">
                <NumberField
                  onValueChange={(value) => setField('servicePrice', value)}
                  placeholder="Theo khu"
                  suffix="đ/tháng"
                  value={values.servicePrice}
                  withThousandSeparator
                />
              </FormField>
            </div>
          ) : null}

          <FormField
            hint="Chỉ mình bạn thấy — người thuê không đọc được ghi chú này."
            label="Ghi chú nội bộ"
          >
            <textarea
              className={inputClassName}
              onChange={(event) => setField('note', event.target.value)}
              placeholder="VD: Vừa sơn lại, đón khách được ngay"
              rows={2}
              value={values.note}
            />
          </FormField>
        </FormSection>
      </div>
    </ModalShell>
  );
}

/**
 * Một nhóm trường có tiêu đề.
 *
 * Bản trước là một cột phẳng mười ô nhập liền nhau, không có chỗ nào cho mắt nghỉ nên người
 * dùng phải đọc từng nhãn mới biết form dài tới đâu. Chia nhóm cho thấy ngay hình dạng của
 * việc phải làm.
 */
function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="m-0 text-xs font-bold uppercase tracking-[0.05em] text-ink-muted">
          {title}
        </h3>
        {description ? <p className="m-0 mt-1 text-[13px] text-ink-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
