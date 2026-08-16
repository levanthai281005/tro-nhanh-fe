'use client';

import { ArrowUpCircle, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ModalShell } from '@/components/ui/ModalShell';
import { useBoostPackages } from '@/features/marketplace/hooks/useMyListings';
import { cn } from '@/utils/cn';

export interface BoostListingDialogProps {
  listingTitle: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  onConfirm: (days: number) => void;
  onClose: () => void;
}

/**
 * Chọn gói đẩy tin nổi bật (BR-005).
 *
 * Giá đọc từ cấu hình nền tảng, không hardcode trong modal — prototype từng ghi cứng
 * "100.000đ / 7 ngày" lệch hẳn cấu hình thật. Hạn mới cũng do service tính (cộng dồn nếu
 * tin đang còn hạn), client chỉ gửi số ngày.
 *
 * AS-002: chưa có cổng thanh toán thật cho boost nên phải ghi rõ "(giả lập)".
 */
export function BoostListingDialog({
  listingTitle,
  isSubmitting,
  errorMessage,
  onConfirm,
  onClose,
}: BoostListingDialogProps) {
  const { data: packages = [], isPending } = useBoostPackages(true);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const effectiveDays = selectedDays ?? packages[0]?.days ?? null;

  return (
    <ModalShell
      footer={
        <>
          <Button disabled={isSubmitting} onClick={onClose} variant="outline">
            Hủy
          </Button>
          <Button
            data-testid="boost-confirm-btn"
            disabled={effectiveDays === null || isPending}
            loading={isSubmitting}
            onClick={() => effectiveDays !== null && onConfirm(effectiveDays)}
          >
            Xác nhận thanh toán (giả lập)
          </Button>
        </>
      }
      onClose={onClose}
      title="Đẩy tin nổi bật"
      variant="bottom-sheet"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-cream text-sand">
            <ArrowUpCircle aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="m-0 text-[13.5px] text-ink-muted">Tin đăng</p>
            <p className="m-0 text-sm font-bold text-ink">{listingTitle}</p>
          </div>
        </div>

        {errorMessage ? (
          <p
            className="m-0 rounded-sm border border-error px-3.5 py-2.5 text-sm font-semibold text-error"
            data-testid="boost-error"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.04em] text-ink-muted">
            Chọn thời hạn
          </p>

          {isPending ? (
            <p className="m-0 text-[13.5px] text-ink-muted">Đang tải gói đẩy tin...</p>
          ) : (
            <div className="flex flex-col gap-2" data-testid="boost-package-list">
              {packages.map((boostPackage) => {
                const isSelected = boostPackage.days === effectiveDays;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-md border-[1.5px] px-3.5 py-3 text-left transition-colors',
                      isSelected ? 'border-primary bg-cream' : 'border-line bg-surface',
                    )}
                    data-testid="boost-package-option"
                    key={boostPackage.days}
                    onClick={() => setSelectedDays(boostPackage.days)}
                    type="button"
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          'flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px]',
                          isSelected ? 'border-primary bg-primary' : 'border-line',
                        )}
                      >
                        {isSelected ? (
                          <Check
                            aria-hidden="true"
                            className="size-3 text-surface"
                            strokeWidth={3}
                          />
                        ) : null}
                      </span>
                      <span className="text-sm font-bold text-ink">
                        Nổi bật {boostPackage.days} ngày
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-extrabold text-primary">
                      {boostPackage.price.toLocaleString('vi-VN')}đ
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <p className="m-0 text-xs leading-relaxed text-ink-muted">
          Tin nổi bật được xếp trước trong mọi danh sách suốt thời hạn đã chọn. Nếu tin đang còn hạn
          nổi bật, thời hạn mới sẽ được <strong>cộng dồn</strong>. Thanh toán ở bước này là{' '}
          <strong>giả lập</strong> — chưa trừ tiền thật.
        </p>
      </div>
    </ModalShell>
  );
}
