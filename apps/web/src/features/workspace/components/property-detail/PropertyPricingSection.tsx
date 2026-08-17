'use client';

import { useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { NumberField } from '@/components/ui/NumberField';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import {
  SectionCard,
  SectionFeedback,
} from '@/features/workspace/components/property-detail/SectionCard';
import { useUpdatePropertyPricing } from '@/features/workspace/hooks/usePropertyDetail';
import type { Property } from '@/features/workspace/types/property';

type FieldErrors = Partial<Record<'electricity' | 'water' | 'service', string>>;

/**
 * Đơn giá **mặc định** của khu.
 *
 * Ba con số này là giá trị phòng thừa hưởng khi để trống đơn giá riêng. Đổi ở đây **không**
 * làm đổi hóa đơn các kỳ đã ghi: `UtilityReading` chốt cứng đơn giá tại thời điểm ghi chỉ số.
 * Nói rõ điều đó trong UI, vì "đổi giá điện tháng 8 có làm sai hóa đơn tháng 7 không" là câu
 * chủ trọ sẽ hỏi.
 */
export function PropertyPricingSection({
  property,
  sellerId,
}: {
  property: Property;
  sellerId: string;
}) {
  const [electricity, setElectricity] = useState(String(property.electricityPrice));
  const [water, setWater] = useState(String(property.waterPrice));
  const [service, setService] = useState(String(property.servicePrice));

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updatePricing = useUpdatePropertyPricing(property.id, sellerId);

  const handleSave = () => {
    setError(null);
    setSuccessMessage(null);

    /*
     * Bản prototype dùng `Number(elecPrice) || 3500`, nghĩa là nhập `0` (hoặc chữ) thì **âm
     * thầm** biến thành 3.500đ/kWh và lưu luôn — chủ trọ tin là đã đặt giá 0 nhưng hóa đơn
     * tính 3.500. Sai kiểu đó không hiện ra ở đâu cả cho tới lúc người ở thắc mắc.
     */
    const nextErrors: FieldErrors = {};
    if (electricity.trim() === '') nextErrors.electricity = 'Vui lòng nhập đơn giá điện';
    if (water.trim() === '') nextErrors.water = 'Vui lòng nhập đơn giá nước';
    if (service.trim() === '') nextErrors.service = 'Nhập 0 nếu khu không thu phí dịch vụ';

    if (Object.values(nextErrors).some(Boolean)) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    updatePricing.mutate(
      {
        electricityPrice: Number(electricity),
        waterPrice: Number(water),
        servicePrice: Number(service),
      },
      {
        onSuccess: () => setSuccessMessage('Đã lưu đơn giá của khu.'),
        onError: (mutationError) =>
          setError(
            mutationError instanceof Error ? mutationError.message : 'Chưa lưu được đơn giá.',
          ),
      },
    );
  };

  return (
    <SectionCard
      description="Phòng không đặt đơn giá riêng sẽ dùng ba mức này. Sửa ở đây không làm đổi hóa đơn các kỳ đã ghi chỉ số."
      footer={
        <WriteGuardButton
          loading={updatePricing.isPending}
          onClick={handleSave}
          surface="workspace"
          variant="primary"
        >
          Lưu đơn giá
        </WriteGuardButton>
      }
      title="Đơn giá mặc định"
    >
      <SectionFeedback error={error} successMessage={successMessage} />

      <div className="grid gap-3.5 md:grid-cols-3">
        <FormField error={fieldErrors.electricity} isRequired label="Tiền điện">
          <NumberField
            hasError={Boolean(fieldErrors.electricity)}
            onValueChange={(value) => {
              setElectricity(value);
              setFieldErrors((current) => ({ ...current, electricity: undefined }));
            }}
            placeholder="3.500"
            suffix="đ/kWh"
            value={electricity}
            withThousandSeparator
          />
        </FormField>

        <FormField error={fieldErrors.water} isRequired label="Tiền nước">
          <NumberField
            hasError={Boolean(fieldErrors.water)}
            onValueChange={(value) => {
              setWater(value);
              setFieldErrors((current) => ({ ...current, water: undefined }));
            }}
            placeholder="15.000"
            suffix="đ/m³"
            value={water}
            withThousandSeparator
          />
        </FormField>

        <FormField error={fieldErrors.service} label="Phí dịch vụ">
          <NumberField
            hasError={Boolean(fieldErrors.service)}
            onValueChange={(value) => {
              setService(value);
              setFieldErrors((current) => ({ ...current, service: undefined }));
            }}
            placeholder="100.000"
            suffix="đ/tháng"
            value={service}
            withThousandSeparator
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
