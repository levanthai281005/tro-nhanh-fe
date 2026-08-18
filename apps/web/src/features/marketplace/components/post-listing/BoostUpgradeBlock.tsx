'use client';

import { Check, Star, TrendingUp } from 'lucide-react';
import { useBoostPackages } from '@/features/marketplace/hooks/useMyListings';
import { cn } from '@/utils/cn';

export interface BoostUpgradeBlockProps {
  isEnabled: boolean;
  selectedDays: number;
  onToggle: (isEnabled: boolean) => void;
  onSelectDays: (days: number) => void;
}

/**
 * Đăng ký đẩy tin nổi bật ngay lúc đăng.
 *
 * BR-005 chỉ cho boost tin `Active`, mà tin vừa gửi thì đang `PendingApproval` — nên đây là
 * **đăng ký trước**, hệ thống áp dụng sau khi duyệt. Phải nói rõ điều này trên giao diện, nếu
 * không chủ trọ sẽ thắc mắc vì sao trả tiền rồi mà tin chưa nổi bật.
 *
 * Giá và số ngày đọc từ cấu hình nền tảng (`PUT /admin/boost-config`), không hardcode.
 * AS-002: chưa có cổng thanh toán thật nên ghi rõ "(giả lập)".
 */
export function BoostUpgradeBlock({
  isEnabled,
  selectedDays,
  onToggle,
  onSelectDays,
}: BoostUpgradeBlockProps) {
  const { data: packages = [], isPending } = useBoostPackages(true);
  const activePackage = packages.find((item) => item.days === selectedDays) ?? packages[0];

  return (
    <div
      className={cn(
        'flex flex-col gap-3.5 rounded-lg border-2 p-5 transition-colors',
        isEnabled ? 'border-primary bg-warning-soft' : 'border-line bg-surface',
      )}
      data-testid="boost-upgrade-block"
    >
      <label className="flex cursor-pointer items-start gap-3">
        <input
          checked={isEnabled}
          className="mt-0.5 size-[18px] shrink-0 accent-primary"
          data-testid="boost-toggle"
          onChange={(event) => onToggle(event.target.checked)}
          type="checkbox"
        />
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-extrabold text-ink">Nâng cấp tin VIP nổi bật</span>
            <span className="rounded-full bg-accent-warn px-2 py-0.5 text-[10px] font-extrabold text-surface">
              Nổi bật
            </span>
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-ink-muted">
            Tin của bạn được ưu tiên hiển thị trước trong kết quả tìm kiếm và trang chủ.{' '}
            <strong className="text-ink">Áp dụng ngay khi tin được duyệt.</strong>
          </span>
        </span>
      </label>

      {isEnabled ? (
        <div className="flex flex-col gap-2.5 border-t border-line/70 pt-3.5">
          {isPending ? (
            <p className="m-0 text-[13px] text-ink-muted">Đang tải gói đẩy tin...</p>
          ) : (
            <div className="flex flex-wrap gap-2" data-testid="boost-package-options">
              {packages.map((boostPackage) => {
                const isSelected = boostPackage.days === activePackage?.days;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={cn(
                      'flex items-center gap-2 rounded-md border-[1.5px] px-3.5 py-2 text-[13px] transition-colors',
                      isSelected
                        ? 'border-primary bg-surface font-bold text-primary'
                        : 'border-line bg-surface text-ink-muted hover:border-primary',
                    )}
                    key={boostPackage.days}
                    onClick={() => onSelectDays(boostPackage.days)}
                    type="button"
                  >
                    <span
                      className={cn(
                        'flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px]',
                        isSelected ? 'border-primary bg-primary' : 'border-line',
                      )}
                    >
                      {isSelected ? (
                        <Check
                          aria-hidden="true"
                          className="size-2.5 text-surface"
                          strokeWidth={3}
                        />
                      ) : null}
                    </span>
                    {boostPackage.days} ngày · {boostPackage.price.toLocaleString('vi-VN')}đ
                  </button>
                );
              })}
            </div>
          )}

          <ul className="m-0 flex flex-wrap gap-x-5 gap-y-1.5 p-0 text-xs text-ink-muted">
            <li className="inline-flex list-none items-center gap-1.5">
              <Star aria-hidden="true" className="size-3.5 fill-accent-warn text-accent-warn" />
              Huy hiệu VIP trên thẻ tin
            </li>
            <li className="inline-flex list-none items-center gap-1.5">
              <TrendingUp aria-hidden="true" className="size-3.5 text-status-available" />
              Xếp trước trong mọi danh sách
            </li>
          </ul>

          {activePackage ? (
            <p className="m-0 text-xs text-ink-muted">
              Phí dịch vụ:{' '}
              <strong className="text-ink">{activePackage.price.toLocaleString('vi-VN')}đ</strong>{' '}
              cho {activePackage.days} ngày — thanh toán <strong>giả lập</strong>, chưa trừ tiền
              thật.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
