'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface NumberFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'type'
> {
  value: string;
  onValueChange: (value: string) => void;
  /** Đơn vị hiện chìm bên phải ô: `m²`, `đ/tháng`, `đ/kWh`. */
  suffix?: string;
  /** Tự chèn dấu chấm phân cách hàng nghìn khi gõ. Bật cho tiền, tắt cho diện tích và tầng. */
  withThousandSeparator?: boolean;
  hasError?: boolean;
}

/** Chỉ giữ chữ số — người dùng dán "3.200.000đ" hay "3 200 000" đều ra cùng một giá trị. */
function toDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Ô nhập số có đơn vị.
 *
 * Vì sao tự chấm phân cách khi gõ: giá thuê là số bảy chữ số, và "3200000" trên màn hình
 * không đọc được — người dùng phải đếm chữ số để biết mình vừa gõ 3,2 triệu hay 32 triệu.
 * Nhập nhầm một số 0 ở giá thuê là sai lệch chảy thẳng xuống hóa đơn.
 *
 * `inputMode="numeric"` để điện thoại bật bàn phím số; vẫn để `type="text"` vì `type="number"`
 * không hiện được dấu chấm phân cách và còn cho gõ `e`, `+`, `-`.
 */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  { value, onValueChange, suffix, withThousandSeparator = false, hasError, className, ...rest },
  ref,
) {
  const digits = toDigits(value);
  const displayValue = withThousandSeparator ? groupThousands(digits) : digits;

  return (
    <div
      className={cn(
        'flex w-full items-center gap-2 rounded-sm border-[1.5px] border-sand/55 bg-canvas px-3.5 py-2.5 transition-colors focus-within:border-sand hover:border-sand/80',
        hasError && 'border-error hover:border-error focus-within:border-error',
        className,
      )}
    >
      <input
        ref={ref}
        className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/60"
        inputMode="numeric"
        onChange={(event) => onValueChange(toDigits(event.target.value))}
        type="text"
        value={displayValue}
        {...rest}
      />
      {suffix ? (
        <span className="shrink-0 text-[13px] font-medium text-ink-muted">{suffix}</span>
      ) : null}
    </div>
  );
});
