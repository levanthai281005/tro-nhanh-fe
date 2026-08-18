'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  EMPTY_POST_LISTING_VALUES,
  POST_LISTING_STEPS,
} from '@/features/marketplace/constants/postListingSteps';
import { useListingDraft } from '@/features/marketplace/hooks/useListingDraft';
import { postListingStepSchemas } from '@/features/marketplace/schemas/postListingSteps';
import { submitListing } from '@/features/marketplace/services/postListingService';
import type { PostListingFormValues } from '@/features/marketplace/types/postListing';

export interface UsePostListingFormOptions {
  sellerId: string;
  listingId?: string;
  initialValues?: PostListingFormValues;
}

export function usePostListingForm({
  sellerId,
  listingId,
  initialValues,
}: UsePostListingFormOptions) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const form = useForm<PostListingFormValues>({
    defaultValues: initialValues ?? EMPTY_POST_LISTING_VALUES,
    // Kiểm lúc rời ô, không lúc đang gõ: báo đỏ ngay từ ký tự đầu tiên là kiểu làm phiền
    // khiến người dùng thấy mình "sai" suốt trong khi mới nhập được nửa chừng.
    mode: 'onBlur',
    // Không gắn resolver toàn form: mỗi bước có schema riêng, và một resolver cố định sẽ báo
    // lỗi cả những trường ở bước người dùng chưa tới. Việc kiểm nằm ở `validateCurrentStep`.
  });

  const values = form.watch();

  const draft = useListingDraft({
    sellerId,
    listingId,
    values,
    step,
    isEnabled: !isDone && !isSubmitting,
  });

  const restoreDraft = useCallback(() => {
    if (!draft.pendingDraft) return;
    form.reset(draft.pendingDraft.values);
    setStep(draft.pendingDraft.step);
    draft.dismissDraft();
  }, [draft, form]);

  const discardDraft = useCallback(() => {
    draft.clearDraft();
  }, [draft]);

  /** Chỉ kiểm các trường của bước hiện tại — không bắt người dùng sửa lỗi ở bước chưa tới. */
  const validateCurrentStep = useCallback(async () => {
    const schema = postListingStepSchemas[step];
    if (!schema) return true;

    const result = schema.safeParse(form.getValues());

    if (result.success) {
      form.clearErrors();
      return true;
    }

    form.clearErrors();
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === 'string') {
        form.setError(field as keyof PostListingFormValues, {
          type: 'manual',
          message: issue.message,
        });
      }
    }

    return false;
  }, [form, step]);

  const goNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return false;

    setStep((current) => Math.min(POST_LISTING_STEPS.length - 1, current + 1));
    return true;
  }, [validateCurrentStep]);

  const goBack = useCallback(() => {
    form.clearErrors();
    setStep((current) => Math.max(0, current - 1));
  }, [form]);

  const submit = useCallback(
    async (isDraftSave: boolean) => {
      // Lưu nháp thì không chặn vì thiếu trường — người dùng đang lưu nửa chừng là chuyện
      // bình thường. Chỉ gửi duyệt mới bắt buộc kiểm đủ.
      if (!isDraftSave) {
        const isValid = await validateCurrentStep();
        if (!isValid) return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const result = await submitListing({
          values: form.getValues(),
          isDraft: isDraftSave,
          listingId,
        });

        setIsDone(true);
        draft.clearDraft();
        router.push(`/tai-khoan/tin-cho-thue?created=${result.status}`);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'Không gửi được tin đăng. Vui lòng thử lại.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [draft, form, listingId, router, validateCurrentStep],
  );

  return {
    form,
    values,
    step,
    stepMeta: POST_LISTING_STEPS[step],
    totalSteps: POST_LISTING_STEPS.length,
    isFirstStep: step === 0,
    isLastStep: step === POST_LISTING_STEPS.length - 1,
    isSubmitting,
    submitError,
    goNext,
    goBack,
    submit,
    pendingDraft: draft.pendingDraft,
    draftSavedAt: draft.savedAt,
    restoreDraft,
    discardDraft,
  };
}
