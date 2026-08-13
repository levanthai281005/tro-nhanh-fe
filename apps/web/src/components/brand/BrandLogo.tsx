import type { HTMLAttributes } from 'react';

export interface BrandLogoProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo(props: BrandLogoProps) {
  void props;
  return null;
}
