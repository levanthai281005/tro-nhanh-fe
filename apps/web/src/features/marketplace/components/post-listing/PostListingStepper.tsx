import { Check } from 'lucide-react';
import { POST_LISTING_STEPS } from '@/features/marketplace/constants/postListingSteps';
import { cn } from '@/utils/cn';

export interface PostListingStepperProps {
  currentStep: number;
}

export function PostListingStepper({ currentStep }: PostListingStepperProps) {
  const total = POST_LISTING_STEPS.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="m-0 text-[13px] font-bold text-ink">
          Bước {currentStep + 1}/{total} — {POST_LISTING_STEPS[currentStep]?.label}
        </p>
        <p className="m-0 text-xs text-ink-muted">
          {Math.round(((currentStep + 1) / total) * 100)}%
        </p>
      </div>

      <ol className="flex items-center gap-1.5">
        {POST_LISTING_STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li className="flex flex-1 items-center gap-1.5" key={step.id}>
              <span
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors',
                  isDone && 'bg-status-available text-surface',
                  isCurrent && 'bg-primary text-surface',
                  !isDone && !isCurrent && 'bg-line text-ink-muted',
                )}
              >
                {isDone ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'hidden h-1 flex-1 rounded-full transition-colors sm:block',
                  isDone ? 'bg-status-available' : 'bg-line',
                )}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
