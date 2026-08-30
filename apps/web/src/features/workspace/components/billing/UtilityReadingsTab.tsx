'use client';

import type { UtilityType } from '@tronhanh/schemas';
import { Gauge } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppSelect } from '@/components/ui/AppSelect';
import { EmptyState } from '@/components/ui/EmptyState';
import { FieldBox, FormField } from '@/components/ui/FormField';
import { Skeleton } from '@/components/ui/Skeleton';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { UtilityMeterCell } from '@/features/workspace/components/billing/UtilityMeterCell';
import {
  useSaveUtilityReadings,
  useUtilityReadings,
} from '@/features/workspace/hooks/useUtilityReadings';
import type { PropertyListItem } from '@/features/workspace/types/property';
import type {
  UtilityReadingDraft,
  UtilityReadingRow,
} from '@/features/workspace/types/utilityReading';
import { buildPeriodOptions, currentPeriod, formatPeriod } from '@/features/workspace/utils/period';
import { formatVnd } from '@/utils/formatVnd';

/** Khóa của một ô trong bảng nháp. Cặp (phòng, loại công tơ) là định danh duy nhất trong kỳ. */
function cellKey(roomId: string, type: UtilityType): string {
  return `${roomId}:${type}`;
}

/**
 * Bảng ghi chỉ số cả khu trong một kỳ.
 *
 * Prototype ghi **từng phòng một** qua modal. Với khu hai mươi phòng thì đó là hai mươi lần
 * mở–gõ–lưu–đóng, trong khi việc thật là chủ trọ cầm sổ đi một vòng rồi nhập một lượt. Bảng
 * này giữ nguyên nhịp đó: chọn khu và kỳ một lần, nhập hết, lưu một lần.
 */
export function UtilityReadingsTab({
  sellerId,
  properties,
}: {
  sellerId: string;
  properties: readonly PropertyListItem[];
}) {
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? '');
  const [period, setPeriod] = useState(currentPeriod);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const { data, isPending, isError } = useUtilityReadings(sellerId, propertyId, period);
  const saveReadings = useSaveUtilityReadings(sellerId, propertyId);

  const rows = data ?? [];
  const periodOptions = useMemo(() => buildPeriodOptions(), []);

  /** Đổi khu hoặc đổi kỳ là đổi hẳn tập dữ liệu — giữ lại số đang gõ sẽ ghi nhầm sang kỳ khác. */
  const resetDrafts = () => {
    setDrafts({});
    setError(null);
  };

  const pendingDrafts = useMemo(() => collectDrafts(rows, drafts), [rows, drafts]);
  const totalAmount = useMemo(() => sumRows(rows, drafts), [rows, drafts]);
  // So với **chỉ số cũ của chính ô đó**, không phải so với 0: chỉ số công tơ luôn dương, nên
  // `currentReading < 0` không bao giờ đúng và nút Lưu sẽ mở suốt dù ô đang báo đỏ.
  const invalidRoomCode = useMemo(() => findInvalidRow(rows, drafts), [rows, drafts]);

  const handleSave = () => {
    setError(null);

    if (invalidRoomCode) {
      setError(`Phòng ${invalidRoomCode}: chỉ số mới không được nhỏ hơn chỉ số cũ.`);
      return;
    }

    saveReadings.mutate(
      { period, drafts: pendingDrafts },
      {
        onSuccess: () => setDrafts({}),
        onError: (cause) =>
          setError(cause instanceof Error ? cause.message : 'Chưa lưu được chỉ số.'),
      },
    );
  };

  if (properties.length === 0) {
    return (
      <EmptyState
        description="Hãy tạo khu trọ và thêm phòng trước khi ghi chỉ số điện nước."
        icon={<Gauge aria-hidden="true" className="size-9 text-ink-muted" />}
        title="Chưa có khu trọ nào"
      />
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 sm:max-w-[560px]">
        <FormField label="Khu trọ">
          <FieldBox>
            <AppSelect
              onChange={(value) => {
                setPropertyId(value);
                resetDrafts();
              }}
              options={properties.map((item) => ({ value: item.id, label: item.name }))}
              value={propertyId}
            />
          </FieldBox>
        </FormField>

        <FormField label="Kỳ ghi chỉ số">
          <FieldBox>
            <AppSelect
              onChange={(value) => {
                setPeriod(value);
                resetDrafts();
              }}
              options={periodOptions.map((item) => ({ value: item, label: formatPeriod(item) }))}
              value={period}
            />
          </FieldBox>
        </FormField>
      </div>

      {error ? (
        <p className="m-0 rounded-sm border border-error bg-error-soft px-4 py-3 text-[13px] font-semibold text-error">
          {error}
        </p>
      ) : null}

      {isPending ? (
        <Skeleton className="h-[150px] rounded-md" count={3} />
      ) : isError ? (
        <EmptyState description="Vui lòng tải lại trang." title="Chưa tải được bảng chỉ số" />
      ) : rows.length === 0 ? (
        <EmptyState
          description="Chỉ phòng đang có hợp đồng hiệu lực mới ghi chỉ số, vì hóa đơn phải gắn với một hợp đồng (BR-006). Hãy lập hợp đồng cho phòng trước."
          icon={<Gauge aria-hidden="true" className="size-9 text-ink-muted" />}
          title="Khu này chưa có phòng nào cần ghi chỉ số"
        />
      ) : (
        <>
          <ul className="m-0 grid list-none gap-3 p-0 xl:grid-cols-2">
            {rows.map((row) => (
              <li
                key={row.roomId}
                className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <strong className="text-[15px] font-extrabold text-ink">{row.roomCode}</strong>
                  <span className="truncate text-[13px] text-ink-muted">{row.occupantName}</span>
                </span>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(['Electricity', 'Water'] as const).map((type) => (
                    <UtilityMeterCell
                      key={type}
                      cell={type === 'Electricity' ? row.electricity : row.water}
                      onValueChange={(value) =>
                        // Cập nhật theo hàm, không đọc `drafts` từ closure: hai lần gõ trong
                        // cùng một khung hình sẽ cùng đọc giá trị cũ và cái sau đè cái trước.
                        setDrafts((current) => ({ ...current, [cellKey(row.roomId, type)]: value }))
                      }
                      type={type}
                      value={readCellValue(drafts, row.roomId, type, row)}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-surface px-4 py-3.5">
            <p className="m-0 text-[13px] text-ink-muted">
              Tổng tiền điện nước kỳ này ·{' '}
              <strong className="text-[15px] font-extrabold text-primary">
                {formatVnd(totalAmount)}
              </strong>
            </p>
            <WriteGuardButton
              disabled={pendingDrafts.length === 0 || invalidRoomCode !== null}
              loading={saveReadings.isPending}
              onClick={handleSave}
              surface="workspace"
              title={
                invalidRoomCode
                  ? `Phòng ${invalidRoomCode} đang có chỉ số nhỏ hơn chỉ số cũ`
                  : pendingDrafts.length === 0
                    ? 'Chưa có ô nào thay đổi'
                    : undefined
              }
              variant="primary"
            >
              Lưu chỉ số ({pendingDrafts.length})
            </WriteGuardButton>
          </div>
        </>
      )}
    </section>
  );
}

/**
 * Giá trị hiện trong ô: số đang gõ, nếu chưa gõ thì **số đã lưu của kỳ này**.
 *
 * Để mặc chuỗi rỗng khi chưa gõ là một cái bẫy: kỳ đã ghi rồi thì ô trông như chưa nhập, trong
 * khi dòng bên dưới vẫn tính "88 kWh × 3.500" và tổng cuối bảng vẫn cộng số đó vào. Chủ trọ
 * đọc thành "phần mềm tự bịa ra một con số", rồi gõ lại đúng cái đã có.
 */
function readCellValue(
  drafts: Record<string, string>,
  roomId: string,
  type: UtilityType,
  row: UtilityReadingRow,
): string {
  const draft = drafts[cellKey(roomId, type)];
  if (draft !== undefined) return draft;

  const cell = type === 'Electricity' ? row.electricity : row.water;
  return cell.currentReading === null ? '' : String(cell.currentReading);
}

/** Chỉ gửi ô **đã gõ và khác giá trị đang lưu** — gửi cả bảng là ghi đè lên ô người ta không đụng. */
function collectDrafts(
  rows: readonly UtilityReadingRow[],
  drafts: Record<string, string>,
): readonly UtilityReadingDraft[] {
  const result: UtilityReadingDraft[] = [];

  for (const row of rows) {
    for (const type of ['Electricity', 'Water'] as const) {
      const cell = type === 'Electricity' ? row.electricity : row.water;
      if (cell.invoicedAt !== null) continue;

      const raw = drafts[cellKey(row.roomId, type)];
      if (raw === undefined || raw.trim() === '') continue;

      const currentReading = Number(raw);
      if (currentReading === cell.currentReading) continue;

      result.push({ roomId: row.roomId, type, currentReading });
    }
  }

  return result;
}

function findInvalidRow(
  rows: readonly UtilityReadingRow[],
  drafts: Record<string, string>,
): string | null {
  for (const row of rows) {
    for (const type of ['Electricity', 'Water'] as const) {
      const cell = type === 'Electricity' ? row.electricity : row.water;
      const raw = drafts[cellKey(row.roomId, type)];
      if (raw === undefined || raw.trim() === '') continue;
      if (Number(raw) < cell.previousReading) return row.roomCode;
    }
  }
  return null;
}

/** Tổng tiền điện nước của bảng, tính theo số **đang hiển thị** kể cả ô vừa gõ chưa lưu. */
function sumRows(rows: readonly UtilityReadingRow[], drafts: Record<string, string>): number {
  return rows.reduce((total, row) => {
    return (
      total +
      (['Electricity', 'Water'] as const).reduce((sum, type) => {
        const cell = type === 'Electricity' ? row.electricity : row.water;
        const raw = drafts[cellKey(row.roomId, type)];
        const current = raw !== undefined && raw.trim() !== '' ? Number(raw) : cell.currentReading;
        if (current === null) return sum;
        return sum + Math.max(0, current - cell.previousReading) * cell.unitPrice;
      }, 0)
    );
  }, 0);
}
