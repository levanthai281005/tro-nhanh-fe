'use client';

import { Plus, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { BoostUpgradeBlock } from '@/features/marketplace/components/post-listing/BoostUpgradeBlock';
import { FormField, inputClassName, inputErrorClassName } from '@/components/ui/FormField';
import type {
  PostListingFormValues,
  UtilityPricingMode,
  WaterPricingUnit,
} from '@/features/marketplace/types/postListing';
import { createLocalId } from '@/features/marketplace/utils/localId';
import { cn } from '@/utils/cn';

function formatThousands(raw: string) {
  const digits = raw.replace(/\D/g, '');
  return digits ? Number(digits).toLocaleString('vi-VN') : '';
}

export function StepCosts() {
  const { register, setValue, getValues, watch, formState } =
    useFormContext<PostListingFormValues>();
  const errors = formState.errors;
  const values = watch();

  // Mọi thao tác trên danh sách đều đọc bằng `getValues`, không dùng mảng từ `watch` — mảng đó
  // là ảnh chụp lúc render, hai thao tác liên tiếp trong cùng khung hình sẽ đè lên nhau.
  const addFee = () => {
    setValue('otherFees', [
      ...getValues('otherFees'),
      { id: createLocalId('fee'), name: '', amount: 0 },
    ]);
  };

  const updateFee = (id: string, patch: { name?: string; amount?: number }) => {
    setValue(
      'otherFees',
      getValues('otherFees').map((fee) => (fee.id === id ? { ...fee, ...patch } : fee)),
    );
  };

  const removeFee = (id: string) => {
    setValue(
      'otherFees',
      getValues('otherFees').filter((fee) => fee.id !== id),
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="m-0 text-lg font-extrabold text-ink">Chi phí &amp; liên hệ</h2>
        <p className="mt-1 text-[13.5px] text-ink-muted">
          Nói rõ chi phí ngay từ tin đăng giúp bạn lọc trước những người không phù hợp.
        </p>
      </header>

      <UtilityField
        error={errors.electricityPrice?.message}
        label="Tiền điện"
        mode={values.electricityMode}
        officialLabel="Theo giá nhà nước"
        onModeChange={(mode) => setValue('electricityMode', mode)}
        onValueChange={(next) => setValue('electricityPrice', formatThousands(next))}
        placeholder="VD: 3.500"
        unitHint="đồng/kWh"
        value={values.electricityPrice}
      />

      <UtilityField
        error={errors.waterPrice?.message}
        label="Tiền nước"
        mode={values.waterMode}
        officialLabel="Theo hóa đơn"
        onModeChange={(mode) => setValue('waterMode', mode)}
        onValueChange={(next) => setValue('waterPrice', formatThousands(next))}
        placeholder="VD: 100.000"
        unitHint={values.waterPricingUnit === 'PerPerson' ? 'đồng/người/tháng' : 'đồng/khối'}
        value={values.waterPrice}
      >
        {values.waterMode === 'Fixed' ? (
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: 'PerPerson', label: 'Tính theo người' },
                { value: 'PerCubicMeter', label: 'Tính theo khối' },
              ] as { value: WaterPricingUnit; label: string }[]
            ).map((option) => {
              const isSelected = values.waterPricingUnit === option.value;
              return (
                <button
                  aria-pressed={isSelected}
                  className={cn(
                    'rounded-sm border-[1.5px] px-3 py-1.5 text-[13px] transition-colors',
                    isSelected
                      ? 'border-primary bg-cream font-bold text-primary'
                      : 'border-line bg-surface text-ink-muted hover:border-primary',
                  )}
                  key={option.value}
                  onClick={() => setValue('waterPricingUnit', option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </UtilityField>

      <FormField hint="Để trống nếu không yêu cầu đặt cọc." label="Tiền đặt cọc">
        <input
          className={cn(inputClassName, 'md:max-w-[240px]')}
          data-testid="field-deposit"
          inputMode="numeric"
          onChange={(event) => setValue('deposit', formatThousands(event.target.value))}
          placeholder="VD: 3.500.000"
          value={values.deposit}
        />
      </FormField>

      <FormField
        hint="Phí dịch vụ, rác, mạng… Khu nào không có thì bỏ qua."
        label="Các khoản phí khác"
      >
        <div className="flex flex-col gap-2">
          {values.otherFees.map((fee) => (
            <div className="flex flex-wrap items-center gap-2" key={fee.id}>
              <input
                aria-label="Tên khoản phí"
                className={cn(inputClassName, 'flex-1 md:max-w-[240px]')}
                onChange={(event) => updateFee(fee.id, { name: event.target.value })}
                placeholder="VD: Phí rác"
                value={fee.name}
              />
              <input
                aria-label="Số tiền"
                className={cn(inputClassName, 'w-[150px]')}
                inputMode="numeric"
                onChange={(event) =>
                  updateFee(fee.id, { amount: Number(event.target.value.replace(/\D/g, '')) || 0 })
                }
                placeholder="Số tiền"
                value={fee.amount ? fee.amount.toLocaleString('vi-VN') : ''}
              />
              <button
                aria-label={`Xóa khoản phí ${fee.name || 'chưa đặt tên'}`}
                className="flex size-9 items-center justify-center rounded-sm border border-line text-ink-muted transition-colors hover:border-error hover:text-error"
                onClick={() => removeFee(fee.id)}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          ))}

          <Button
            className="w-fit"
            icon={<Plus aria-hidden="true" className="size-3.5" />}
            onClick={addFee}
            size="sm"
            variant="outline"
          >
            Thêm khoản phí
          </Button>
        </div>
      </FormField>

      <FormField
        error={errors.contactPhone?.message}
        hint="Số này hiện công khai trên tin đăng — có thể dùng số khác với số đăng ký tài khoản."
        isRequired
        label="Số điện thoại liên hệ"
      >
        <input
          className={cn(
            inputClassName,
            'md:max-w-[240px]',
            errors.contactPhone && inputErrorClassName,
          )}
          data-testid="field-contact-phone"
          inputMode="tel"
          placeholder="VD: 0901234567"
          {...register('contactPhone')}
        />
      </FormField>

      <BoostUpgradeBlock
        isEnabled={values.wantsBoost}
        onSelectDays={(days) => setValue('boostDays', days)}
        onToggle={(next) => setValue('wantsBoost', next)}
        selectedDays={values.boostDays}
      />
    </div>
  );
}

interface UtilityFieldProps {
  label: string;
  value: string;
  mode: UtilityPricingMode;
  officialLabel: string;
  placeholder: string;
  unitHint: string;
  error?: string;
  onValueChange: (next: string) => void;
  onModeChange: (mode: UtilityPricingMode) => void;
  children?: React.ReactNode;
}

/**
 * Điện/nước bắt buộc phải nói rõ, nhưng có hai cách nói: nhập số cụ thể, hoặc chọn "theo giá
 * chung". Bắt nhập số cứng sẽ khiến người chưa chốt giá điền bừa — với người đi thuê thì số
 * bịa còn tệ hơn là không có số.
 */
function UtilityField({
  label,
  value,
  mode,
  officialLabel,
  placeholder,
  unitHint,
  error,
  onValueChange,
  onModeChange,
  children,
}: UtilityFieldProps) {
  const isFixed = mode === 'Fixed';

  return (
    <FormField error={error} isRequired label={label}>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <input
            aria-label={label}
            className={cn(
              inputClassName,
              'w-[180px]',
              !isFixed && 'opacity-50',
              error && inputErrorClassName,
            )}
            disabled={!isFixed}
            inputMode="numeric"
            onChange={(event) => onValueChange(event.target.value)}
            placeholder={placeholder}
            value={isFixed ? value : ''}
          />
          <span className="text-[13px] text-ink-muted">{unitHint}</span>
        </div>

        <label className="flex w-fit cursor-pointer items-center gap-2 text-[13px] text-ink">
          <input
            checked={!isFixed}
            className="size-4 accent-primary"
            onChange={(event) => onModeChange(event.target.checked ? 'Official' : 'Fixed')}
            type="checkbox"
          />
          {officialLabel}
        </label>

        {children}
      </div>
    </FormField>
  );
}
