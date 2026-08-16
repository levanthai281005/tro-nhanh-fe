'use client';

import { useMutation } from '@tanstack/react-query';
import type {
  CreateListingReportInput,
  ListingReport,
} from '@/features/marketplace/types/listingDetail';
import { createListingReport } from '@/features/marketplace/services/reportsService';

export interface CreateReportMutation {
  mutateAsync: (input: CreateListingReportInput) => Promise<ListingReport>;
  isPending: boolean;
}

export function useCreateReport(): CreateReportMutation {
  const mutation = useMutation({
    mutationFn: createListingReport,
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
