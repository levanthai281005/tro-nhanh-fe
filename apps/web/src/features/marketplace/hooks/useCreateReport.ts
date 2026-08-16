import type {
  CreateListingReportInput,
  ListingReport,
} from '@/features/marketplace/types/listingDetail';

export interface CreateReportMutation {
  mutateAsync: (input: CreateListingReportInput) => Promise<ListingReport>;
  isPending: boolean;
}
