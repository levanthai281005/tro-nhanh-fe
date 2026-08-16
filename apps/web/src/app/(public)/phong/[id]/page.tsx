import type { Metadata } from 'next';
import { RoomDetailRoute } from '@/features/marketplace/components/detail/RoomDetailRoute';

export const metadata: Metadata = {
  title: 'Chi tiết phòng',
};

interface RoomDetailRoutePageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomDetailRoutePage({ params }: RoomDetailRoutePageProps) {
  const { id } = await params;

  return <RoomDetailRoute listingId={id} />;
}
