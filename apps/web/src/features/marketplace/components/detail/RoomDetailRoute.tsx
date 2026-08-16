import { RoomDetailPage } from '@/features/marketplace/components/detail/RoomDetailPage';

export interface RoomDetailRouteProps {
  listingId: string;
}

export async function RoomDetailRoute({ listingId }: RoomDetailRouteProps) {
  return <RoomDetailPage listingId={listingId} />;
}
