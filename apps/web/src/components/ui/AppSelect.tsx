'use client';

import { Check, ChevronDown, Search } from 'lucide-react';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { normalizeVietnamese } from '@/utils/normalizeVietnamese';

export interface SelectOption {
  label: string;
  value: string;
}

export interface AppSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  emptyText?: string;
  className?: string;
  'data-testid'?: string;
}

export function AppSelect({
  value,
  options,
  onChange,
  placeholder,
  searchable = false,
  emptyText = 'Không tìm thấy mục nào',
  className,
  'data-testid': testId,
}: AppSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const selectedOption = options.find((option) => option.value === value);
  const visibleOptions = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const normalizedQuery = normalizeVietnamese(query);
    return options.filter((option) => normalizeVietnamese(option.label).includes(normalizedQuery));
  }, [options, query, searchable]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setHighlightedIndex(-1);
      return;
    }

    if (searchable) searchRef.current?.focus();
  }, [isOpen, searchable]);

  useEffect(() => {
    setHighlightedIndex(query.trim() ? 0 : -1);
  }, [query]);

  useLayoutEffect(() => {
    if (isOpen && triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (triggerRef.current) setTriggerRect(triggerRef.current.getBoundingClientRect());
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isOpen]);

  const selectOption = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((index) => Math.min(index + 1, visibleOptions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = visibleOptions[highlightedIndex];
      if (option) selectOption(option);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        aria-controls={isOpen ? listboxId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          'flex w-full items-center justify-between gap-2 bg-transparent p-0 text-left text-[15px] outline-none',
          selectedOption ? 'text-ink' : 'text-ink-muted/60',
          className,
        )}
        data-testid={testId}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'size-[13px] shrink-0 text-ink-muted transition-transform duration-150',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && triggerRect
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed z-[1000] max-h-80 overflow-y-auto rounded-md border border-line bg-surface p-1.5 shadow-xl"
              id={listboxId}
              role="listbox"
              // Portal geometry must follow the trigger's runtime viewport position.
              style={{
                top: triggerRect.bottom + 6,
                left: triggerRect.left,
                minWidth: triggerRect.width,
              }}
            >
              {searchable ? (
                <div className="relative px-0.5 pb-1.5 pt-0.5">
                  <Search
                    aria-hidden="true"
                    className="absolute left-3 top-[13px] size-3.5 text-ink-muted"
                  />
                  <input
                    ref={searchRef}
                    className="w-full rounded-sm border border-line bg-surface py-[9px] pl-[34px] pr-3 text-[13.5px] text-ink outline-none focus:border-sand"
                    data-testid={testId ? `${testId}-search` : undefined}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Gõ để tìm…"
                    value={query}
                  />
                </div>
              ) : null}

              {visibleOptions.length === 0 ? (
                <p
                  className="m-0 px-2 py-3.5 text-center text-[13px] text-ink-muted"
                  data-testid={testId ? `${testId}-empty` : undefined}
                >
                  {emptyText}
                </p>
              ) : (
                visibleOptions.map((option, index) => {
                  const isSelected = option.value === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <button
                      key={option.value}
                      aria-selected={isSelected}
                      className={cn(
                        'flex min-h-10 w-full items-center justify-between gap-2 whitespace-nowrap rounded-sm px-3 text-left text-sm font-medium text-ink',
                        isHighlighted && 'bg-cream',
                        isSelected && 'bg-primary font-semibold text-surface',
                      )}
                      data-testid={testId ? `${testId}-option` : undefined}
                      onClick={() => selectOption(option)}
                      onMouseMove={() => setHighlightedIndex(index)}
                      role="option"
                      type="button"
                    >
                      {option.label}
                      {isSelected ? (
                        <Check aria-hidden="true" className="size-[15px] shrink-0" />
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
