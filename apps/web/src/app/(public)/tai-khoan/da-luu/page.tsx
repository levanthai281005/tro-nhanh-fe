import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { SavedListingsPage } from '@/features/marketplace/components/SavedListingsPage';
import { MOCK_RENTER_ID } from '@/features/marketplace/constants/mockSavedListings';
import { SAVED_LISTING_QUERY_KEYS } from '@/features/marketplace/constants/savedListingQueryKeys';
import {
  getSavedListingIds,
  getSavedListings,
} from '@/features/marketplace/services/savedListingsService';

export const metadata: Metadata = {
  title: 'Tin đã lưu',
};

export const dynamic = 'force-dynamic';

export default async function SavedListingsRoute() {
  // TODO: nối AuthContext khi có; thay mock id bằng user.id từ session đã xác thực.
  const renterId = MOCK_RENTER_ID;
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: SAVED_LISTING_QUERY_KEYS.list(renterId),
      queryFn: () => getSavedListings(renterId),
    }),
    queryClient.prefetchQuery({
      queryKey: SAVED_LISTING_QUERY_KEYS.ids(renterId),
      queryFn: () => getSavedListingIds(renterId),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SavedListingsPage renterId={renterId} />
    </HydrationBoundary>
  );
}
