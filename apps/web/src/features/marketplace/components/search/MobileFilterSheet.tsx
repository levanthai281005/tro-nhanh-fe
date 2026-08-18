import { Button } from '@/components/ui/Button';
import { ModalShell } from '@/components/ui/ModalShell';
import { SearchFilterFields } from '@/features/marketplace/components/search/SearchFilterFields';
import type { ListingSearchFilters } from '@/features/marketplace/types/listings';

export interface MobileFilterSheetProps {
  open: boolean;
  filters: ListingSearchFilters;
  onChange: (filters: ListingSearchFilters) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

export function MobileFilterSheet({
  open,
  filters,
  onChange,
  onApply,
  onClear,
  onClose,
}: MobileFilterSheetProps) {
  if (!open) return null;

  return (
    <ModalShell
      footer={
        <>
          <Button
            fullWidth
            onClick={() => {
              onClear();
              onClose();
            }}
            variant="outline"
          >
            Xóa lọc
          </Button>
          <Button
            fullWidth
            onClick={() => {
              onApply();
              onClose();
            }}
          >
            Áp dụng
          </Button>
        </>
      }
      onClose={onClose}
      title="Bộ lọc"
      variant="bottom-sheet"
    >
      <SearchFilterFields filters={filters} onChange={onChange} />
    </ModalShell>
  );
}
