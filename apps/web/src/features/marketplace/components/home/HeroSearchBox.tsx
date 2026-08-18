'use client';

import { Banknote, Building2, MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { SearchField } from '@/features/marketplace/components/home/SearchField';
import { PRICE_RANGES, PROPERTY_TYPES } from '@/features/marketplace/constants/catalog';

export interface HeroSearchBoxProps {
  variant: 'mobile' | 'desktop';
}

export function HeroSearchBox({ variant }: HeroSearchBoxProps) {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('loc', location.trim());
    if (propertyType) params.set('type', propertyType);
    if (priceRange) params.set('price', priceRange);
    const query = params.toString();
    router.push(query ? `/tim-phong?${query}` : '/tim-phong');
  };

  if (variant === 'mobile') {
    return (
      <form
        className="overflow-hidden rounded-xl bg-surface shadow-xl"
        data-testid="hero-search-mobile"
        onSubmit={handleSubmit}
      >
        <SearchField
          icon={<MapPin className="size-[15px]" />}
          label="Vị trí"
          onChange={setLocation}
          placeholder="Quận 7, TP.HCM"
          showDivider
          value={location}
        />
        <SearchField
          icon={<Building2 className="size-[15px]" />}
          isSelect
          label="Loại phòng"
          onChange={setPropertyType}
          options={PROPERTY_TYPES}
          placeholder="Tất cả loại phòng"
          showDivider
          value={propertyType}
        />
        <SearchField
          icon={<Banknote className="size-[15px]" />}
          isSelect
          label="Giá thuê"
          onChange={setPriceRange}
          options={PRICE_RANGES}
          placeholder="Tất cả mức giá"
          value={priceRange}
        />
        <div className="p-3">
          <button
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-[15px] font-bold text-surface shadow-md transition hover:bg-primary-hover active:bg-primary-press"
            type="submit"
          >
            <Search aria-hidden="true" className="size-[18px]" />
            Tìm kiếm
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      className="flex h-[66px] items-stretch overflow-hidden rounded-xl border border-line bg-surface shadow-lg"
      data-testid="hero-search-desktop"
      onSubmit={handleSubmit}
    >
      <SearchField
        icon={<MapPin className="size-[15px]" />}
        label="Vị trí"
        onChange={setLocation}
        placeholder="Quận 7, TP.HCM"
        showDivider
        value={location}
      />
      <SearchField
        icon={<Building2 className="size-[15px]" />}
        isSelect
        label="Loại phòng"
        onChange={setPropertyType}
        options={PROPERTY_TYPES}
        placeholder="Tất cả loại phòng"
        showDivider
        value={propertyType}
      />
      <SearchField
        icon={<Banknote className="size-[15px]" />}
        isSelect
        label="Khoảng giá"
        onChange={setPriceRange}
        options={PRICE_RANGES}
        placeholder="Tất cả mức giá"
        value={priceRange}
      />
      <div className="flex shrink-0 items-center py-2 pl-1 pr-2.5">
        <button
          className="flex h-full items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-[22px] text-[13.5px] font-bold text-surface shadow-md transition hover:-translate-y-px hover:bg-primary-hover active:bg-primary-press"
          type="submit"
        >
          <Search aria-hidden="true" className="size-4" strokeWidth={2.5} />
          Tìm kiếm
        </button>
      </div>
    </form>
  );
}
