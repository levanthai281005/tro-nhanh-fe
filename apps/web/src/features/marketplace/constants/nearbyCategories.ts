import {
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import type { ListingNearbyCategoryKey } from '@/features/marketplace/types/listingLocation';

export interface NearbyCategoryMeta {
  label: string;
  Icon: LucideIcon;
}

/**
 * Category labels and icons are shared taxonomy only. Named locations and their distances stay
 * on each listing's detail data; do not add a generic nearby-place fallback here.
 */
export const NEARBY_CATEGORY_META: Readonly<Record<ListingNearbyCategoryKey, NearbyCategoryMeta>> =
  {
    shopping: { label: 'Mua sắm & Giải trí', Icon: ShoppingBag },
    edu: { label: 'Giáo dục', Icon: GraduationCap },
    health: { label: 'Y tế', Icon: HeartPulse },
    food: { label: 'Ẩm thực', Icon: UtensilsCrossed },
  };
