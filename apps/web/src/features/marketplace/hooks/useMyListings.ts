'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MY_LISTING_QUERY_KEYS } from '@/features/marketplace/constants/myListingQueryKeys';
import {
  boostListing,
  deleteListing,
  getBoostPackages,
  getMyListings,
  renewListing,
  setListingVisibility,
} from '@/features/marketplace/services/myListingsService';
import type { MyListingsResult } from '@/features/marketplace/types/myListings';

export function useMyListings(sellerId: string | undefined) {
  return useQuery({
    queryKey: MY_LISTING_QUERY_KEYS.list(sellerId),
    queryFn: () => getMyListings(sellerId),
    enabled: Boolean(sellerId),
    staleTime: 30_000,
  });
}

export function useBoostPackages(enabled: boolean) {
  return useQuery({
    queryKey: MY_LISTING_QUERY_KEYS.boostPackages(),
    queryFn: getBoostPackages,
    enabled,
    staleTime: 5 * 60_000,
  });
}

interface MutationContext {
  previous: MyListingsResult | undefined;
}

/**
 * Gom bốn mutation của trang quản lý tin. Tất cả dùng chung một query key nên chỉ cần một
 * lớp optimistic/rollback: cập nhật ngay để thao tác thấy phản hồi tức thì, hỏng thì trả lại
 * đúng snapshot trước đó, xong xuôi mới invalidate để lấy số liệu chuẩn từ service.
 */
function useMyListingMutation<TVariables>(
  sellerId: string | undefined,
  mutationFn: (variables: TVariables) => Promise<unknown>,
  applyOptimistic?: (current: MyListingsResult, variables: TVariables) => MyListingsResult,
) {
  const queryClient = useQueryClient();
  const queryKey = MY_LISTING_QUERY_KEYS.list(sellerId);

  return useMutation<unknown, Error, TVariables, MutationContext>({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<MyListingsResult>(queryKey);

      if (previous && applyOptimistic) {
        queryClient.setQueryData<MyListingsResult>(queryKey, applyOptimistic(previous, variables));
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: MY_LISTING_QUERY_KEYS.all }),
  });
}

export function useToggleListingVisibility(sellerId: string | undefined) {
  return useMyListingMutation<{ listingId: string; nextStatus: 'Active' | 'Hidden' }>(
    sellerId,
    ({ listingId, nextStatus }) => setListingVisibility(listingId, nextStatus),
    (current, { listingId, nextStatus }) => ({
      ...current,
      rows: current.rows.map((row) =>
        row.id === listingId ? { ...row, status: nextStatus } : row,
      ),
    }),
  );
}

export function useDeleteListing(sellerId: string | undefined) {
  return useMyListingMutation<string>(
    sellerId,
    (listingId) => deleteListing(listingId),
    (current, listingId) => ({
      ...current,
      rows: current.rows.filter((row) => row.id !== listingId),
    }),
  );
}

export function useBoostListing(sellerId: string | undefined) {
  // Hạn nổi bật mới do service tính (có cộng dồn), nên không đoán trước ở client.
  return useMyListingMutation<{ listingId: string; days: number }>(
    sellerId,
    ({ listingId, days }) => boostListing(listingId, days),
  );
}

export function useRenewListing(sellerId: string | undefined) {
  return useMyListingMutation<string>(sellerId, (listingId) => renewListing(listingId));
}
