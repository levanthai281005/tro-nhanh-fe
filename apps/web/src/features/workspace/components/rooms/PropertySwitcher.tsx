'use client';

import { Building2, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { PropertyListItem } from '@/features/workspace/types/property';
import { cn } from '@/utils/cn';

/**
 * Chuyển nhanh giữa các khu mà không phải quay về B6.
 *
 * Mỗi mục là một `Link` thật (không phải `onClick` + `router.push`) để chuột giữa/Ctrl-click
 * mở tab mới được — chủ trọ nhiều khu hay so hai khu cạnh nhau.
 */
export function PropertySwitcher({
  properties,
  currentPropertyId,
}: {
  properties: readonly PropertyListItem[];
  currentPropertyId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const current = properties.find((property) => property.id === currentPropertyId);
  if (properties.length <= 1 || !current) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-sm border-[1.5px] border-line bg-surface px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-sand"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <Building2 aria-hidden="true" className="size-4 text-primary" />
        {current.name}
        <ChevronDown aria-hidden="true" className="size-3.5 text-ink-muted" />
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-full z-[100] mt-1.5 min-w-[240px] overflow-hidden rounded-sm border border-line bg-surface shadow-lg"
          role="menu"
        >
          {properties.map((property) => (
            <Link
              key={property.id}
              className={cn(
                'block px-4 py-2.5 text-[13.5px] transition-colors hover:bg-canvas',
                property.id === currentPropertyId
                  ? 'bg-cream font-bold text-primary'
                  : 'font-medium text-ink',
              )}
              href={`/chu-tro/khu-tro/${property.id}/phong`}
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              {property.name}
              <span className="ml-2 text-xs font-medium text-ink-muted">
                {property.roomCount} phòng
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
