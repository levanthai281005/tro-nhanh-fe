'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import {
  SectionCard,
  SectionFeedback,
} from '@/features/workspace/components/property-detail/SectionCard';
import { useSetPropertyPublicProfile } from '@/features/workspace/hooks/usePropertyDetail';
import type { Property } from '@/features/workspace/types/property';

/**
 * Hồ sơ khu công khai — BR-024.
 *
 * Trang khu public (A4) **chưa dựng**, nên đường dẫn xem trước chỉ hiện dạng chữ kèm nhãn
 * "sắp có" thay vì link — cùng cách xử lý với các mục nav chưa sẵn sàng.
 */
export function PropertyPublicSection({
  property,
  sellerId,
}: {
  property: Property;
  sellerId: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const setPublicProfile = useSetPropertyPublicProfile(property.id, sellerId);

  const isEnabled = property.isPublicProfileEnabled;
  // BR-024 + VALIDATION_RULES — bật public phải có tên và khu vực.
  const missingDistrict = property.district.trim() === '';

  const handleToggle = () => {
    setError(null);
    setSuccessMessage(null);

    setPublicProfile.mutate(!isEnabled, {
      onSuccess: () =>
        setSuccessMessage(
          isEnabled ? 'Đã tắt hồ sơ công khai.' : 'Đã bật hồ sơ công khai cho khu này.',
        ),
      onError: (mutationError) =>
        setError(
          mutationError instanceof Error ? mutationError.message : 'Chưa đổi được trạng thái.',
        ),
    });
  };

  return (
    <SectionCard
      description="Khi bật, khu trọ có một trang công khai hiển thị tên khu, khu vực, điểm đánh giá và các tin đang cho thuê."
      footer={
        <WriteGuardButton
          disabled={!isEnabled && missingDistrict}
          loading={setPublicProfile.isPending}
          onClick={handleToggle}
          surface="workspace"
          title={
            !isEnabled && missingDistrict
              ? 'Cần chọn khu vực ở khối Thông tin khu trọ trước'
              : undefined
          }
          variant={isEnabled ? 'outline' : 'primary'}
        >
          {isEnabled ? 'Tắt hồ sơ công khai' : 'Bật hồ sơ công khai'}
        </WriteGuardButton>
      }
      title="Hồ sơ công khai"
    >
      <SectionFeedback error={error} successMessage={successMessage} />

      <div className="flex items-start gap-3 rounded-sm border border-line bg-canvas px-3.5 py-3">
        <Star
          aria-hidden="true"
          className={
            isEnabled
              ? 'mt-px size-4 shrink-0 text-primary'
              : 'mt-px size-4 shrink-0 text-ink-muted'
          }
        />
        <div className="min-w-0">
          <p className="m-0 text-[13.5px] font-bold text-ink">
            {isEnabled ? 'Đang hiển thị công khai' : 'Chưa hiển thị công khai'}
          </p>
          {isEnabled && property.publicSlug ? (
            <p className="m-0 mt-1 text-[13px] text-ink-muted">
              Đường dẫn:{' '}
              <span className="font-medium text-ink">/khu-tro/{property.publicSlug}</span>
              <span className="ml-2 text-[10.5px] font-bold uppercase tracking-wide text-ink-muted">
                trang xem · sắp có
              </span>
            </p>
          ) : null}
          {property.reviewCount > 0 ? (
            <p className="m-0 mt-1 text-[13px] text-ink-muted">
              Khu này có <strong className="text-ink">{property.reviewCount} đánh giá</strong>
              {property.avgRating !== null ? <> · {property.avgRating}/5 sao</> : null}.
            </p>
          ) : null}
        </div>
      </div>

      {/* Nói rõ tắt public KHÔNG mất đánh giá — nếu không, chủ trọ nhận một đánh giá xấu sẽ
          tắt đi vì tưởng là xóa được, rồi ngạc nhiên khi bật lại thấy nó còn nguyên. */}
      <p className="m-0 text-[13px] leading-relaxed text-ink-muted">
        Tắt hồ sơ công khai chỉ <strong className="text-ink">ẩn</strong> trang khu và điểm đánh giá.
        Các đánh giá vẫn được giữ lại và sẽ hiện lại nếu bạn bật trở lại. Trang công khai không bao
        giờ hiển thị dữ liệu vận hành: người ở, hợp đồng, hóa đơn hay doanh thu.
      </p>

      {missingDistrict ? (
        <p className="m-0 rounded-sm border border-warning bg-warning-soft px-3.5 py-2.5 text-[13px] font-semibold text-warning">
          Cần chọn khu vực cho khu trọ ở khối phía trên trước khi bật hồ sơ công khai.
        </p>
      ) : null}
    </SectionCard>
  );
}
