export interface RoomDetailPageProps {
  listingId: string;
}

export function RoomDetailPage({ listingId }: RoomDetailPageProps) {
  return <div data-listing-id={listingId} data-testid="room-detail-page" />;
}
