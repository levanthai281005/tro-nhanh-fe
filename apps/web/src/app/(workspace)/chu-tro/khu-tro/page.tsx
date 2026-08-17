import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { SurfaceGate } from '@/features/session/components/SurfaceGate';
import { MOCK_USER_ID } from '@/features/session/constants/mockSessionContext';
import { PROPERTY_QUERY_KEYS } from '@/features/workspace/constants/workspaceQueryKeys';
import { PropertiesPage } from '@/features/workspace/components/properties/PropertiesPage';
import { getProperties } from '@/features/workspace/services/propertiesService';

export const metadata: Metadata = {
  title: 'Khu trọ của tôi',
};

export const dynamic = 'force-dynamic';

/** B6 — danh sách khu trọ. `SCREENS_WORKSPACE.md`, Surface Workspace. */
export default async function PropertiesRoute() {
  // TODO: nối AuthContext khi có; thay mock id bằng user.id từ session đã xác thực.
  const sellerId = MOCK_USER_ID;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: PROPERTY_QUERY_KEYS.list(sellerId),
    queryFn: () => getProperties(sellerId),
  });

  return (
    <SurfaceGate surface="workspace">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PropertiesPage sellerId={sellerId} />
      </HydrationBoundary>
    </SurfaceGate>
  );
}
