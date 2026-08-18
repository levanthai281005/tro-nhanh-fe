import type { ReactNode } from 'react';
import { AppSelect } from '@/components/ui/AppSelect';
import { cn } from '@/utils/cn';

export interface SearchFieldProps {
  icon: ReactNode;
  isSelect?: boolean;
  label: string;
  onChange: (value: string) => void;
  options?: readonly string[];
  placeholder: string;
  showDivider?: boolean;
  value: string;
}

export function SearchField({
  icon,
  isSelect = false,
  label,
  onChange,
  options = [],
  placeholder,
  showDivider = false,
  value,
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col justify-center px-4 py-3',
        showDivider && 'border-b border-line md:border-b-0 md:border-r',
      )}
    >
      <label className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.07em] text-ink-muted">
        {label}
      </label>
      <div className="flex min-w-0 items-center gap-2">
        <span aria-hidden="true" className="shrink-0 text-sand">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          {isSelect ? (
            <AppSelect
              data-testid={`hero-${label.toLowerCase().replaceAll(' ', '-')}`}
              onChange={onChange}
              options={options.map((option) => ({ label: option, value: option }))}
              placeholder={placeholder}
              value={value}
            />
          ) : (
            <input
              aria-label={label}
              className="w-full border-0 bg-transparent p-0 text-[15px] text-ink outline-none placeholder:text-ink-muted/60 md:text-[14.5px]"
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              value={value}
            />
          )}
        </div>
      </div>
    </div>
  );
}
