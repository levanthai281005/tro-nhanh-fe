'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { StyleGuideSection } from '@/components/style-guide/StyleGuideSection';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export function OverlaySection() {
  const [amenities, setAmenities] = useState<string[]>([]);
  const toggleAmenity = (amenity: string) => {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((currentAmenity) => currentAmenity !== amenity)
        : [...current, amenity],
    );
  };

  return (
    <StyleGuideSection id="sec-7" title="7 · Overlays">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7">
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Bottom Sheet (Mobile filter)</p>
          <div className="max-w-[390px] overflow-hidden rounded-lg border border-line bg-canvas pt-[60px]">
            <div className="rounded-t-xl border border-line bg-surface px-5 pb-5 shadow-xl">
              <div className="mb-4 flex justify-center pt-3">
                <span className="h-1 w-10 rounded-full bg-sand" />
              </div>
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[17px] font-bold text-ink">Bộ lọc tìm kiếm</span>
                <button aria-label="Đóng bộ lọc" className="text-ink-muted" type="button">
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>
              <FilterGroup label="Khoảng giá">
                {['1–3 triệu', '3–5 triệu', '5–8 triệu', '> 8 triệu'].map((range) => (
                  <span
                    key={range}
                    className="rounded-full border-[1.5px] border-line px-3 py-1 text-xs text-ink"
                  >
                    {range}
                  </span>
                ))}
              </FilterGroup>
              <FilterGroup label="Tiện ích">
                {['Máy lạnh', 'Wifi', 'WC riêng', 'Chỗ để xe'].map((amenity) => {
                  const isActive = amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      className={cn(
                        'rounded-full border-[1.5px] px-3 py-1 text-xs',
                        isActive
                          ? 'border-primary bg-sand-soft text-primary-press'
                          : 'border-line bg-cream text-ink',
                      )}
                      onClick={() => toggleAmenity(amenity)}
                      type="button"
                    >
                      {amenity}
                    </button>
                  );
                })}
              </FilterGroup>
              <div className="flex gap-2.5">
                <Button fullWidth variant="outline">
                  Xóa lọc
                </Button>
                <Button fullWidth>Xem kết quả</Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink">
            Demo Banner — xuất hiện trên mọi trang
          </p>
          <div className="overflow-hidden rounded-[10px] border border-line">
            <div className="flex h-[34px] items-center justify-center bg-cream px-3 text-center">
              <span className="text-xs font-medium text-primary-press">
                Đây là sản phẩm demo để lấy feedback, tối ưu nhất khi xem trên giao diện web.
              </span>
            </div>
            <div className="flex gap-2.5 bg-surface p-4">
              <span className="h-10 flex-1 rounded-sm bg-canvas" />
              <span className="h-10 flex-[2] rounded-sm bg-canvas" />
              <span className="h-10 flex-1 rounded-sm bg-canvas" />
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-ink">Modal (Web) — xác nhận & form</p>
            <div className="rounded-xl border border-line bg-surface p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[17px] font-bold text-ink">Xác nhận</span>
                <button aria-label="Đóng modal" className="text-ink-muted" type="button">
                  <X aria-hidden="true" className="size-[18px]" />
                </button>
              </div>
              <p className="mb-5 text-sm leading-[1.6] text-ink-muted">
                Bạn có chắc muốn tiếp tục không?
              </p>
              <div className="flex gap-2.5">
                <Button fullWidth variant="ghost">
                  Hủy
                </Button>
                <Button fullWidth>Xác nhận</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyleGuideSection>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-[13px] font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
