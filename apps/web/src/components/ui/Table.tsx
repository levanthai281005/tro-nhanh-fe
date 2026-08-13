import type { HTMLAttributes, ReactNode } from 'react';

export interface TableColumn<T> {
  key: keyof T & string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<
  T extends { id?: string | number },
> extends HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<T>[];
  rows: T[];
  renderCell?: (row: T, key: keyof T & string, index: number) => ReactNode;
  emptyState?: ReactNode;
}

export function Table<T extends { id?: string | number }>(props: TableProps<T>) {
  void props;
  return null;
}
