'use client';

import type { ContractStatus } from '@tronhanh/schemas';
import { FileSignature, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { ContractCard } from '@/features/workspace/components/contract/ContractCard';
import { CreateContractDialog } from '@/features/workspace/components/contract/CreateContractDialog';
import { ExtendContractDialog } from '@/features/workspace/components/contract/ExtendContractDialog';
import { TerminateContractDialog } from '@/features/workspace/components/contract/TerminateContractDialog';
import {
  useContracts,
  useCreateContract,
  useExtendContract,
  useTerminateContract,
} from '@/features/workspace/hooks/useContracts';
import type { ContractListItem, ContractRoomOption } from '@/features/workspace/types/contract';
import { cn } from '@/utils/cn';

type StatusFilter = ContractStatus | 'all';

const FILTER_CHIPS: ReadonlyArray<{ label: string; value: StatusFilter }> = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang hiệu lực', value: 'Active' },
  { label: 'Hết hạn', value: 'Expired' },
  { label: 'Đã chấm dứt', value: 'Terminated' },
];

type ActiveDialog =
  | { type: 'create' }
  | { type: 'extend'; contract: ContractListItem }
  | { type: 'terminate'; contract: ContractListItem }
  | null;

/** B11 — danh sách hợp đồng của toàn bộ khu thuộc chủ trọ. */
export function ContractsPage({
  sellerId,
  roomOptions,
}: {
  sellerId: string;
  roomOptions: readonly ContractRoomOption[];
}) {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isPending, isError } = useContracts(sellerId);
  const createContract = useCreateContract(sellerId);
  const extendContract = useExtendContract(sellerId);
  const terminateContract = useTerminateContract(sellerId);

  const contracts = data ?? [];
  const counts = useMemo(
    () => ({
      all: contracts.length,
      Active: contracts.filter((item) => item.status === 'Active').length,
      Expired: contracts.filter((item) => item.status === 'Expired').length,
      Terminated: contracts.filter((item) => item.status === 'Terminated').length,
      Draft: contracts.filter((item) => item.status === 'Draft').length,
    }),
    [contracts],
  );

  const visible = filter === 'all' ? contracts : contracts.filter((item) => item.status === filter);
  const isBusy = extendContract.isPending || terminateContract.isPending;

  const closeDialog = () => {
    setDialog(null);
    setError(null);
  };

  const toMessage = (cause: unknown, fallback: string) =>
    cause instanceof Error ? cause.message : fallback;

  return (
    <main className="flex flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.05em] text-ink-muted">
            Quản lý vận hành
          </p>
          <h1 className="m-0 mt-1.5 text-[22px] font-extrabold text-ink md:text-[26px]">
            Hợp đồng
          </h1>
          <p className="m-0 mt-1 text-[13px] text-ink-muted">
            {counts.all} hợp đồng ·{' '}
            <strong className="text-success">{counts.Active} đang hiệu lực</strong>
          </p>
        </div>

        <WriteGuardButton
          icon={<Plus aria-hidden="true" className="size-4" />}
          onClick={() => {
            setError(null);
            setDialog({ type: 'create' });
          }}
          surface="workspace"
          variant="primary"
        >
          Lập hợp đồng
        </WriteGuardButton>
      </header>

      {error && dialog === null ? (
        <p className="m-0 rounded-sm border border-error bg-error-soft px-4 py-3 text-[13px] font-semibold text-error">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {FILTER_CHIPS.map((chip) => {
          const isSelected = filter === chip.value;
          return (
            <button
              key={chip.value}
              className={cn(
                'rounded-full border px-3.5 py-[7px] text-[12.5px] transition-colors',
                isSelected
                  ? 'border-primary bg-primary font-bold text-surface'
                  : 'border-line bg-surface font-medium text-ink hover:border-sand',
              )}
              onClick={() => setFilter(chip.value)}
              type="button"
            >
              {chip.label}
              <span className={cn('ml-1.5', isSelected ? 'text-surface/80' : 'text-ink-muted')}>
                {counts[chip.value]}
              </span>
            </button>
          );
        })}
      </div>

      {isPending ? (
        <Skeleton className="h-[190px] rounded-md" count={3} />
      ) : isError ? (
        <EmptyState
          description="Vui lòng tải lại trang."
          title="Chưa tải được danh sách hợp đồng"
        />
      ) : visible.length === 0 ? (
        <EmptyState
          action={
            counts.all === 0 ? (
              <WriteGuardButton
                onClick={() => setDialog({ type: 'create' })}
                surface="workspace"
                variant="primary"
              >
                Lập hợp đồng đầu tiên
              </WriteGuardButton>
            ) : undefined
          }
          description={
            counts.all === 0
              ? 'Hợp đồng ghi lại kỳ hạn, tiền thuê và tiền cọc của một phòng, và là căn cứ để xuất hóa đơn hằng tháng.'
              : 'Không có hợp đồng nào ở trạng thái này.'
          }
          icon={<FileSignature aria-hidden="true" className="size-9 text-ink-muted" />}
          title={counts.all === 0 ? 'Chưa có hợp đồng nào' : 'Không có hợp đồng phù hợp'}
        />
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0 xl:grid-cols-2">
          {visible.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              isBusy={isBusy}
              onExtend={(item) => setDialog({ type: 'extend', contract: item })}
              onTerminate={(item) => setDialog({ type: 'terminate', contract: item })}
            />
          ))}
        </ul>
      )}

      {dialog?.type === 'create' ? (
        <CreateContractDialog
          isSaving={createContract.isPending}
          onClose={closeDialog}
          onSubmit={(input) => {
            setError(null);
            createContract.mutate(input, {
              onSuccess: closeDialog,
              onError: (cause) => setError(toMessage(cause, 'Chưa lập được hợp đồng.')),
            });
          }}
          rooms={roomOptions}
          submitError={error}
        />
      ) : null}

      {dialog?.type === 'extend' ? (
        <ExtendContractDialog
          contract={dialog.contract}
          isSaving={extendContract.isPending}
          onClose={closeDialog}
          onConfirm={(newEndDate) => {
            setError(null);
            extendContract.mutate(
              { contractId: dialog.contract.id, newEndDate },
              {
                onSuccess: closeDialog,
                onError: (cause) => setError(toMessage(cause, 'Chưa gia hạn được hợp đồng.')),
              },
            );
          }}
          submitError={error}
        />
      ) : null}

      {dialog?.type === 'terminate' ? (
        <TerminateContractDialog
          contract={dialog.contract}
          isSaving={terminateContract.isPending}
          onClose={closeDialog}
          onConfirm={(reason) => {
            setError(null);
            terminateContract.mutate(
              { contractId: dialog.contract.id, reason },
              {
                onSuccess: closeDialog,
                onError: (cause) => setError(toMessage(cause, 'Chưa chấm dứt được hợp đồng.')),
              },
            );
          }}
          submitError={error}
        />
      ) : null}
    </main>
  );
}
