import type { ListingRecord, MarketplaceEntityFields } from '@/features/marketplace/types/listings';

export interface ListingReview extends MarketplaceEntityFields {
  propertyId: string;
  authorUserId: string;
  contractId: string;
  rating: number;
  content: string;
  status: 'Visible' | 'Hidden' | 'Reported';
  sellerReply: string | null;
}

export interface ListingDetailData {
  record: ListingRecord;
  reviews: readonly ListingReview[];
}

export interface ListingReport extends MarketplaceEntityFields {
  reporterId: string;
  targetType: 'RentalListing';
  targetId: string;
  reason: string;
  description: string | null;
  status: 'Pending' | 'Resolved' | 'Dismissed';
  resolution: string | null;
  handledBy: string | null;
}

export interface CreateListingReportInput {
  reporterId: string;
  listingId: string;
  reason: string;
  description?: string;
}
