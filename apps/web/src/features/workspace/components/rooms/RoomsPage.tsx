'use client';

import type { RoomStatus } from '@tronhanh/schemas';
import { DoorClosed, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { useSurfaceAccess } from '@/features/session/hooks/useSurfaceAccess';
import { DeleteRoomDialog } from '@/features/workspace/components/rooms/DeleteRoomDialog';
import { PropertySwitcher } from '@/features/workspace/components/rooms/PropertySwitcher';
import { RoomCard } from '@/features/workspace/components/rooms/RoomCard';
import { RoomDetailDrawer } from '@/features/workspace/components/rooms/RoomDetailDrawer';
import { RoomFormDialog } from '@/features/workspace/components/rooms/RoomFormDialog';
import { RoomsToolbar } from '@/features/workspace/components/rooms/RoomsToolbar';
import { useProperties } from '@/features/workspace/hooks/useProperties';
import {
  useCreateRoom,
  useDeleteRoom,
  useRooms,
  useSetRoomStatus,
  useUpdateRoom,
} from '@/features/workspace/hooks/useRooms';
import type { RoomFilter, RoomListItem, RoomSort } from '@/features/workspace/types/room';
import { filterAndSortRooms } from '@/features/workspace/utils/filterRooms';

interface RoomsPageProps {
  sellerId: string;
  propertyId: string;
  propertyName: string;
}

/** Modal đang mở. Một state thay vì bốn cờ boolean — hai modal chồng nhau là lỗi UX thật. */
type ActiveDialog =
  | { type: 'create' }
  | { type: 'edit'; room: RoomListItem }
  | { type: 'delete'; room: RoomListItem }
  | null;

export function RoomsPage({ sellerId, propertyId, propertyName }: RoomsPageProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState<RoomFilter>('all');
  const [sort, setSort] = useState<RoomSort>('recent');
  const [selectedRoom, setSelectedRoom] = useState<RoomListItem | null>(null);
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const { data, isPending, isError } = useRooms(propertyId);
  const { data: propertiesData } = useProperties(sellerId);
  const { getLimitDenial } = useSurfaceAccess('workspace');

  const createRoom = useCreateRoom(propertyId, sellerId);
  const updateRoom = useUpdateRoom(propertyId, sellerId);
  const setRoomStatus = useSetRoomStatus(propertyId, sellerId);
  const deleteRoom = useDeleteRoom(propertyId, sellerId);

  const rooms = useMemo(
    () => filterAndSortRooms(data?.items ?? [], { keyword, filter, sort }),
    [data?.items, keyword, filter, sort],
  );

  const totalRoomsOfSeller = propertiesData?.totalRooms ?? 0;
  const roomLimitDenial = getLimitDenial('rooms', totalRoomsOfSeller);

  const closeDialog = () => {
    setDialog(null);
    setMutationError(null);
  };

  const handleChangeStatus = (room: RoomListItem, status: RoomStatus) => {
    setRoomStatus.mutate(
      { roomId: room.id, status },
      {
        onSuccess: (updated) => setSelectedRoom(updated),
        onError: (error) =>
          setMutationError(
            error instanceof Error ? error.message : 'Chưa đổi được trạng thái phòng.',
          ),
      },
    );
  };

  return (
    <main className="flex flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink-muted">
            <Link className="transition-colors hover:text-primary" href="/chu-tro/khu-tro">
              Khu trọ
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">{propertyName}</span>
          </nav>
          <h1 className="m-0 mt-1.5 text-[22px] font-extrabold text-ink md:text-[26px]">
            Quản lý phòng
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/chu-tro/khu-tro/${propertyId}`)}
            size="sm"
            variant="outline"
          >
            <Settings2 aria-hidden="true" className="size-4" />
            Cài đặt khu
          </Button>
          <PropertySwitcher
            currentPropertyId={propertyId}
            properties={propertiesData?.items ?? []}
          />
        </div>
      </header>

      {/* Chỉ vẽ khi không có dialog nào mở: modal phủ kín màn hình nên banner ở đây sẽ nằm
          sau lớp phủ. Lúc dialog mở, lỗi được truyền vào chính dialog đó. */}
      {mutationError && dialog === null ? (
        <p className="m-0 rounded-sm border border-error bg-error-soft px-4 py-3 text-[13px] font-semibold text-error">
          {mutationError}
        </p>
      ) : null}

      {roomLimitDenial ? (
        <p className="m-0 rounded-sm border border-warning bg-warning-soft px-4 py-3 text-[13px] font-semibold text-warning">
          {roomLimitDenial.message}
        </p>
      ) : null}

      {data ? (
        <RoomsToolbar
          addRoomBlockReason={roomLimitDenial?.message ?? null}
          counts={data.counts}
          filter={filter}
          keyword={keyword}
          onAddRoom={() => setDialog({ type: 'create' })}
          onFilterChange={setFilter}
          onKeywordChange={setKeyword}
          onSortChange={setSort}
          sort={sort}
        />
      ) : null}

      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((key) => (
            <Skeleton key={key} className="h-[164px] rounded-md" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          description="Vui lòng tải lại trang. Nếu vẫn lỗi, hãy thử lại sau ít phút."
          title="Chưa tải được danh sách phòng"
        />
      ) : rooms.length === 0 ? (
        /* Hai trạng thái rỗng khác nhau — khu chưa có phòng nào, và lọc không ra kết quả.
           Bản prototype từng gộp chúng thành "Thử đổi từ khóa tìm kiếm" kể cả khi người dùng
           chưa gõ gì; lúc đó lời khuyên đó vô nghĩa mà việc thật cần làm thì không có nút. */
        <EmptyState
          action={
            (data?.counts.all ?? 0) === 0 ? (
              <WriteGuardButton
                onClick={() => setDialog({ type: 'create' })}
                surface="workspace"
                variant="primary"
              >
                Thêm phòng đầu tiên
              </WriteGuardButton>
            ) : undefined
          }
          description={
            (data?.counts.all ?? 0) === 0
              ? `Thêm phòng đầu tiên vào ${propertyName} để quản lý người ở, chỉ số điện nước và hóa đơn.`
              : 'Thử đổi từ khóa tìm kiếm hoặc lọc theo trạng thái khác.'
          }
          icon={<DoorClosed aria-hidden="true" className="size-9 text-ink-muted" />}
          title={
            (data?.counts.all ?? 0) === 0
              ? 'Khu này chưa có phòng nào'
              : 'Không tìm thấy phòng phù hợp'
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} onSelect={setSelectedRoom} room={room} />
          ))}
        </div>
      )}

      {selectedRoom && dialog === null ? (
        <RoomDetailDrawer
          onChangeStatus={handleChangeStatus}
          onClose={() => setSelectedRoom(null)}
          onDelete={(room) => setDialog({ type: 'delete', room })}
          onEdit={(room) => {
            // Đóng drawer trước: hai lớp chồng nhau thì Esc đóng nhầm lớp dưới và người dùng
            // không biết mình đang ở form nào.
            setSelectedRoom(null);
            setDialog({ type: 'edit', room });
          }}
          propertyName={propertyName}
          room={selectedRoom}
        />
      ) : null}

      {dialog?.type === 'create' || dialog?.type === 'edit' ? (
        <RoomFormDialog
          isSaving={createRoom.isPending || updateRoom.isPending}
          onClose={closeDialog}
          onSubmit={(input) => {
            setMutationError(null);
            const onError = (error: unknown) =>
              setMutationError(
                error instanceof Error ? error.message : 'Chưa lưu được thông tin phòng.',
              );

            if (dialog.type === 'edit') {
              updateRoom.mutate(
                { roomId: dialog.room.id, input },
                { onSuccess: closeDialog, onError },
              );
              return;
            }
            createRoom.mutate(input, { onSuccess: closeDialog, onError });
          }}
          propertyId={propertyId}
          propertyName={propertyName}
          room={dialog.type === 'edit' ? dialog.room : null}
          submitError={mutationError}
        />
      ) : null}

      {dialog?.type === 'delete' ? (
        <DeleteRoomDialog
          error={mutationError}
          isDeleting={deleteRoom.isPending}
          onClose={closeDialog}
          onConfirm={() => {
            setMutationError(null);
            deleteRoom.mutate(dialog.room.id, {
              onSuccess: () => {
                setSelectedRoom(null);
                closeDialog();
              },
              onError: (error) =>
                setMutationError(error instanceof Error ? error.message : 'Chưa xóa được phòng.'),
            });
          }}
          room={dialog.room}
        />
      ) : null}
    </main>
  );
}
