import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SurfaceGate } from '@/features/session/components/SurfaceGate';
import { MOCK_USER_ID } from '@/features/session/constants/mockSessionContext';
import { RoomsPage } from '@/features/workspace/components/rooms/RoomsPage';
import {
  PROPERTY_QUERY_KEYS,
  ROOM_QUERY_KEYS,
} from '@/features/workspace/constants/workspaceQueryKeys';
import { getProperties, getPropertyById } from '@/features/workspace/services/propertiesService';
import { getRoomsByProperty } from '@/features/workspace/services/roomsService';

interface RoomsRouteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RoomsRouteProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  return { title: property ? `Phòng · ${property.name}` : 'Quản lý phòng' };
}

/** B8 — quản lý phòng của một khu. `SCREENS_WORKSPACE.md`, Surface Workspace. */
export default async function RoomsRoute({ params }: RoomsRouteProps) {
  const { id } = await params;
  // TODO: nối AuthContext khi có; thay mock id bằng user.id từ session đã xác thực.
  const sellerId = MOCK_USER_ID;

  const property = await getPropertyById(id);
  // BR-007 — dữ liệu SaaS riêng tư tuyệt đối theo `sellerId`. Không phải chỉ ẩn nút: gõ thẳng
  // id khu của người khác vào URL cũng phải ra 404, không được lộ cả tên khu.
  if (!property || property.sellerId !== sellerId) notFound();

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ROOM_QUERY_KEYS.byProperty(id),
      queryFn: () => getRoomsByProperty(id),
    }),
    queryClient.prefetchQuery({
      queryKey: PROPERTY_QUERY_KEYS.list(sellerId),
      queryFn: () => getProperties(sellerId),
    }),
  ]);

  return (
    <SurfaceGate surface="workspace">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RoomsPage propertyId={id} propertyName={property.name} sellerId={sellerId} />
      </HydrationBoundary>
    </SurfaceGate>
  );
}
