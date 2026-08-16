'use client';

import dynamic from 'next/dynamic';
import { hasValidListingCoordinates } from '@/features/marketplace/utils/listingLocation';

export interface ListingLocationMapProps {
  latitude: number;
  longitude: number;
  markerLabel?: string;
  zoom?: number;
  height?: number;
}

const DEFAULT_MAP_HEIGHT = 220;
const DEFAULT_ZOOM = 16;
const MIN_ZOOM = 1;
const MAX_ZOOM = 19;

const LeafletMap = dynamic(
  () =>
    import('@/features/marketplace/components/LeafletMap').then(
      ({ LeafletMap: LeafletMapComponent }) => LeafletMapComponent,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        aria-busy="true"
        aria-label="Đang tải bản đồ vị trí"
        className="h-full w-full animate-pulse bg-sand-soft"
        role="status"
      />
    ),
  },
);

function normalizeHeight(height: number | undefined) {
  return typeof height === 'number' && Number.isFinite(height) && height > 0
    ? height
    : DEFAULT_MAP_HEIGHT;
}

function normalizeZoom(zoom: number | undefined) {
  if (typeof zoom !== 'number' || !Number.isFinite(zoom)) return DEFAULT_ZOOM;
  return Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
}

/**
 * Intent-only location map boundary for marketplace screens. The Leaflet implementation stays
 * behind this component so callers do not depend on a particular map provider.
 */
export function ListingLocationMap({
  latitude,
  longitude,
  markerLabel,
  zoom,
  height,
}: ListingLocationMapProps) {
  if (!hasValidListingCoordinates(latitude, longitude)) return null;

  const resolvedHeight = normalizeHeight(height);

  return (
    <div
      aria-label={markerLabel ? `Bản đồ vị trí: ${markerLabel}` : 'Bản đồ vị trí'}
      className="relative z-0 overflow-hidden rounded-lg border border-line bg-sand-soft"
      role="region"
      style={{ height: resolvedHeight }}
    >
      <LeafletMap
        height={resolvedHeight}
        latitude={latitude}
        longitude={longitude}
        markerLabel={markerLabel}
        zoom={normalizeZoom(zoom)}
      />
    </div>
  );
}
