'use client';

import { occupantNameSchema, occupantPhoneSchema } from '@tronhanh/schemas';
import { BadgeCheck, Search, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField, inputClassName } from '@/components/ui/FormField';
import { ModalShell } from '@/components/ui/ModalShell';
import { NumberField } from '@/components/ui/NumberField';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { lookupRenterByPhone } from '@/features/workspace/services/occupanciesService';
import type { AddOccupancyInput, RenterLookupResult } from '@/features/workspace/types/occupancy';

interface AddOccupantDialogProps {
  roomId: string;
  roomCode: string;
  hasRepresentative: boolean;
  isSaving: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: (input: AddOccupancyInput) => void;
}

type FieldErrors = Partial<Record<'fullName' | 'phoneNumber' | 'startDate', string>>;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Thêm người ở — Module 7, BR-029.
 *
 * Luồng bắt đầu từ **số điện thoại**, không phải tên: SĐT là định danh duy nhất toàn hệ thống
 * (BR-016), và nó quyết định người này được gắn tài khoản hay thêm dạng fallback. Bản prototype
 * tra bằng email — email lại là trường tùy chọn nên phần lớn người ở không có.
 */
export function AddOccupantDialog({
  roomId,
  roomCode,
  hasRepresentative,
  isSaving,
  submitError,
  onClose,
  onSubmit,
}: AddOccupantDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [startDate, setStartDate] = useState(todayIso());
  const [occupantCount, setOccupantCount] = useState('1');
  const [note, setNote] = useState('');
  const [isRepresentative, setIsRepresentative] = useState(!hasRepresentative);

  const [lookup, setLookup] = useState<RenterLookupResult | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleLookup = () => {
    const parsed = occupantPhoneSchema.safeParse(phoneNumber);
    if (!parsed.success) {
      setFieldErrors((current) => ({
        ...current,
        phoneNumber: parsed.error.issues[0]?.message,
      }));
      return;
    }

    setIsLookingUp(true);
    void lookupRenterByPhone(parsed.data)
      .then((result) => {
        setLookup(result);
        // Điền sẵn tên trên hồ sơ để chủ trọ đối chiếu — vẫn sửa được, vì tên gọi ở nhà trọ
        // có thể khác tên trên giấy tờ.
        if (result.fullName && fullName.trim() === '') setFullName(result.fullName);
      })
      .finally(() => setIsLookingUp(false));
  };

  const handleSubmit = () => {
    const nameResult = occupantNameSchema.safeParse(fullName);
    const phoneResult = occupantPhoneSchema.safeParse(phoneNumber);

    const nextErrors: FieldErrors = {
      fullName: nameResult.success ? undefined : nameResult.error.issues[0]?.message,
      phoneNumber: phoneResult.success ? undefined : phoneResult.error.issues[0]?.message,
      startDate: startDate ? undefined : 'Vui lòng chọn ngày bắt đầu ở',
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    onSubmit({
      roomId,
      fullName,
      phoneNumber,
      startDate,
      occupantCount: Math.max(1, Number(occupantCount) || 1),
      note,
      linkedUserId: lookup?.userId ?? null,
      isContractRepresentative: isRepresentative,
    });
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
            Thêm người ở
          </WriteGuardButton>
        </>
      }
      onClose={onClose}
      title={`Thêm người ở — phòng ${roomCode}`}
    >
      <div className="flex flex-col gap-4">
        {submitError ? (
          <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
            {submitError}
          </p>
        ) : null}

        <FormField
          error={fieldErrors.phoneNumber}
          hint="Số điện thoại là cách hệ thống nhận ra người ở và gửi lời mời liên kết."
          isRequired
          label="Số điện thoại"
        >
          <div className="flex gap-2">
            <input
              autoFocus
              className={inputClassName}
              inputMode="tel"
              onChange={(event) => {
                setPhoneNumber(event.target.value);
                setLookup(null);
                setFieldErrors((current) => ({ ...current, phoneNumber: undefined }));
              }}
              placeholder="VD: 0905123456"
              value={phoneNumber}
            />
            <Button
              icon={<Search aria-hidden="true" className="size-4" />}
              loading={isLookingUp}
              onClick={handleLookup}
              variant="outline"
            >
              Tra
            </Button>
          </div>
        </FormField>

        {lookup ? (
          lookup.userId ? (
            <div className="flex items-start gap-2.5 rounded-sm border border-status-available bg-status-available-soft px-3.5 py-3">
              <BadgeCheck
                aria-hidden="true"
                className="mt-px size-4 shrink-0 text-status-available"
              />
              <p className="m-0 text-[13px] leading-relaxed text-ink">
                Số này đã có tài khoản Trọ Nhanh (<strong>{lookup.fullName}</strong>). Sau khi thêm,
                họ nhận lời mời liên kết và <strong>tự xác nhận</strong> thì mới xem được hợp đồng,
                hóa đơn của phòng.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-sm border border-line bg-canvas px-3.5 py-3">
              <UserPlus aria-hidden="true" className="mt-px size-4 shrink-0 text-ink-muted" />
              <p className="m-0 text-[13px] leading-relaxed text-ink-muted">
                Số này chưa có tài khoản Trọ Nhanh. Vẫn thêm được — bạn quản lý bình thường, và có
                thể gửi lời mời liên kết sau khi họ đăng ký.
              </p>
            </div>
          )
        ) : null}

        <FormField error={fieldErrors.fullName} isRequired label="Họ và tên">
          <input
            className={inputClassName}
            onChange={(event) => {
              setFullName(event.target.value);
              setFieldErrors((current) => ({ ...current, fullName: undefined }));
            }}
            placeholder="VD: Trần Thị Mai"
            value={fullName}
          />
        </FormField>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <FormField error={fieldErrors.startDate} isRequired label="Ngày bắt đầu ở">
            <input
              className={inputClassName}
              onChange={(event) => setStartDate(event.target.value)}
              type="date"
              value={startDate}
            />
          </FormField>

          <FormField hint="Số người của riêng bản ghi này." label="Số nhân khẩu">
            <NumberField onValueChange={setOccupantCount} suffix="người" value={occupantCount} />
          </FormField>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-sm border border-line bg-canvas px-3.5 py-3">
          <input
            checked={isRepresentative}
            className="mt-[3px] size-4 shrink-0 accent-primary"
            onChange={(event) => setIsRepresentative(event.target.checked)}
            type="checkbox"
          />
          <span>
            <span className="block text-[13.5px] font-bold text-ink">
              Người này đứng tên hợp đồng
            </span>
            <span className="mt-0.5 block text-xs leading-snug text-ink-muted">
              {hasRepresentative
                ? 'Phòng đã có người đại diện — bật mục này sẽ chuyển vai trò sang người mới.'
                : 'Mỗi phòng có một người đại diện đứng tên hợp đồng.'}
            </span>
          </span>
        </label>

        <FormField hint="Chỉ mình bạn thấy." label="Ghi chú">
          <textarea
            className={inputClassName}
            onChange={(event) => setNote(event.target.value)}
            placeholder="VD: Đã đặt cọc, dọn vào đầu tháng sau"
            rows={2}
            value={note}
          />
        </FormField>
      </div>
    </ModalShell>
  );
}
