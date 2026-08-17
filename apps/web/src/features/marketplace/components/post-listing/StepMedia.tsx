'use client';

import { Sparkles } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import {
  DESCRIPTION_HINTS,
  POST_LISTING_STEPS,
} from '@/features/marketplace/constants/postListingSteps';
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_VALUE_BY_LABEL,
} from '@/features/marketplace/constants/catalog';
import { FormField, inputClassName, inputErrorClassName } from '@/components/ui/FormField';
import { PhotoUploader } from '@/features/marketplace/components/post-listing/PhotoUploader';
import type { PostListingFormValues } from '@/features/marketplace/types/postListing';
import { cn } from '@/utils/cn';

const TITLE_MAX_LENGTH = 120;

/**
 * Gợi ý tiêu đề từ dữ liệu đã nhập ở hai bước trước.
 *
 * Tiêu đề là trường khó nhất (phải tự nghĩ ra chữ) mà lại bắt buộc 10–120 ký tự. Có sẵn một
 * câu đúng chuẩn để sửa thì nhanh hơn nhiều so với nhìn ô trống.
 */
function buildTitleSuggestion(values: PostListingFormValues): string | null {
  const typeLabel = PROPERTY_TYPES.find(
    (label) => PROPERTY_TYPE_VALUE_BY_LABEL[label] === values.propertyType,
  );
  if (!typeLabel) return null;

  const area = values.area.replace(/,/g, '.').replace(/[^\d.]/g, '');
  const parts = [`Cho thuê ${typeLabel.toLowerCase()}`];
  if (area) parts.push(`${area}m²`);
  if (values.district) parts.push(`tại ${values.district}`);

  const suggestion = parts.join(' ');
  return suggestion.length >= 10 ? suggestion.slice(0, TITLE_MAX_LENGTH) : null;
}

export function StepMedia() {
  const { register, setValue, watch, formState } = useFormContext<PostListingFormValues>();
  const errors = formState.errors;
  const values = watch();
  const suggestion = buildTitleSuggestion(values);
  const titleLength = values.title.trim().length;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="m-0 text-lg font-extrabold text-ink">Ảnh &amp; mô tả</h2>
        <p className="mt-1 text-[13.5px] text-ink-muted">
          Tin có ảnh thật và mô tả rõ được liên hệ nhiều hơn hẳn.
        </p>
      </header>

      <FormField
        error={errors.title?.message}
        hint={`${titleLength}/${TITLE_MAX_LENGTH} ký tự`}
        isRequired
        label="Tiêu đề tin đăng"
      >
        <input
          className={cn(inputClassName, errors.title && inputErrorClassName)}
          data-testid="field-title"
          maxLength={TITLE_MAX_LENGTH}
          placeholder="VD: Cho thuê phòng trọ 25m² tại Phường Tân Hưng"
          {...register('title')}
        />
        {suggestion && values.title.trim() !== suggestion ? (
          <button
            className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-sm bg-cream px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-sand-soft"
            data-testid="title-suggestion"
            onClick={() => setValue('title', suggestion, { shouldValidate: false })}
            type="button"
          >
            <Sparkles aria-hidden="true" className="size-3.5" />
            Dùng gợi ý: “{suggestion}”
          </button>
        ) : null}
      </FormField>

      <FormField
        error={errors.photoUrls?.message}
        isRequired
        label={POST_LISTING_STEPS[2]?.label === 'Ảnh & mô tả' ? 'Ảnh phòng' : 'Ảnh'}
      >
        <PhotoUploader
          hasError={Boolean(errors.photoUrls)}
          onChange={(next) => setValue('photoUrls', next, { shouldValidate: false })}
          value={values.photoUrls}
        />
      </FormField>

      <FormField error={errors.description?.message} isRequired label="Mô tả chi tiết">
        <div className="flex flex-col gap-2">
          <textarea
            className={cn(
              inputClassName,
              'min-h-[150px] resize-y',
              errors.description && inputErrorClassName,
            )}
            data-testid="field-description"
            placeholder="Viết vài dòng về phòng để người thuê hình dung được..."
            {...register('description')}
          />
          <div className="rounded-sm border border-dashed border-line bg-canvas px-3 py-2.5">
            <p className="m-0 mb-1.5 text-xs font-bold text-ink-muted">Có thể nhắc tới:</p>
            <ul className="m-0 flex flex-wrap gap-x-4 gap-y-1 pl-4 text-xs text-ink-muted">
              {DESCRIPTION_HINTS.map((hint) => (
                <li className="list-disc" key={hint}>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FormField>
    </div>
  );
}
