'use client';

import { VIETNAM_BANKS } from '@tronhanh/constants';
import { VIETQR_ACCOUNT_PATTERN } from '@tronhanh/utils';
import { useState } from 'react';
import { AppSelect } from '@/components/ui/AppSelect';
import { FormField, inputClassName } from '@/components/ui/FormField';
import { VietQrPreview } from '@/components/ui/VietQrPreview';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import {
  SectionCard,
  SectionFeedback,
} from '@/features/workspace/components/property-detail/SectionCard';
import { useUpdatePropertyPayout } from '@/features/workspace/hooks/usePropertyDetail';
import type { Property } from '@/features/workspace/types/property';
import { toVietQrAccountName } from '@/features/workspace/utils/vietQrAccountName';

type FieldErrors = Partial<Record<'bank' | 'account' | 'accountName', string>>;

const BANK_OPTIONS = [
  { value: '', label: '— Chọn ngân hàng —' },
  ...VIETNAM_BANKS.map((bank) => ({ value: bank.code, label: bank.name })),
];

export function PropertyPayoutSection({
  property,
  sellerId,
}: {
  property: Property;
  sellerId: string;
}) {
  const [bankCode, setBankCode] = useState(property.bankName ?? '');
  const [accountNumber, setAccountNumber] = useState(property.bankAccountNumber ?? '');
  const [accountName, setAccountName] = useState(property.bankAccountName ?? '');

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updatePayout = useUpdatePropertyPayout(property.id, sellerId);

  const handleSave = () => {
    setError(null);
    setSuccessMessage(null);

    const account = accountNumber.trim();
    const nextErrors: FieldErrors = {};

    if (account !== '') {
      if (!/^\d+$/.test(account)) {
        nextErrors.account = 'Số tài khoản chỉ gồm chữ số, không có dấu cách';
      } else if (!VIETQR_ACCOUNT_PATTERN.test(account)) {
        nextErrors.account = 'Số tài khoản phải có từ 6 đến 19 chữ số';
      }
      // Có STK mà không chọn ngân hàng thì hóa đơn không sinh được VietQR — và chỗ duy nhất
      // phát hiện ra là khi người ở mở hóa đơn và không thấy mã nào.
      if (bankCode.trim() === '') {
        nextErrors.bank = 'Đã nhập số tài khoản thì phải chọn ngân hàng để tạo được mã VietQR';
      }
      if (accountName.trim() === '') {
        nextErrors.accountName = 'Vui lòng nhập tên chủ tài khoản';
      }
    }

    if (Object.values(nextErrors).some(Boolean)) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    updatePayout.mutate(
      {
        bankName: bankCode.trim() || null,
        bankAccountNumber: account || null,
        bankAccountName: accountName.trim() || null,
      },
      {
        onSuccess: () => setSuccessMessage('Đã lưu thông tin nhận tiền.'),
        onError: (mutationError) =>
          setError(
            mutationError instanceof Error ? mutationError.message : 'Chưa lưu được thay đổi.',
          ),
      },
    );
  };

  return (
    <SectionCard
      description="Đây là tài khoản sinh mã VietQR trên hóa đơn. Nền tảng không giữ tiền thuê — người ở chuyển khoản thẳng cho bạn."
      footer={
        <WriteGuardButton
          loading={updatePayout.isPending}
          onClick={handleSave}
          surface="workspace"
          variant="primary"
        >
          Lưu thông tin nhận tiền
        </WriteGuardButton>
      }
      title="Tài khoản nhận tiền"
    >
      <SectionFeedback error={error} successMessage={successMessage} />

      <div className="grid gap-5 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3.5">
          <FormField error={fieldErrors.bank} label="Ngân hàng">
            {/* Dropdown chứ không phải ô chữ: mã VietQR cần mã BIN 6 số của ngân hàng. Ô chữ
                tự do ("mbbank", "Ngân hàng Quân Đội") lưu vẫn thành công nhưng hóa đơn sau đó
                không sinh được QR nào. */}
            <div className="rounded-sm border-[1.5px] border-sand/55 bg-canvas px-3.5 py-2.5">
              <AppSelect
                onChange={(value) => {
                  setBankCode(value);
                  setFieldErrors((current) => ({ ...current, bank: undefined }));
                }}
                options={BANK_OPTIONS}
                searchable
                value={bankCode}
              />
            </div>
          </FormField>

          <FormField error={fieldErrors.account} label="Số tài khoản">
            <input
              className={inputClassName}
              inputMode="numeric"
              onChange={(event) => {
                setAccountNumber(event.target.value);
                setFieldErrors((current) => ({ ...current, account: undefined }));
              }}
              placeholder="VD: 0912345678"
              value={accountNumber}
            />
          </FormField>

          <FormField
            error={fieldErrors.accountName}
            hint="Tự chuyển thành IN HOA không dấu — chuẩn VietQR yêu cầu vậy."
            label="Tên chủ tài khoản"
          >
            <input
              className={inputClassName}
              onChange={(event) => {
                setAccountName(toVietQrAccountName(event.target.value));
                setFieldErrors((current) => ({ ...current, accountName: undefined }));
              }}
              placeholder="VD: NGUYEN VAN AN"
              value={accountName}
            />
          </FormField>
        </div>

        {/* Xem trước ngay tại đây để chủ trọ quét thử bằng app ngân hàng TRƯỚC khi hóa đơn đầu
            tiên đến tay người ở. */}
        <div className="flex flex-col gap-2 md:w-[220px]">
          <span className="text-xs font-bold uppercase tracking-[0.05em] text-ink-muted">
            Xem trước mã QR
          </span>
          <VietQrPreview
            accountName={accountName}
            accountNumber={accountNumber}
            bankCode={bankCode}
            purpose={`Tien phong ${property.name}`}
          />
          <p className="m-0 text-center text-[11.5px] leading-relaxed text-ink-muted">
            Quét thử bằng app ngân hàng để chắc chắn đúng tài khoản.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
