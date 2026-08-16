import type {
  AreaRange,
  PriceRange,
} from '@/features/marketplace/types/listings';

export function matchesPriceRange(price: number, range: PriceRange | '') {
  switch (range) {
    case 'Dưới 2 triệu':
      return price < 2_000_000;
    case '2 – 4 triệu':
      return price >= 2_000_000 && price <= 4_000_000;
    case '4 – 6 triệu':
      return price > 4_000_000 && price <= 6_000_000;
    case 'Trên 6 triệu':
      return price > 6_000_000;
    default:
      return true;
  }
}

export function matchesAreaRange(area: number, range: AreaRange | '') {
  switch (range) {
    case 'Dưới 20 m²':
      return area < 20;
    case '20 – 30 m²':
      return area >= 20 && area < 30;
    case '30 – 45 m²':
      return area >= 30 && area < 45;
    case 'Trên 45 m²':
      return area >= 45;
    default:
      return true;
  }
}
