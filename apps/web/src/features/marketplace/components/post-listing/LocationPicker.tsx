'use client';

import { Crosshair, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ListingLocationMap } from '@/features/marketplace/components/ListingLocationMap';

/** Trung tâm TP.HCM — chỉ dùng làm điểm khởi đầu khi chưa ghim gì. */
const DEFAULT_CENTER = { latitude: 10.7769, longitude: 106.7009 };

export interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number, longitude: number) => void;
}

/**
 * Ghim toạ độ cho tin đăng: bấm lên bản đồ hoặc kéo ghim.
 *
 * Không bắt buộc — địa chỉ chữ đã đủ để đăng tin. Nhưng có ghim thì người tìm trọ hình dung
 * được vị trí thật, nên vẫn mời đặt.
 */
export function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const hasPin = latitude !== null && longitude !== null;
  const displayLatitude = latitude ?? DEFAULT_CENTER.latitude;
  const displayLongitude = longitude ?? DEFAULT_CENTER.longitude;

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Trình duyệt không hỗ trợ định vị. Bạn bấm trực tiếp lên bản đồ nhé.');
      return;
    }

    setGeoError(null);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange(position.coords.latitude, position.coords.longitude);
        setIsLocating(false);
      },
      () => {
        setGeoError('Không lấy được vị trí. Bạn bấm trực tiếp lên bản đồ nhé.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8_000 },
    );
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted">
          <MapPin aria-hidden="true" className="size-3.5 text-sand" />
          {hasPin
            ? `Đã ghim: ${displayLatitude.toFixed(5)}, ${displayLongitude.toFixed(5)}`
            : 'Chưa ghim vị trí'}
        </span>

        <Button
          icon={<Crosshair aria-hidden="true" className="size-3.5" />}
          loading={isLocating}
          onClick={useCurrentLocation}
          size="sm"
          variant="outline"
        >
          Lấy vị trí hiện tại
        </Button>
      </div>

      <ListingLocationMap
        height={260}
        latitude={displayLatitude}
        longitude={displayLongitude}
        onPick={onChange}
        zoom={hasPin ? 16 : 13}
      />

      <p className="m-0 text-xs leading-relaxed text-ink-muted">
        Bấm lên bản đồ hoặc kéo ghim để chỉnh đúng vị trí phòng. Người tìm trọ sẽ thấy ghim này ở
        trang chi tiết.
      </p>

      {geoError ? (
        <p className="m-0 text-xs font-semibold text-error" role="alert">
          {geoError}
        </p>
      ) : null}
    </div>
  );
}
