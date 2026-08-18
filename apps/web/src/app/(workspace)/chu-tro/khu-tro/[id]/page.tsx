import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SurfaceGate } from '@/features/session/components/SurfaceGate';
import { MOCK_USER_ID } from '@/features/session/constants/mockSessionContext';
import { PropertyDetailPage } from '@/features/workspace/components/property-detail/PropertyDetailPage';
import {
  PROPERTY_QUERY_KEYS,
  ROOM_QUERY_KEYS,
} from '@/features/workspace/constants/workspaceQueryKeys';
import { getPropertyById } from '@/features/workspace/services/propertiesService';
import { getRoomsByProperty } from '@/features/workspace/services/roomsService';

interface PropertyDetailRouteProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PropertyDetailRouteProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  return { title: property ? `Cài đặt · ${property.name}` : 'Cài đặt khu trọ' };
}

/** B7 — chi tiết khu + nhận tiền + hồ sơ công khai. `SCREENS_WORKSPACE.md`, Surface Workspace. */
export default async function PropertyDetailRoute({ params }: PropertyDetailRouteProps) {
  const { id } = await params;
  // TODO: nối AuthContext khi có; thay mock id bằng user.id từ session đã xác thực.
  const sellerId = MOCK_USER_ID;

  const property = await getPropertyById(id);
  // BR-007 — gõ thẳng id khu của người khác vào URL cũng phải ra 404, không lộ cả tên khu.
  if (!property || property.sellerId !== sellerId) notFound();

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: PROPERTY_QUERY_KEYS.detail(id),
      queryFn: () => getPropertyById(id),
    }),
    queryClient.prefetchQuery({
      queryKey: ROOM_QUERY_KEYS.byProperty(id),
      queryFn: () => getRoomsByProperty(id),
    }),
  ]);

  return (
    <SurfaceGate surface="workspace">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PropertyDetailPage propertyId={id} sellerId={sellerId} />
      </HydrationBoundary>
    </SurfaceGate>
  );
}
