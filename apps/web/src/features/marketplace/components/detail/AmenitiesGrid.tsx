import {
  Armchair,
  Bath,
  Car,
  Clock3,
  House,
  Layers3,
  PawPrint,
  Sparkles,
  Wifi,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';
import { DetailSection } from '@/features/marketplace/components/detail/Section';

export interface AmenitiesGridProps {
  detail: ListingDetailData;
}

const AMENITY_ICONS: Readonly<Record<string, LucideIcon>> = {
  wifi: Wifi,
  ac: Wind,
  parking: Car,
  bath: Bath,
  clock: Clock3,
  loft: Layers3,
  furniture: Armchair,
  pets: PawPrint,
};

export function AmenitiesGrid({ detail }: AmenitiesGridProps) {
  const { amenities } = detail.record;

  return (
    <DetailSection title="Tiện ích căn hộ">
      {amenities.length > 0 ? (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity) => {
            const Icon = AMENITY_ICONS[amenity.icon] ?? House;

            return (
              <div
                className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3.5 py-3"
                key={amenity.id}
              >
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-sand-soft text-primary">
                  <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
                </span>
                <span className="text-[13px] font-medium text-ink">{amenity.name}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-line bg-cream px-4 py-3 text-sm text-ink-muted">
          <Sparkles aria-hidden="true" className="size-4 text-sand" />
          Chủ nhà chưa cập nhật tiện ích cho tin này.
        </div>
      )}
    </DetailSection>
  );
}
