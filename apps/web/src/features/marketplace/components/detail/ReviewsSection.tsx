import { MessageCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';
import { DetailSection } from '@/features/marketplace/components/detail/Section';

export interface ReviewsSectionProps {
  detail: ListingDetailData;
}

export function ReviewsSection({ detail }: ReviewsSectionProps) {
  // TODO(v1): khi API Review + Occupancy verification sẵn sàng, render review Visible ở đây.
  // MVP cố ý chỉ render trạng thái rỗng; không suy diễn điểm/số sao từ dữ liệu mẫu.
  void detail;

  return (
    <DetailSection title="Đánh giá khu trọ">
      <EmptyState
        className="rounded-lg border border-dashed border-line bg-cream py-6"
        description="Chỉ người đã ở và xác nhận liên kết mới đánh giá được, nên đánh giá ở đây ít nhưng đáng tin."
        icon={<MessageCircle aria-hidden="true" className="size-6" />}
        title="Chưa có đánh giá cho khu trọ này"
      />
    </DetailSection>
  );
}
