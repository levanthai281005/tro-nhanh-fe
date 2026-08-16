import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchFilterFields } from '@/features/marketplace/components/search/SearchFilterFields';
import type { ListingSearchFilters } from '@/features/marketplace/types/listings';

export interface FilterSidebarProps {
  filters: ListingSearchFilters;
  onChange: (filters: ListingSearchFilters) => void;
  onApply: () => void;
  onClear: () => void;
}

export function FilterSidebar({ filters, onChange, onApply, onClear }: FilterSidebarProps) {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-ink">
          <SlidersHorizontal aria-hidden="true" className="size-4 text-primary" />
          <h2 className="text-base font-bold">Bộ lọc</h2>
        </div>
        <button
          className="text-xs font-medium text-ink-muted transition-colors hover:text-primary"
          onClick={onClear}
          type="button"
        >
          Xóa tất cả
        </button>
      </div>

      <SearchFilterFields filters={filters} onChange={onChange} />

      <div className="mt-5 flex gap-2 border-t border-line pt-5">
        <Button className="shrink-0" onClick={onClear} variant="outline">
          Xóa lọc
        </Button>
        <Button fullWidth onClick={onApply}>
          Áp dụng
        </Button>
      </div>
    </Card>
  );
}
