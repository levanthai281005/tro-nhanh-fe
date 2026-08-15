import Image from 'next/image';
import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface BrandLogoProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: { icon: 'size-6', text: 'text-base', gap: 'gap-2' },
  md: { icon: 'size-8', text: 'text-xl', gap: 'gap-2.5' },
  lg: { icon: 'size-10', text: 'text-2xl', gap: 'gap-2.5' },
} as const;

export function BrandLogo({
  variant = 'full',
  size = 'md',
  className,
  ...logoProps
}: BrandLogoProps) {
  const dimensions = SIZE_CLASSES[size];

  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap leading-none text-primary-press',
        dimensions.gap,
        className,
      )}
      {...logoProps}
    >
      <Image
        alt={variant === 'icon' ? 'Trọ Nhanh' : ''}
        className={cn('block shrink-0 object-contain', dimensions.icon)}
        height={40}
        src="/brand/tro-nhanh-logo-icon-transparent.png"
        width={40}
      />
      {variant === 'full' ? (
        <span className={cn('font-extrabold leading-none', dimensions.text)}>Trọ Nhanh</span>
      ) : null}
    </span>
  );
}
