'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
// Leaflet needs these engine styles to position its panes and OpenStreetMap tiles; Tailwind cannot replace them.
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  markerLabel?: string;
  zoom: number;
  height: number;
  /** Có mặt thì bản đồ cho chọn toạ độ: bấm lên bản đồ hoặc kéo ghim. */
  onPick?: (latitude: number, longitude: number) => void;
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

function MapClickHandler({ onPick }: { onPick: (latitude: number, longitude: number) => void }) {
  useMapEvents({
    click: (event) => onPick(event.latlng.lat, event.latlng.lng),
  });

  return null;
}

/** Sai số bỏ qua khi so hai toạ độ — đủ nhỏ để không lẫn hai vị trí khác nhau. */
const COORDINATE_EPSILON = 1e-7;

/**
 * Dời khung nhìn khi toạ độ đổi **từ bên ngoài** bản đồ, ví dụ nút "Lấy vị trí hiện tại".
 *
 * `MapContainer` chỉ đọc `center` lúc gắn lần đầu; đổi prop sau đó không làm bản đồ dời, nên
 * ghim nhảy ra ngoài khung và trông như không có gì xảy ra.
 *
 * Chỉ dời khi vị trí mới khác chỗ bản đồ đang nhìn: bấm chọn một điểm ngay trên bản đồ thì
 * điểm đó vốn đã trong tầm mắt, dời nữa sẽ giật khung một cách vô cớ.
 */
function MapViewSync({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  const lastSyncedRef = useRef<[number, number]>([latitude, longitude]);

  useEffect(() => {
    const [lastLatitude, lastLongitude] = lastSyncedRef.current;
    const isSamePoint =
      Math.abs(lastLatitude - latitude) < COORDINATE_EPSILON &&
      Math.abs(lastLongitude - longitude) < COORDINATE_EPSILON;

    if (isSamePoint) return;

    lastSyncedRef.current = [latitude, longitude];

    // Điểm mới đã nằm trong khung thì người dùng vẫn thấy ghim — không cần dời.
    if (map.getBounds().contains([latitude, longitude])) return;

    map.setView([latitude, longitude], map.getZoom(), { animate: true });
  }, [latitude, longitude, map]);

  return null;
}

/**
 * Private Leaflet adapter. Keep all provider-specific imports and lifecycle behavior here.
 */
export function LeafletMap({
  latitude,
  longitude,
  markerLabel,
  zoom,
  height,
  onPick,
}: LeafletMapProps) {
  const center: [number, number] = [latitude, longitude];
  const isPickable = Boolean(onPick);

  return (
    <MapContainer
      center={center}
      className="size-full"
      // Bản đồ chỉ xem thì khoá cuộn để người dùng cuộn trang qua nó không bị kẹt lại phóng
      // to bản đồ; bản đồ ghim thì cần cuộn để zoom mà chọn cho chính xác.
      scrollWheelZoom={isPickable}
      style={{ height }}
      zoom={zoom}
      zoomControl={isPickable}
    >
      <MapSizeInvalidator />
      <MapViewSync latitude={latitude} longitude={longitude} />
      <TileLayer attribution={OSM_ATTRIBUTION} maxZoom={19} url={OSM_TILE_URL} />
      {onPick ? <MapClickHandler onPick={onPick} /> : null}
      <Marker
        draggable={isPickable}
        eventHandlers={
          onPick
            ? {
                dragend: (event) => {
                  const { lat, lng } = event.target.getLatLng();
                  onPick(lat, lng);
                },
              }
            : undefined
        }
        icon={listingMarkerIcon}
        position={center}
        title={markerLabel}
      />
    </MapContainer>
  );
}
