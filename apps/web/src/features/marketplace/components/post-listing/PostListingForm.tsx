'use client';

import { ArrowLeft, ArrowRight, Check, CloudCheck } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PostListingStepper } from '@/features/marketplace/components/post-listing/PostListingStepper';
import { RestoreDraftDialog } from '@/features/marketplace/components/post-listing/RestoreDraftDialog';
import { StepCosts } from '@/features/marketplace/components/post-listing/StepCosts';
import { StepLocation } from '@/features/marketplace/components/post-listing/StepLocation';
import { StepMedia } from '@/features/marketplace/components/post-listing/StepMedia';
import { StepRoomInfo } from '@/features/marketplace/components/post-listing/StepRoomInfo';
import { usePostListingForm } from '@/features/marketplace/hooks/usePostListingForm';
import type { PostListingFormValues } from '@/features/marketplace/types/postListing';

export interface PostListingFormProps {
  sellerId: string;
  listingId?: string;
  initialValues?: PostListingFormValues;
}

export function PostListingForm({ sellerId, listingId, initialValues }: PostListingFormProps) {
  const {
    form,
    step,
    isFirstStep,
    isLastStep,
    isSubmitting,
    submitError,
    goNext,
    goBack,
    submit,
    pendingDraft,
    draftSavedAt,
    restoreDraft,
    discardDraft,
  } = usePostListingForm({ sellerId, listingId, initialValues });

  const isEditMode = Boolean(listingId);

  return (
    <FormProvider {...form}>
      <div className="mx-auto flex w-full max-w-[860px] flex-col gap-5 px-4 pb-16 pt-6 md:px-6">
        <header>
          <h1 className="m-0 text-[22px] font-black tracking-[-0.02em] text-ink md:text-[28px]">
            {isEditMode ? 'Chỉnh sửa tin đăng' : 'Đăng tin cho thuê'}
          </h1>
          <p className="mt-1.5 text-[13.5px] text-ink-muted">
            Đăng tin cho thuê là miễn phí. Bạn có thể lưu nháp và quay lại bất cứ lúc nào.
          </p>
        </header>

        <PostListingStepper currentStep={step} />

        <Card className="p-5 md:p-6">
          {step === 0 ? <StepLocation /> : null}
          {step === 1 ? <StepRoomInfo /> : null}
          {step === 2 ? <StepMedia /> : null}
          {step === 3 ? <StepCosts /> : null}
        </Card>

        {submitError ? (
          <p
            className="m-0 rounded-sm border border-error bg-error-soft px-4 py-3 text-sm font-semibold text-error"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            disabled={isFirstStep || isSubmitting}
            icon={<ArrowLeft aria-hidden="true" className="size-4" />}
            onClick={goBack}
            variant="outline"
          >
            Quay lại
          </Button>

          <div className="flex flex-wrap items-center gap-2.5">
            {draftSavedAt ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <CloudCheck aria-hidden="true" className="size-3.5" />
                Đã tự lưu
              </span>
            ) : null}

            {!isEditMode ? (
              <Button
                data-testid="listing-draft-btn"
                disabled={isSubmitting}
                onClick={() => void submit(true)}
                variant="outline"
              >
                Lưu nháp
              </Button>
            ) : null}

            {isLastStep ? (
              <Button
                data-testid="listing-submit-btn"
                icon={<Check aria-hidden="true" className="size-4" />}
                loading={isSubmitting}
                onClick={() => void submit(false)}
              >
                {isEditMode ? 'Lưu thay đổi' : 'Đăng tin'}
              </Button>
            ) : (
              <Button
                data-testid="listing-next-btn"
                disabled={isSubmitting}
                icon={<ArrowRight aria-hidden="true" className="size-4" />}
                onClick={() => void goNext()}
              >
                Tiếp tục
              </Button>
            )}
          </div>
        </div>
      </div>

      {pendingDraft ? (
        <RestoreDraftDialog
          onDiscard={discardDraft}
          onRestore={restoreDraft}
          savedAt={pendingDraft.savedAt}
        />
      ) : null}
    </FormProvider>
  );
}
