import { MapPin } from 'lucide-react';
import { ListingLocationMap } from '@/features/marketplace/components/ListingLocationMap';
import { NEARBY_CATEGORY_META } from '@/features/marketplace/constants/nearbyCategories';
import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';
import { hasValidListingCoordinates } from '@/features/marketplace/utils/listingLocation';
import { DetailSection } from '@/features/marketplace/components/detail/Section';

export interface MobileNearbySectionProps {
  detail: ListingDetailData;
}

export function MobileNearbySection({ detail }: MobileNearbySectionProps) {
  const { location, record } = detail;
  if (!location) return null;

  const categories = location.nearbyPlaces.filter((category) => category.places.length > 0);
  const hasMap = hasValidListingCoordinates(location.latitude, location.longitude);
  if (categories.length === 0 && !hasMap) return null;

  const mapLabel = [record.listing.address, record.listing.district].filter(Boolean).join(', ');

  return (
    <DetailSection title="Vị trí & Tiện ích xung quanh">
      {categories.length > 0 ? (
        <div className="mb-3.5 space-y-2.5">
          {categories.map((category) => {
            const { Icon, label } = NEARBY_CATEGORY_META[category.key];

            return (
              <section
                className="rounded-lg border border-line bg-surface px-[15px] py-[13px]"
                key={category.key}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-sand-soft text-primary">
                    <Icon aria-hidden="true" className="size-[13px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="text-[13px] font-bold text-ink">{label}</h3>
                </div>
                <ul className="space-y-1.5">
                  {category.places.map((place) => (
                    <li className="flex items-center justify-between gap-2" key={place.name}>
                      <span className="truncate text-xs text-ink-muted">{place.name}</span>
                      <span className="shrink-0 rounded-full bg-sand-soft px-2 py-0.5 text-[11px] font-semibold text-sand">
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
            height={180}
            latitude={location.latitude}
            longitude={location.longitude}
            markerLabel={mapLabel}
            zoom={15}
          />
          <span className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-muted">
            <MapPin aria-hidden="true" className="size-[11px] shrink-0" />
            {mapLabel}
          </span>
        </div>
      ) : null}
    </DetailSection>
  );
}
