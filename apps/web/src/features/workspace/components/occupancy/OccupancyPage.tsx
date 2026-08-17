'use client';

import { Users, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { AddOccupantDialog } from '@/features/workspace/components/occupancy/AddOccupantDialog';
import { EndOccupancyDialog } from '@/features/workspace/components/occupancy/EndOccupancyDialog';
import { OccupancyCard } from '@/features/workspace/components/occupancy/OccupancyCard';
import {
  useAddOccupancy,
  useEndOccupancy,
  useInviteOccupantLink,
  useOccupancies,
  useSetContractRepresentative,
} from '@/features/workspace/hooks/useOccupancies';
import type { Occupancy } from '@/features/workspace/types/occupancy';

interface OccupancyPageProps {
  roomId: string;
  roomCode: string;
  propertyId: string;
  propertyName: string;
}

/** B10 — quản lý người ở của một phòng. */
export function OccupancyPage({ roomId, roomCode, propertyId, propertyName }: OccupancyPageProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [endingOccupancy, setEndingOccupancy] = useState<Occupancy | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isPending, isError } = useOccupancies(roomId);
  const addOccupancy = useAddOccupancy(roomId, propertyId);
  const endOccupancy = useEndOccupancy(roomId, propertyId);
  const setRepresentative = useSetContractRepresentative(roomId, propertyId);
  const inviteLink = useInviteOccupantLink(roomId, propertyId);

  const active = data?.active ?? [];
  const past = data?.past ?? [];
  const hasRepresentative = active.some((item) => item.isContractRepresentative);
  const isBusy = setRepresentative.isPending || inviteLink.isPending;

  const toMessage = (cause: unknown, fallback: string) =>
    cause instanceof Error ? cause.message : fallback;

  return (
    <main className="flex flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink-muted">
            <Link className="transition-colors hover:text-primary" href="/chu-tro/khu-tro">
              Khu trọ
            </Link>
            <span aria-hidden="true"> / </span>
            <Link
              className="transition-colors hover:text-primary"
              href={`/chu-tro/khu-tro/${propertyId}/phong`}
            >
              {propertyName}
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Phòng {roomCode}</span>
          </nav>
          <h1 className="m-0 mt-1.5 text-[22px] font-extrabold text-ink md:text-[26px]">
            Người ở phòng {roomCode}
          </h1>
        </div>

        <WriteGuardButton
          icon={<UserPlus aria-hidden="true" className="size-4" />}
          onClick={() => {
            setError(null);
            setIsAddOpen(true);
          }}
          surface="workspace"
          variant="primary"
        >
          Thêm người ở
        </WriteGuardButton>
      </header>

      {error && !isAddOpen && endingOccupancy === null ? (
        <p className="m-0 rounded-sm border border-error bg-error-soft px-4 py-3 text-[13px] font-semibold text-error">
          {error}
        </p>
      ) : null}

      {/* BR-006 — mỗi phòng tối đa một hợp đồng Active, nên tối đa một người đại diện. Nói ra
          khi chưa có ai, vì đó là việc còn thiếu chứ không phải dữ liệu hỏng. */}
      {active.length > 0 && !hasRepresentative ? (
        <p className="m-0 rounded-sm border border-warning bg-warning-soft px-4 py-3 text-[13px] font-semibold text-warning">
          Phòng chưa có người đứng tên hợp đồng. Chọn một người ở làm đại diện trước khi lập hợp
          đồng.
        </p>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-xs font-bold uppercase tracking-[0.05em] text-ink-muted">
          Đang ở ({active.length})
        </h2>

        {isPending ? (
          <Skeleton className="h-[150px] rounded-md" count={2} />
        ) : isError ? (
          <EmptyState
            description="Vui lòng tải lại trang."
            title="Chưa tải được danh sách người ở"
          />
        ) : active.length === 0 ? (
          <EmptyState
            action={
              <WriteGuardButton
                onClick={() => setIsAddOpen(true)}
                surface="workspace"
                variant="primary"
              >
                Thêm người ở đầu tiên
              </WriteGuardButton>
            }
            description={`Phòng ${roomCode} chưa có ai ở. Thêm người ở để lập hợp đồng, ghi điện nước và xuất hóa đơn.`}
            icon={<Users aria-hidden="true" className="size-9 text-ink-muted" />}
            title="Chưa có người ở"
          />
        ) : (
          <ul className="m-0 grid list-none gap-3 p-0 xl:grid-cols-2">
            {active.map((occupancy) => (
              <OccupancyCard
                key={occupancy.id}
                isBusy={isBusy}
                occupancy={occupancy}
                onEnd={setEndingOccupancy}
                onInviteLink={(item) =>
                  inviteLink.mutate(item.id, {
                    onError: (cause) =>
                      setError(toMessage(cause, 'Chưa gửi được lời mời liên kết.')),
                  })
                }
                onMakeRepresentative={(item) =>
                  setRepresentative.mutate(item.id, {
                    onError: (cause) => setError(toMessage(cause, 'Chưa đổi được người đại diện.')),
                  })
                }
              />
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-xs font-bold uppercase tracking-[0.05em] text-ink-muted">
            Đã kết thúc ({past.length})
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0 opacity-75 xl:grid-cols-2">
            {past.map((occupancy) => (
              <OccupancyCard
                key={occupancy.id}
                isBusy={isBusy}
                isPast
                occupancy={occupancy}
                onEnd={setEndingOccupancy}
                onInviteLink={() => undefined}
                onMakeRepresentative={() => undefined}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {isAddOpen ? (
        <AddOccupantDialog
          hasRepresentative={hasRepresentative}
          isSaving={addOccupancy.isPending}
          onClose={() => {
            setIsAddOpen(false);
            setError(null);
          }}
          onSubmit={(input) => {
            setError(null);
            addOccupancy.mutate(input, {
              onSuccess: () => setIsAddOpen(false),
              onError: (cause) => setError(toMessage(cause, 'Chưa thêm được người ở.')),
            });
          }}
          roomCode={roomCode}
          roomId={roomId}
          submitError={error}
        />
      ) : null}

      {endingOccupancy ? (
        <EndOccupancyDialog
          isSaving={endOccupancy.isPending}
          occupancy={endingOccupancy}
          onClose={() => {
            setEndingOccupancy(null);
            setError(null);
          }}
          onConfirm={(endDate) => {
            setError(null);
            endOccupancy.mutate(
              { occupancyId: endingOccupancy.id, endDate },
              {
                onSuccess: () => setEndingOccupancy(null),
                onError: (cause) => setError(toMessage(cause, 'Chưa kết thúc được đợt ở.')),
              },
            );
          }}
          submitError={error}
        />
      ) : null}
    </main>
  );
}
