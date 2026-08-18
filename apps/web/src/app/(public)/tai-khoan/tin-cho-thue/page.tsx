import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { MyListingsPage } from '@/features/marketplace/components/my-listings/MyListingsPage';
import { MOCK_SELLER_ID } from '@/features/marketplace/constants/mockMyListings';
import { MY_LISTING_QUERY_KEYS } from '@/features/marketplace/constants/myListingQueryKeys';
import { getMyListings } from '@/features/marketplace/services/myListingsService';

export const metadata: Metadata = {
  title: 'Tin cho thuê của tôi',
};

export const dynamic = 'force-dynamic';

export default async function MyListingsRoute() {
  // TODO: nối AuthContext khi có; thay mock id bằng user.id từ session đã xác thực.
  const sellerId = MOCK_SELLER_ID;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: MY_LISTING_QUERY_KEYS.list(sellerId),
    queryFn: () => getMyListings(sellerId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyListingsPage sellerId={sellerId} />
    </HydrationBoundary>
  );
}
