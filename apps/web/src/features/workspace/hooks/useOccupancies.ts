'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  OCCUPANCY_QUERY_KEYS,
  ROOM_QUERY_KEYS,
} from '@/features/workspace/constants/workspaceQueryKeys';
import {
  addOccupancy,
  endOccupancy,
  getOccupancies,
  inviteOccupantLink,
  setContractRepresentative,
} from '@/features/workspace/services/occupanciesService';
import type { OccupanciesResult } from '@/features/workspace/services/occupanciesService';
import type { AddOccupancyInput } from '@/features/workspace/types/occupancy';

/** `staleTime: 0` — cùng lý do đã ghi ở `useProperties`: kho mock nằm trong từng tiến trình. */
// TODO: bỏ `staleTime: 0` khi nối API thật.
export function useOccupancies(roomId: string) {
  return useQuery({
    queryKey: OCCUPANCY_QUERY_KEYS.byRoom(roomId),
    queryFn: () => getOccupancies(roomId),
    staleTime: 0,
  });
}

/**
 * Mọi thay đổi người ở đều làm mới lưới phòng của khu.
 *
 * Thẻ phòng ở B8 hiện tên người đại diện và số người còn lại — thêm người ở đây mà quên
 * invalidate thì quay về lưới phòng vẫn thấy số cũ.
 */
function useOccupancyMutation<TVariables>(
  roomId: string,
  propertyId: string,
  mutationFn: (variables: TVariables) => Promise<OccupanciesResult>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (result) => {
      // Ghi thẳng trạng thái mới của phòng vào cache thay vì `invalidate` rồi đợi refetch —
      // nếu không, mất khoảng hai giây màn hình còn hiện người đại diện cũ sau khi đã bấm đổi.
      queryClient.setQueryData(OCCUPANCY_QUERY_KEYS.byRoom(roomId), result);
      // Lưới phòng là dữ liệu gộp (tên người đại diện, số người còn lại) nên vẫn phải nạp lại.
      void queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.byProperty(propertyId) });
    },
  });
}

export function useAddOccupancy(roomId: string, propertyId: string) {
  return useOccupancyMutation(roomId, propertyId, (input: AddOccupancyInput) =>
    addOccupancy(input),
  );
}

export function useEndOccupancy(roomId: string, propertyId: string) {
  return useOccupancyMutation(
    roomId,
    propertyId,
    (variables: { occupancyId: string; endDate: string }) =>
      endOccupancy(variables.occupancyId, variables.endDate),
  );
}

export function useSetContractRepresentative(roomId: string, propertyId: string) {
  return useOccupancyMutation(roomId, propertyId, (occupancyId: string) =>
    setContractRepresentative(occupancyId),
  );
}

export function useInviteOccupantLink(roomId: string, propertyId: string) {
  return useOccupancyMutation(roomId, propertyId, (occupancyId: string) =>
    inviteOccupantLink(occupancyId),
  );
}
