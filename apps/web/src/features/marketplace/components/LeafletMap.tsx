'use client';

import { useEffect } from 'react';
import L from 'leaflet';
// Leaflet needs these engine styles to position its panes and OpenStreetMap tiles; Tailwind cannot replace them.
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  markerLabel?: string;
  zoom: number;
  height: number;
}

const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION = '&copy; OpenStreetMap contributors';

const listingMarkerIcon = L.divIcon({
  html: `
    <svg aria-hidden="true" focusable="false" height="40" viewBox="0 0 24 32" width="30" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#8A4A20" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="12" cy="12" fill="#FFFFFF" r="4.5"/>
    </svg>`,
  className: '',
  iconAnchor: [15, 40],
  iconSize: [30, 40],
});

function MapSizeInvalidator() {
  const map = useMap();

  useEffect(() => {
    const mapContainer = map.getContainer();
    const invalidateSize = () => {
      map.invalidateSize({ animate: false, pan: false });
    };
    const animationFrame = window.requestAnimationFrame(invalidateSize);

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.cancelAnimationFrame(animationFrame);
      };
    }

    const resizeObserver = new ResizeObserver(invalidateSize);
    resizeObserver.observe(mapContainer);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
}

/**
 * Private Leaflet adapter. Keep all provider-specific imports and lifecycle behavior here.
 */
export function LeafletMap({ latitude, longitude, markerLabel, zoom, height }: LeafletMapProps) {
  const center: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={center}
      className="size-full"
      scrollWheelZoom={false}
      style={{ height }}
      zoom={zoom}
      zoomControl={false}
    >
      <MapSizeInvalidator />
      <TileLayer attribution={OSM_ATTRIBUTION} maxZoom={19} url={OSM_TILE_URL} />
      <Marker icon={listingMarkerIcon} position={center} title={markerLabel} />
    </MapContainer>
  );
}
