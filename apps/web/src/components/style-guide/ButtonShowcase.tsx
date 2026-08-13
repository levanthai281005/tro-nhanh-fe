import { Button, type ButtonVariant } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost'];
const STATES = ['default', 'hover', 'pressed', 'disabled'] as const;
type FrozenState = (typeof STATES)[number];

const STATE_CLASSES: Record<ButtonVariant, Record<FrozenState, string>> = {
  primary: {
    default: 'border-transparent bg-primary text-surface',
    hover: 'border-transparent bg-primary-hover text-surface',
    pressed: 'border-transparent bg-primary-press text-surface',
    disabled: 'border-transparent bg-line text-ink-muted',
  },
  secondary: {
    default: 'border-transparent bg-sand text-surface',
    hover: 'border-transparent bg-sand-hover text-surface',
    pressed: 'border-transparent bg-sand-press text-surface',
    disabled: 'border-transparent bg-line text-ink-muted',
  },
  outline: {
    default: 'border-primary bg-transparent text-primary',
    hover: 'border-primary bg-sand-soft text-primary',
    pressed: 'border-primary-press bg-sand-soft text-primary-press',
    disabled: 'border-line bg-transparent text-ink-muted',
  },
  ghost: {
    default: 'border-transparent bg-transparent text-ink-muted',
    hover: 'border-transparent bg-cream text-primary-press',
    pressed: 'border-transparent bg-line text-primary-press',
    disabled: 'border-transparent bg-transparent text-ink-muted',
  },
  danger: {
    default: 'border-transparent bg-error text-surface',
    hover: 'border-transparent bg-error-hover text-surface',
    pressed: 'border-transparent bg-error-press text-surface',
    disabled: 'border-transparent bg-line text-ink-muted',
  },
};

const STATE_LABELS: Record<FrozenState, string> = {
  default: 'Mặc định',
  hover: 'Hover',
  pressed: 'Nhấn',
  disabled: 'Vô hiệu',
};

const VARIANT_LABELS: Record<ButtonVariant, string> = {
  primary: 'Primary · primary → primary-hover → primary-press',
  secondary: 'Secondary · sand → sand-hover → sand-press',
  outline: 'Outline · transparent → sand-soft → primary-press',
  ghost: 'Ghost · transparent → cream → line',
  danger: 'Danger · error → error-hover → error-press',
};

export function ButtonShowcase() {
  return (
    <div className="mb-8">
      <p className="mb-1.5 text-[15px] font-bold text-ink">5a · Buttons — tương tác thật</p>
      <p className="mb-4 text-[13px] text-ink-muted">
        Di chuột / nhấn để thấy thay đổi màu. Mỗi trạng thái tối hơn rõ ràng.
      </p>
      <div className="mb-5 rounded-md border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Nút chính</Button>
          <Button variant="secondary">Nút phụ</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled variant="primary">
            Vô hiệu
          </Button>
        </div>
      </div>

      <p className="mb-3 text-sm font-semibold text-ink">
        So sánh trạng thái — mỗi bước tối hơn rõ ràng
      </p>
      {VARIANTS.map((variant) => (
        <div
          key={variant}
          className="mb-2.5 rounded-[10px] border border-line bg-surface px-5 py-4"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.06em] text-ink-muted">
            {VARIANT_LABELS[variant]}
          </p>
          <div className="flex flex-wrap items-start gap-5">
            {STATES.map((state) => (
              <div key={state} className="flex flex-col items-center gap-1.5">
                <button
                  className={cn(
                    'inline-flex cursor-default items-center rounded-[10px] border-[1.5px] px-[18px] py-[9px] text-[13px] font-semibold',
                    STATE_CLASSES[variant][state],
                  )}
                  disabled={state === 'disabled'}
                  type="button"
                >
                  {STATE_LABELS[state]}
                </button>
                <span className="text-[10px] text-ink-muted">{STATE_LABELS[state]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
