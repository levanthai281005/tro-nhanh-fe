'use client';

import { useState } from 'react';
import { AppSelect } from '@/components/ui/AppSelect';
import { cn } from '@/utils/cn';

const DISTRICT_OPTIONS = [
  { label: 'Quận 1', value: 'quan-1' },
  { label: 'Quận 10', value: 'quan-10' },
  { label: 'Bình Thạnh', value: 'binh-thanh' },
];

export function FormShowcase() {
  const [district, setDistrict] = useState('');
  const [amenities, setAmenities] = useState(['Máy lạnh', 'Wifi']);
  const [propertyType, setPropertyType] = useState('Phòng trọ');

  const toggleAmenity = (amenity: string) => {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((currentAmenity) => currentAmenity !== amenity)
        : [...current, amenity],
    );
  };

  return (
    <div className="mb-8">
      <p className="mb-4 text-[15px] font-bold text-ink">5b · Form Components</p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6">
        <Field label="Input — Bình thường">
          <label className="mb-1.5 block text-[13px] font-semibold text-ink" htmlFor="guide-title">
            Tiêu đề tin
          </label>
          <input
            id="guide-title"
            className="w-full rounded-[10px] border-[1.5px] border-line bg-surface px-3 py-[9px] text-sm text-ink outline-none focus:border-sand"
            placeholder="Nhập tiêu đề bài đăng..."
          />
        </Field>

        <Field label="Input — Lỗi">
          <label
            className="mb-1.5 block text-[13px] font-semibold text-ink"
            htmlFor="guide-address"
          >
            Địa chỉ <span className="text-error">*</span>
          </label>
          <input
            id="guide-address"
            aria-invalid="true"
            className="w-full rounded-[10px] border-[1.5px] border-error bg-surface px-3 py-[9px] text-sm text-ink outline-none"
            defaultValue="123 đường"
          />
          <p className="mt-1 text-xs text-error">Địa chỉ không hợp lệ</p>
        </Field>

        <Field label="Select">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">Khu vực</span>
          <div className="rounded-[10px] border-[1.5px] border-line bg-surface px-3 py-[9px]">
            <AppSelect
              onChange={setDistrict}
              options={DISTRICT_OPTIONS}
              placeholder="Chọn quận / huyện"
              value={district}
            />
          </div>
        </Field>

        <Field label="Textarea">
          <label
            className="mb-1.5 block text-[13px] font-semibold text-ink"
            htmlFor="guide-description"
          >
            Mô tả chi tiết
          </label>
          <textarea
            id="guide-description"
            className="w-full resize-y rounded-[10px] border-[1.5px] border-line bg-surface px-3 py-[9px] text-sm text-ink outline-none focus:border-sand"
            placeholder="Mô tả phòng trọ của bạn..."
            rows={3}
          />
        </Field>

        <Field label="Range Slider">
          <p className="mb-1.5 text-[13px] font-semibold text-ink">
            Khoảng giá: <span className="text-primary">1M – 5M đ</span>
          </p>
          <input className="w-full accent-primary" defaultValue={5} max={10} min={0} type="range" />
          <div className="flex justify-between text-[11px] text-ink-muted">
            <span>1.000.000 đ</span>
            <span>10.000.000 đ</span>
          </div>
        </Field>

        <Field label="Checkbox">
          <p className="mb-2 text-[13px] font-semibold text-ink">Tiện ích</p>
          <div className="flex flex-col gap-2">
            {['Máy lạnh', 'Wifi', 'Gác lửng'].map((amenity) => {
              const isChecked = amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  aria-checked={isChecked}
                  className="flex items-center gap-2 text-left"
                  onClick={() => toggleAmenity(amenity)}
                  role="checkbox"
                  type="button"
                >
                  <span
                    className={cn(
                      'flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 text-[11px] font-bold leading-none',
                      isChecked
                        ? 'border-primary bg-primary text-surface'
                        : 'border-line bg-transparent',
                    )}
                  >
                    {isChecked ? '✓' : null}
                  </span>
                  <span className="text-[13px] text-ink">{amenity}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Radio">
          <p className="mb-2 text-[13px] font-semibold text-ink">Loại hình</p>
          <div className="flex flex-col gap-2">
            {['Tất cả', 'Phòng trọ', 'Căn hộ dịch vụ'].map((option) => {
              const isSelected = propertyType === option;
              return (
                <button
                  key={option}
                  aria-checked={isSelected}
                  className="flex items-center gap-2 text-left"
                  onClick={() => setPropertyType(option)}
                  role="radio"
                  type="button"
                >
                  <span
                    className={cn(
                      'flex size-[18px] shrink-0 items-center justify-center rounded-full border-2',
                      isSelected ? 'border-primary' : 'border-line',
                    )}
                  >
                    {isSelected ? <span className="size-2 rounded-full bg-primary" /> : null}
                  </span>
                  <span className="text-[13px] text-ink">{option}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Chip Multi-select">
          <p className="mb-2 text-[13px] font-semibold text-ink">Tiện ích</p>
          <div className="flex flex-wrap gap-2">
            {['Máy lạnh', 'Wifi', 'WC riêng', 'Để xe'].map((amenity) => {
              const isActive = amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border-[1.5px] px-3.5 py-1.5 text-xs',
                    isActive
                      ? 'border-primary bg-sand-soft font-bold text-primary-press'
                      : 'border-line bg-surface font-medium text-ink',
                  )}
                  onClick={() => toggleAmenity(amenity)}
                  type="button"
                >
                  {isActive ? <span className="text-[10px] font-black">✓</span> : null}
                  {amenity}
                </button>
              );
            })}
          </div>
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-ink-muted">
        {label}
      </span>
      {children}
    </div>
  );
}
