'use client';

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

export function AppSelect(props: AppSelectProps) {
  void props;
  return null;
}
