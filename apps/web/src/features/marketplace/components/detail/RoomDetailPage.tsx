import { AlertTriangle } from 'lucide-react';
import type { ListingCardView } from '@/features/marketplace/types/listings';
import type { ListingDetailData } from '@/features/marketplace/types/listingDetail';
import { AmenitiesGrid } from '@/features/marketplace/components/detail/AmenitiesGrid';
import { CostTable } from '@/features/marketplace/components/detail/CostTable';
import { DescriptionSection } from '@/features/marketplace/components/detail/DescriptionSection';
import { ImageGallery } from '@/features/marketplace/components/detail/ImageGallery';
import { MobileContactCard } from '@/features/marketplace/components/detail/MobileContactCard';
import { MobileImageCarousel } from '@/features/marketplace/components/detail/MobileImageCarousel';
import { MobileNearbySection } from '@/features/marketplace/components/detail/MobileNearbySection';
import { NearbySection } from '@/features/marketplace/components/detail/NearbySection';
import { QuickStats } from '@/features/marketplace/components/detail/QuickStats';
import { ReviewsSection } from '@/features/marketplace/components/detail/ReviewsSection';
import { SimilarRooms } from '@/features/marketplace/components/detail/SimilarRooms';
import { StickyContactCard } from '@/features/marketplace/components/detail/StickyContactCard';
import { TitleBlock } from '@/features/marketplace/components/detail/TitleBlock';

export interface RoomDetailPageProps {
  detail: ListingDetailData;
  similarListings: readonly ListingCardView[];
  viewerId?: string;
}

function SafetyNotice() {
  return (
    <div className="flex gap-2.5 rounded-lg border border-line bg-surface p-4 text-xs leading-5 text-ink-muted">
      <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sand" />
      <p>
        Trọ Nhanh không tham gia giao dịch. Hãy gặp mặt và kiểm tra phòng trực tiếp trước khi đặt
        cọc hoặc chuyển tiền.
      </p>
    </div>
  );
}

export function RoomDetailPage({ detail, similarListings, viewerId }: RoomDetailPageProps) {
  const { listing, media } = detail.record;
  const images = media.map((item) => item.url).filter(Boolean);

  return (
    <main data-listing-id={listing.id} data-testid="room-detail-page">
      <div className="md:hidden">
        <MobileImageCarousel
          images={images}
          listingId={listing.id}
          title={listing.title}
          viewerId={viewerId}
        />
        <div className="mx-auto w-full max-w-[720px] px-4 pb-24 pt-5">
          <TitleBlock detail={detail} />
          <MobileContactCard detail={detail} viewerId={viewerId} />
          <DescriptionSection detail={detail} />
          <QuickStats detail={detail} />
          <AmenitiesGrid detail={detail} />
          <MobileNearbySection detail={detail} />
          <CostTable detail={detail} />
          <ReviewsSection detail={detail} />
          <SimilarRooms district={listing.district} listings={similarListings} />
          <SafetyNotice />
        </div>
      </div>

      <div className="hidden md:block">
        <div className="mx-auto w-full max-w-[1200px] px-8 py-8 lg:pb-16">
          <ImageGallery
            images={images}
            listingId={listing.id}
            title={listing.title}
            viewerId={viewerId}
          />
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">
              <TitleBlock detail={detail} />
              <DescriptionSection detail={detail} />
              <QuickStats detail={detail} />
              <AmenitiesGrid detail={detail} />
              <CostTable detail={detail} />
              <NearbySection detail={detail} />
              <ReviewsSection detail={detail} />
              <SimilarRooms district={listing.district} listings={similarListings} />
              <SafetyNotice />
            </div>
            <aside className="sticky top-24">
              <StickyContactCard detail={detail} viewerId={viewerId} />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
