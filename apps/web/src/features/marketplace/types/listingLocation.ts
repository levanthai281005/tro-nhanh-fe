export type ListingNearbyCategoryKey = 'shopping' | 'edu' | 'health' | 'food';

export interface ListingNearbyPlace {
  name: string;
  distance: string;
}

export interface ListingNearbyCategory {
  key: ListingNearbyCategoryKey;
  places: readonly ListingNearbyPlace[];
}

// PROPOSAL: RentalListing chưa có latitude/longitude/nearbyPlaces trong DATA_ENTITIES.md — đề xuất bổ sung khi backend làm bản đồ thật
export interface ListingDetailLocation {
  latitude: number;
  longitude: number;
  nearbyPlaces: readonly ListingNearbyCategory[];
}
