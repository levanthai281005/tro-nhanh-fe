import { X } from 'lucide-react';

export interface ActiveFilterChip {
  id: string;
  label: string;
}

export interface ActiveFilterChipsProps {
  chips: readonly ActiveFilterChip[];
  onRemove: (chipId: string) => void;
}

export function ActiveFilterChips({ chips, onRemove }: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap">
      {chips.map((chip) => (
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-sand-soft px-3 py-1.5 text-[13px] text-ink"
          key={chip.id}
        >
          {chip.label}
          <button
            aria-label={`Bỏ lọc ${chip.label}`}
            className="text-ink-muted transition-colors hover:text-primary"
            onClick={() => onRemove(chip.id)}
            type="button"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}
