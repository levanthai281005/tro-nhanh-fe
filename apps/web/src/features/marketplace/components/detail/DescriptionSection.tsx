import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';
import { DetailSection } from '@/features/marketplace/components/detail/Section';

export interface DescriptionSectionProps {
  detail: ListingDetailData;
}

export function DescriptionSection({ detail }: DescriptionSectionProps) {
  const description = detail.record.listing.description.trim();

  return (
    <DetailSection title="Thông tin mô tả">
      <div className="rounded-lg border border-line bg-surface px-5 py-4">
        <p className="whitespace-pre-line text-sm leading-7 text-ink">
          {description || 'Chủ nhà chưa bổ sung mô tả chi tiết cho phòng này.'}
        </p>
      </div>
    </DetailSection>
  );
}
