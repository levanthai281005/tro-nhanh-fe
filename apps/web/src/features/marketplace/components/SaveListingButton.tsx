'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { useSavedListingIds } from '@/features/marketplace/hooks/useSavedListings';
import { useToggleSavedListing } from '@/features/marketplace/hooks/useToggleSavedListing';
import { cn } from '@/utils/cn';

export interface SaveListingButtonProps {
  listingId: string;
  viewerId?: string;
  size?: number;
  overlay?: boolean;
  'data-testid'?: string;
}

export function SaveListingButton({
  listingId,
  viewerId,
  size = 16,
  overlay = false,
  'data-testid': testId = 'save-listing-btn',
}: SaveListingButtonProps) {
  const router = useRouter();
  // TODO: nối AuthContext khi có; thay viewerId bằng user từ useAuth nhưng vẫn giữ guest redirect.
  const renterId = viewerId ?? 'guest';
  const { savedIds } = useSavedListingIds({ renterId: viewerId });
  const isSaved = savedIds.has(listingId);
  const mutation = useToggleSavedListing({ listingId, renterId, isSaved });

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (!viewerId) {
      router.push(`/dang-nhap?redirect=${encodeURIComponent(`/phong/${listingId}`)}`);
      return;
    }

    mutation.mutate();
  };

  return (
    <button
      aria-busy={mutation.isPending || undefined}
      aria-label={isSaved ? 'Bỏ khỏi tin đã lưu' : 'Lưu tin này'}
      aria-pressed={isSaved}
      className={cn(
        'group z-10 items-center justify-center border-0 transition-colors disabled:cursor-wait disabled:opacity-70',
        overlay
          ? 'absolute right-2.5 top-2.5 flex rounded-full bg-surface/90 p-0 shadow-md'
          : 'inline-flex bg-transparent p-1',
      )}
      data-saved={isSaved ? 'true' : 'false'}
      data-testid={testId}
      disabled={mutation.isPending}
      onClick={handleClick}
      // Overlay dimensions derive from the runtime icon-size prop.
      style={overlay ? { width: size + 18, height: size + 18 } : undefined}
      title={isSaved ? 'Bỏ khỏi tin đã lưu' : 'Lưu tin này'}
      type="button"
    >
      <Heart
        aria-hidden="true"
        className={cn(
          'fill-transparent text-sand transition-colors group-hover:text-error',
          isSaved && 'fill-error text-error',
        )}
        size={size}
        strokeWidth={2}
      />
    </button>
  );
}
