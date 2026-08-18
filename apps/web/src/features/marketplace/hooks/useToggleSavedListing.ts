'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SAVED_LISTING_QUERY_KEYS } from '@/features/marketplace/constants/savedListingQueryKeys';
import {
  reportSavedListingsError,
  saveListing,
  unsaveListing,
} from '@/features/marketplace/services/savedListingsService';

export interface ToggleSavedListingOptions {
  listingId: string;
  renterId: string;
  isSaved: boolean;
}

interface ToggleSavedListingContext {
  previousIds: readonly string[] | undefined;
}

export function useToggleSavedListing({ listingId, renterId, isSaved }: ToggleSavedListingOptions) {
  const queryClient = useQueryClient();
  const idsQueryKey = SAVED_LISTING_QUERY_KEYS.ids(renterId);

  return useMutation<void, unknown, void, ToggleSavedListingContext>({
    mutationFn: () =>
      isSaved ? unsaveListing(renterId, listingId) : saveListing(renterId, listingId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: idsQueryKey });
      const previousIds = queryClient.getQueryData<readonly string[]>(idsQueryKey);
      const nextIds = new Set(previousIds ?? []);

      if (isSaved) nextIds.delete(listingId);
      else nextIds.add(listingId);

      queryClient.setQueryData<readonly string[]>(idsQueryKey, [...nextIds]);
      return { previousIds };
    },
    onError: (error, _variables, context) => {
      reportSavedListingsError('toggle', error);
      if (context?.previousIds !== undefined) {
        queryClient.setQueryData(idsQueryKey, context.previousIds);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: SAVED_LISTING_QUERY_KEYS.all }),
  });
}
