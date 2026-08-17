import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SurfaceGate } from '@/features/session/components/SurfaceGate';
import { MOCK_USER_ID } from '@/features/session/constants/mockSessionContext';
import { OccupancyPage } from '@/features/workspace/components/occupancy/OccupancyPage';
import { OCCUPANCY_QUERY_KEYS } from '@/features/workspace/constants/workspaceQueryKeys';
import { getOccupancies } from '@/features/workspace/services/occupanciesService';
import { getPropertyById } from '@/features/workspace/services/propertiesService';
import { getRoomById } from '@/features/workspace/services/roomsService';

interface OccupancyRouteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OccupancyRouteProps): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoomById(id);

  return { title: room ? `Người ở · Phòng ${room.roomCode}` : 'Quản lý người ở' };
}

/** B10 — quản lý người ở của một phòng. `SCREENS_WORKSPACE.md`, Surface Workspace. */
export default async function OccupancyRoute({ params }: OccupancyRouteProps) {
  const { id } = await params;
  // TODO: nối AuthContext khi có; thay mock id bằng user.id từ session đã xác thực.
  const sellerId = MOCK_USER_ID;

  const room = await getRoomById(id);
  const property = room ? await getPropertyById(room.propertyId) : null;
  // BR-007 — quyền sở hữu kiểm qua khu chứa phòng. Gõ thẳng id phòng của người khác vào URL
  // cũng phải ra 404, không lộ cả mã phòng.
  if (!room || !property || property.sellerId !== sellerId) notFound();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: OCCUPANCY_QUERY_KEYS.byRoom(id),
    queryFn: () => getOccupancies(id),
  });

  return (
    <SurfaceGate surface="workspace">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <OccupancyPage
          propertyId={property.id}
          propertyName={property.name}
          roomCode={room.roomCode}
          roomId={id}
        />
      </HydrationBoundary>
    </SurfaceGate>
  );
}
