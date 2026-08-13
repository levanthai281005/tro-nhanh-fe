import { isValidElement, type HTMLAttributes, type ReactNode } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/utils/cn';

export interface TableColumn<T> {
  key: keyof T & string;
  label: string;
  width?: string | number;
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

const ALIGN_CLASSES: Record<NonNullable<TableColumn<never>['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

function defaultCell(value: unknown): ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (isValidElement(value)) return value;
  return String(value);
}

export function Table<T extends { id?: string | number }>({
  columns,
  rows,
  renderCell,
  emptyState,
  className,
  ...containerProps
}: TableProps<T>) {
  if (rows.length === 0) {
    return (
      <div
        className={cn('rounded-lg border border-line bg-surface p-4', className)}
        {...containerProps}
      >
        {emptyState ?? (
          <EmptyState title="Không có dữ liệu" description="Chưa có bản ghi nào để hiển thị." />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn('w-full overflow-x-auto rounded-lg border border-line bg-surface', className)}
      {...containerProps}
    >
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-xs font-semibold uppercase tracking-[0.04em] text-ink-muted',
                  ALIGN_CLASSES[column.align ?? 'left'],
                )}
                // Column widths come from the typed table configuration at runtime.
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex} className="border-b border-line last:border-b-0">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn('px-4 py-3 text-ink', ALIGN_CLASSES[column.align ?? 'left'])}
                >
                  {renderCell
                    ? renderCell(row, column.key, rowIndex)
                    : defaultCell(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
