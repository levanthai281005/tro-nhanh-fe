/** Normalize Vietnamese text for case-insensitive, diacritic-insensitive search. */
export function normalizeVietnamese(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}
