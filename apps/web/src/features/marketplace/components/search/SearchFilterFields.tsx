import { AREA_RANGES, AMENITIES, PRICE_RANGES, PROPERTY_TYPE_OPTIONS } from '@/features/marketplace/constants/catalog';
import type { ListingSearchFilters } from '@/features/marketplace/types/listings';
import { cn } from '@/utils/cn';

export interface SearchFilterFieldsProps {
  filters: ListingSearchFilters;
  onChange: (filters: ListingSearchFilters) => void;
}

export function SearchFilterFields({ filters, onChange }: SearchFilterFieldsProps) {
  const togglePropertyType = (propertyType: (typeof PROPERTY_TYPE_OPTIONS)[number]['value']) => {
    const propertyTypes = filters.propertyTypes.includes(propertyType)
      ? filters.propertyTypes.filter((value) => value !== propertyType)
      : [...filters.propertyTypes, propertyType];
    onChange({ ...filters, propertyTypes });
  };
  const toggleAmenity = (amenity: string) => {
    const amenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((value) => value !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities });
  };

  return (
    <div className="space-y-5">
      <FilterGroup title="Khu vực hoặc từ khóa">
        <input
          className="h-10 w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink outline-none transition focus:border-sand"
          onChange={(event) => onChange({ ...filters, keyword: event.target.value })}
          placeholder="Quận 7, trường học..."
          value={filters.keyword}
        />
      </FilterGroup>

      <FilterGroup title="Khoảng giá">
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((range) => (
            <FilterChip
              active={filters.priceRange === range}
              key={range}
              label={range}
              onClick={() =>
                onChange({ ...filters, priceRange: filters.priceRange === range ? '' : range })
              }
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Loại hình">
        <div className="space-y-2.5">
          {PROPERTY_TYPE_OPTIONS.map(({ label, value }) => {
            const isChecked = filters.propertyTypes.includes(value);
            return (
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink" key={value}>
                <input
                  checked={isChecked}
                  className="size-4 accent-primary"
                  onChange={() => togglePropertyType(value)}
                  type="checkbox"
                />
                {label}
              </label>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Diện tích">
        <div className="flex flex-wrap gap-2">
          {AREA_RANGES.map((range) => (
            <FilterChip
              active={filters.areaRange === range}
              key={range}
              label={range}
              onClick={() =>
                onChange({ ...filters, areaRange: filters.areaRange === range ? '' : range })
              }
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Tiện ích">
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((amenity) => (
            <FilterChip
              active={filters.amenities.includes(amenity)}
              key={amenity}
              label={amenity}
              onClick={() => toggleAmenity(amenity)}
            />
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line pb-5 last:border-b-0 last:pb-0">
      <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted">
        {title}
      </h3>
      {children}
    </section>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-surface'
          : 'border-line bg-surface text-ink-muted hover:border-sand hover:bg-cream',
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
