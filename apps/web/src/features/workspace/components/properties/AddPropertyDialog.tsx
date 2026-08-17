'use client';

import { propertySchema } from '@tronhanh/schemas';
import { useState } from 'react';
import { AreaSelect } from '@/components/ui/AreaSelect';
import { Button } from '@/components/ui/Button';
import { FormField, inputClassName } from '@/components/ui/FormField';
import { ModalShell } from '@/components/ui/ModalShell';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { useCreateProperty } from '@/features/workspace/hooks/useProperties';

interface AddPropertyDialogProps {
  sellerId: string;
  onClose: () => void;
  onCreated: (propertyId: string) => void;
}

/**
 * Tạo khu trọ mới.
 *
 * Cố ý CHỈ hỏi ba thông tin nhận dạng. Đơn giá điện/nước/dịch vụ và tài khoản ngân hàng nhập
 * ở màn chi tiết khu (B7) — nơi có validate và xem trước mã VietQR. Nhồi hết vào đây thì bước
 * đầu tiên của người dùng mới thành một form dài, và họ sẽ điền số bừa cho xong.
 */
export function AddPropertyDialog({ sellerId, onClose, onCreated }: AddPropertyDialogProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [area, setArea] = useState({ provinceCode: '', wardCode: '' });
  const [error, setError] = useState<string | null>(null);

  const createProperty = useCreateProperty(sellerId);

  const handleSubmit = () => {
    setError(null);

    const parsed = propertySchema.safeParse({
      name,
      address,
      district,
      provinceCode: area.provinceCode ? Number(area.provinceCode) : null,
      wardCode: area.wardCode ? Number(area.wardCode) : null,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dữ liệu chưa hợp lệ.');
      return;
    }

    createProperty.mutate(parsed.data, {
      onSuccess: (property) => onCreated(property.id),
      onError: (mutationError) =>
        setError(mutationError instanceof Error ? mutationError.message : 'Chưa tạo được khu trọ.'),
    });
  };

  return (
    <ModalShell
      footer={
        <>
          <Button disabled={createProperty.isPending} onClick={onClose} variant="ghost">
            Hủy
          </Button>
          <WriteGuardButton
            loading={createProperty.isPending}
            onClick={handleSubmit}
            surface="workspace"
            variant="primary"
          >
            Tạo khu trọ
          </WriteGuardButton>
        </>
      }
      onClose={onClose}
      title="Tạo khu trọ mới"
    >
      <div className="flex flex-col gap-3.5">
        <p className="m-0 text-[13px] leading-relaxed text-ink-muted">
          Khu trọ là nơi chứa các phòng của bạn. Sau khi tạo, bạn thêm phòng vào khu và nhập đơn giá
          điện nước ở màn <strong>Chi tiết khu trọ</strong>.
        </p>

        {error ? (
          <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
            {error}
          </p>
        ) : null}

        <FormField isRequired label="Tên khu trọ">
          <input
            className={inputClassName}
            onChange={(event) => setName(event.target.value)}
            placeholder="VD: Nhà trọ Hoàng Diệu"
            value={name}
          />
        </FormField>

        <FormField label="Địa chỉ">
          <input
            className={inputClassName}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="VD: 123 Hoàng Diệu, Phường 9"
            value={address}
          />
        </FormField>

        <AreaSelect
          onChange={(next) => {
            setArea({ provinceCode: next.provinceCode, wardCode: next.wardCode });
            setDistrict(next.wardName ?? '');
          }}
          value={area}
        />
      </div>
    </ModalShell>
  );
}
