'use client';

import { ChevronDown, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { NEARBY_CATEGORY_META } from '@/features/marketplace/constants/nearbyCategories';
import { inputClassName } from '@/features/marketplace/components/post-listing/FormField';
import type { ListingNearbyCategoryKey } from '@/features/marketplace/types/listingLocation';
import type { NearbyPlaceEntry } from '@/features/marketplace/types/postListing';
import { cn } from '@/utils/cn';

const CATEGORY_KEYS = Object.keys(NEARBY_CATEGORY_META) as ListingNearbyCategoryKey[];
const MAX_PLACES = 8;

export interface NearbyPlacesInputProps {
  value: NearbyPlaceEntry[];
  onChange: (next: NearbyPlaceEntry[]) => void;
}

/**
 * Nhập tiện ích xung quanh — hoàn toàn tùy chọn.
 *
 * **Thu gọn mặc định.** Bày sẵn bốn nhóm trống sẽ làm bước 1 phình lại đúng cái lỗi của
 * prototype (dồn quá nhiều trường vào màn hình đầu). Ai muốn thêm thì mở ra.
 *
 * Nhóm là danh mục dùng chung; **địa điểm cụ thể gắn theo từng tin**, không có danh sách mặc
 * định dùng chung cho mọi tin.
 */
export function NearbyPlacesInput({ value, onChange }: NearbyPlacesInputProps) {
  const [isOpen, setIsOpen] = useState(value.length > 0);

  const addPlace = () => {
    onChange([...value, { id: `nearby-${Date.now()}`, category: 'edu', name: '', distance: '' }]);
  };

  const updatePlace = (id: string, patch: Partial<NearbyPlaceEntry>) => {
    onChange(value.map((place) => (place.id === id ? { ...place, ...patch } : place)));
  };

  const removePlace = (id: string) => {
    onChange(value.filter((place) => place.id !== id));
  };

  if (!isOpen) {
    return (
      <button
        className="inline-flex w-fit items-center gap-1.5 rounded-sm border-[1.5px] border-dashed border-line px-3.5 py-2 text-[13px] font-semibold text-ink-muted transition-colors hover:border-primary hover:text-primary"
        data-testid="nearby-open-btn"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Plus aria-hidden="true" className="size-3.5" />
        Thêm địa điểm gần đây
        <ChevronDown aria-hidden="true" className="size-3.5" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2.5" data-testid="nearby-places-input">
      {value.map((place) => {
        const meta = NEARBY_CATEGORY_META[place.category];

        return (
          <div className="flex flex-wrap items-center gap-2" key={place.id}>
            <select
              aria-label="Nhóm địa điểm"
              className={cn(inputClassName, 'w-[170px] cursor-pointer')}
              onChange={(event) =>
                updatePlace(place.id, { category: event.target.value as ListingNearbyCategoryKey })
              }
              value={place.category}
            >
              {CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {NEARBY_CATEGORY_META[key].label}
                </option>
              ))}
            </select>

            <input
              aria-label={`Tên địa điểm thuộc nhóm ${meta.label}`}
              className={cn(inputClassName, 'flex-1 md:max-w-[260px]')}
              onChange={(event) => updatePlace(place.id, { name: event.target.value })}
              placeholder="VD: Đại học Bách Khoa"
              value={place.name}
            />

            <input
              aria-label="Khoảng cách"
              className={cn(inputClassName, 'w-[110px]')}
              onChange={(event) => updatePlace(place.id, { distance: event.target.value })}
              placeholder="VD: 700 m"
              value={place.distance}
            />

            <button
              aria-label={`Xóa địa điểm ${place.name || 'chưa đặt tên'}`}
              className="flex size-9 items-center justify-center rounded-sm border border-line text-ink-muted transition-colors hover:border-error hover:text-error"
              onClick={() => removePlace(place.id)}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        );
      })}

      {value.length < MAX_PLACES ? (
        <button
          className="inline-flex w-fit items-center gap-1.5 rounded-sm border-[1.5px] border-dashed border-line px-3.5 py-2 text-[13px] font-semibold text-ink-muted transition-colors hover:border-primary hover:text-primary"
          data-testid="nearby-add-btn"
          onClick={addPlace}
          type="button"
        >
          <Plus aria-hidden="true" className="size-3.5" />
          Thêm địa điểm
        </button>
      ) : null}
    </div>
  );
}
