'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PROPERTY_TYPES } from '@/features/marketplace/constants/catalog';
import { cn } from '@/utils/cn';

export interface QuickFilterChipsProps {
  className?: string;
}

const FILTER_CHIPS = ['Tất cả', ...PROPERTY_TYPES] as const;

export function QuickFilterChips({ className }: QuickFilterChipsProps) {
  const router = useRouter();
  const [activeChip, setActiveChip] = useState<(typeof FILTER_CHIPS)[number]>('Tất cả');

  return (
    <div
      className={cn(
        'flex w-full items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      data-testid="home-quick-filters"
    >
      {FILTER_CHIPS.map((chip) => {
        const isActive = chip === activeChip;
        return (
          <button
            key={chip}
            aria-pressed={isActive}
            className={cn(
              'shrink-0 whitespace-nowrap rounded-full border px-[18px] py-2 text-[13px] transition-colors',
              isActive
                ? 'border-primary bg-primary font-bold text-surface'
                : 'border-line bg-surface font-medium text-ink-muted hover:border-sand hover:bg-cream',
            )}
            onClick={() => {
              setActiveChip(chip);
              if (chip !== 'Tất cả') {
                router.push(`/tim-phong?type=${encodeURIComponent(chip)}`);
              }
            }}
            type="button"
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}
