import { notFound } from 'next/navigation';
import { RoomDetailPage } from '@/features/marketplace/components/detail/RoomDetailPage';
import {
  getPublicListingDetail,
  getSimilarListings,
} from '@/features/marketplace/services/listingsService';

export interface RoomDetailRouteProps {
  listingId: string;
}

export async function RoomDetailRoute({ listingId }: RoomDetailRouteProps) {
  const detail = await getPublicListingDetail(listingId);

  if (!detail) notFound();

  const similarListings = await getSimilarListings(detail.record);

  return <RoomDetailPage detail={detail} similarListings={similarListings} />;
}
