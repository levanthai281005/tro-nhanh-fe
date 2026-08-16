export function isFutureDate(value: string | null, now: number) {
  if (!value) return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp > now;
}

export function sortListingsByBoost<T>(
  listings: readonly T[],
  getBoostExpireAt: (listing: T) => string | null,
  compareWithinBoostGroup: (left: T, right: T) => number,
  now = Date.now(),
) {
  return listings.toSorted((left, right) => {
    const leftBoosted = isFutureDate(getBoostExpireAt(left), now);
    const rightBoosted = isFutureDate(getBoostExpireAt(right), now);
    if (leftBoosted !== rightBoosted) return leftBoosted ? -1 : 1;
    return compareWithinBoostGroup(left, right);
  });
}
