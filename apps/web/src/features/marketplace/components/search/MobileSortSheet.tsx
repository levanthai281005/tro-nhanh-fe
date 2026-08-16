import { Check } from 'lucide-react';
import { ModalShell } from '@/components/ui/ModalShell';
import type { ListingSort } from '@/features/marketplace/types/listings';
import { cn } from '@/utils/cn';

const SORT_OPTIONS: readonly { value: ListingSort; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp đến cao' },
  { value: 'price-desc', label: 'Giá cao đến thấp' },
  { value: 'area-desc', label: 'Diện tích lớn nhất' },
];

export interface MobileSortSheetProps {
  open: boolean;
  sort: ListingSort;
  onChange: (sort: ListingSort) => void;
  onClose: () => void;
}

export function MobileSortSheet({ open, sort, onChange, onClose }: MobileSortSheetProps) {
  if (!open) return null;

  return (
    <ModalShell footer={null} onClose={onClose} title="Sắp xếp theo" variant="bottom-sheet">
      <div className="-mx-6 -my-5">
        {SORT_OPTIONS.map((option) => {
          const isSelected = sort === option.value;
          return (
            <button
              className={cn(
                'flex min-h-12 w-full items-center justify-between px-6 text-left text-[15px] transition-colors hover:bg-cream',
                isSelected ? 'font-bold text-primary' : 'font-medium text-ink',
              )}
              key={option.value}
              onClick={() => {
                onChange(option.value);
                onClose();
              }}
              type="button"
            >
              {option.label}
              {isSelected ? <Check aria-hidden="true" className="size-5" /> : null}
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}
