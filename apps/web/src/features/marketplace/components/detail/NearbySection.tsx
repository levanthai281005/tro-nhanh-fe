import { MapPin } from 'lucide-react';
import { ListingLocationMap } from '@/features/marketplace/components/ListingLocationMap';
import { NEARBY_CATEGORY_META } from '@/features/marketplace/constants/nearbyCategories';
import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';
import { hasValidListingCoordinates } from '@/features/marketplace/utils/listingLocation';
import { DetailSection } from '@/features/marketplace/components/detail/Section';

export interface NearbySectionProps {
  detail: ListingDetailData;
}

export function NearbySection({ detail }: NearbySectionProps) {
  const { location, record } = detail;
  if (!location) return null;

  const categories = location.nearbyPlaces.filter((category) => category.places.length > 0);
  const hasMap = hasValidListingCoordinates(location.latitude, location.longitude);
  if (categories.length === 0 && !hasMap) return null;

  const mapLabel = [record.listing.address, record.listing.district].filter(Boolean).join(', ');

  return (
    <DetailSection title="Vị trí & Tiện ích xung quanh">
      {categories.length > 0 ? (
        <div className="mb-[18px] grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            const { Icon, label } = NEARBY_CATEGORY_META[category.key];

            return (
              <section
                className="rounded-lg border border-line bg-surface px-[18px] py-4"
                key={category.key}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-sand-soft text-primary">
                    <Icon aria-hidden="true" className="size-[15px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="text-[13px] font-bold text-ink">{label}</h3>
                </div>
                <ul className="space-y-[7px]">
                  {category.places.map((place) => (
                    <li className="flex items-center justify-between gap-2" key={place.name}>
                      <span className="truncate text-[13px] text-ink-muted">{place.name}</span>
                      <span className="shrink-0 rounded-full bg-sand-soft px-2.5 py-0.5 text-xs font-semibold text-sand">
                        {place.distance}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : null}

      {hasMap ? (
        <div className="flex flex-col gap-1.5">
          <ListingLocationMap
            height={220}
            latitude={location.latitude}
            longitude={location.longitude}
            markerLabel={mapLabel}
            zoom={16}
          />
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
            <MapPin aria-hidden="true" className="size-3 shrink-0" />
            {mapLabel}
          </span>
        </div>
      ) : null}
    </DetailSection>
  );
}
