import type {
  CreateListingReportInput,
  ListingReport,
} from '@/features/marketplace/types/listingDetail';

export async function createListingReport(
  input: CreateListingReportInput,
): Promise<ListingReport> {
  throw new Error(`Listing report mock has not been connected for ${input.listingId}.`);
}
