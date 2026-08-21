import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { SurfaceGate } from '@/features/session/components/SurfaceGate';
import { MOCK_USER_ID } from '@/features/session/constants/mockSessionContext';
import { ContractsPage } from '@/features/workspace/components/contract/ContractsPage';
import { CONTRACT_QUERY_KEYS } from '@/features/workspace/constants/workspaceQueryKeys';
import {
  getContractRoomOptions,
  getContractsBySeller,
} from '@/features/workspace/services/contractsService';

export const metadata: Metadata = {
  title: 'Hợp đồng',
};

export const dynamic = 'force-dynamic';

/** B11 — hợp đồng. `SCREENS_WORKSPACE.md`, Surface Workspace. */
export default async function ContractsRoute() {
  // TODO: nối AuthContext khi có; thay mock id bằng user.id từ session đã xác thực.
  const sellerId = MOCK_USER_ID;
  const queryClient = new QueryClient();

  const [, roomOptions] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: CONTRACT_QUERY_KEYS.bySeller(sellerId),
      queryFn: () => getContractsBySeller(sellerId),
    }),
    getContractRoomOptions(sellerId),
  ]);

  return (
    <SurfaceGate surface="workspace">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ContractsPage roomOptions={roomOptions} sellerId={sellerId} />
      </HydrationBoundary>
    </SurfaceGate>
  );
}
