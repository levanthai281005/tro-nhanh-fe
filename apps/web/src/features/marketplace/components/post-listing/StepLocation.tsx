'use client';

import { useFormContext } from 'react-hook-form';
import { AppSelect } from '@/components/ui/AppSelect';
import { PROPERTY_TYPE_OPTIONS } from '@/features/marketplace/constants/catalog';
import { AreaSelect } from '@/features/marketplace/components/post-listing/AreaSelect';
import {
  FormField,
  inputClassName,
  inputErrorClassName,
} from '@/features/marketplace/components/post-listing/FormField';
import { LocationPicker } from '@/features/marketplace/components/post-listing/LocationPicker';
import { NearbyPlacesInput } from '@/features/marketplace/components/post-listing/NearbyPlacesInput';
import type { PostListingFormValues } from '@/features/marketplace/types/postListing';
import type { RentalPropertyType } from '@/features/marketplace/types/savedListings';
import { cn } from '@/utils/cn';

/**
 * Bước 1 — toàn những thứ chủ trọ trả lời được ngay không cần nghĩ, để thấy tiến triển nhanh
 * ở màn hình đầu (chỗ dễ bỏ cuộc nhất).
 */
export function StepLocation() {
  const { register, setValue, watch, formState } = useFormContext<PostListingFormValues>();
  const errors = formState.errors;
  const values = watch();

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="m-0 text-lg font-extrabold text-ink">Phòng của bạn ở đâu?</h2>
        <p className="mt-1 text-[13.5px] text-ink-muted">
          Địa chỉ càng rõ, người tìm trọ càng dễ hình dung và liên hệ.
        </p>
      </header>

      <FormField error={errors.propertyType?.message} isRequired label="Loại hình cho thuê">
        <AppSelect
          data-testid="field-property-type"
          onChange={(next) => setValue('propertyType', next as RentalPropertyType)}
          options={[...PROPERTY_TYPE_OPTIONS]}
          value={values.propertyType}
        />
      </FormField>

      <FormField
        error={errors.wardCode?.message ?? errors.district?.message}
        isRequired
        label="Khu vực"
      >
        <AreaSelect
          hasError={Boolean(errors.wardCode)}
          onChange={(next) => {
            setValue('provinceCode', next.provinceCode);
            setValue('wardCode', next.wardCode);
            setValue('district', next.wardName ?? '');
          }}
          value={{ provinceCode: values.provinceCode, wardCode: values.wardCode }}
        />
      </FormField>

      <FormField
        error={errors.address?.message}
        hint="Chỉ cần số nhà và tên đường — phường/xã đã chọn ở trên."
        isRequired
        label="Địa chỉ cụ thể"
      >
        <input
          className={cn(inputClassName, errors.address && inputErrorClassName)}
          data-testid="field-address"
          placeholder="VD: 123 Đường Nguyễn Hữu Thọ"
          {...register('address')}
        />
      </FormField>

      <FormField
        hint="Không bắt buộc, nhưng giúp người tìm trọ hình dung được vị trí."
        label="Ghim vị trí trên bản đồ"
      >
        <LocationPicker
          latitude={values.latitude}
          longitude={values.longitude}
          onChange={(latitude, longitude) => {
            setValue('latitude', latitude);
            setValue('longitude', longitude);
          }}
        />
      </FormField>

      <FormField
        hint="Không bắt buộc. Trường học, chợ, bệnh viện gần phòng là thứ người thuê hay cân nhắc."
        label="Tiện ích xung quanh"
      >
        <NearbyPlacesInput
          onChange={(next) => setValue('nearbyPlaces', next)}
          value={values.nearbyPlaces}
        />
      </FormField>
    </div>
  );
}
