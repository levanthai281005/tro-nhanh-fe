'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CONTRACT_QUERY_KEYS,
  OCCUPANCY_QUERY_KEYS,
  PROPERTY_QUERY_KEYS,
  ROOM_QUERY_KEYS,
} from '@/features/workspace/constants/workspaceQueryKeys';
import {
  createContract,
  extendContract,
  getContractById,
  getContractsBySeller,
  terminateContract,
} from '@/features/workspace/services/contractsService';
import type { Contract, CreateContractInput } from '@/features/workspace/types/contract';

/** `staleTime: 0` — cùng lý do đã ghi ở `useProperties`: kho mock nằm trong từng tiến trình. */
// TODO: bỏ `staleTime: 0` khi nối API thật.
export function useContracts(sellerId: string | undefined) {
  return useQuery({
    queryKey: CONTRACT_QUERY_KEYS.bySeller(sellerId),
    queryFn: () => getContractsBySeller(sellerId),
    staleTime: 0,
  });
}

export function useContractDetail(contractId: string) {
  return useQuery({
    queryKey: CONTRACT_QUERY_KEYS.detail(contractId),
    queryFn: () => getContractById(contractId),
    staleTime: 0,
  });
}

/**
 * Mọi thao tác hợp đồng đều lan sang phòng và khu.
 *
 * BR-031 — tạo hợp đồng `Active` đổi `Room.status` sang `Rented`, kéo theo số "phòng trống"
 * trên thẻ khu ở B6. Quên làm mới hai chỗ đó thì màn hình nói ba con số khác nhau về cùng
 * một sự thật.
 */
function useContractMutation<TVariables>(
  sellerId: string,
  mutationFn: (variables: TVariables) => Promise<Contract>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (contract) => {
      void queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.bySeller(sellerId) });
      void queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.detail(contract.id) });
      void queryClient.invalidateQueries({ queryKey: PROPERTY_QUERY_KEYS.list(sellerId) });
      void queryClient.invalidateQueries({
        queryKey: OCCUPANCY_QUERY_KEYS.byRoom(contract.roomId),
      });
      // Làm mới lưới phòng của **mọi** khu, không phải một khu truyền vào.
      //
      // Màn danh sách hợp đồng trải khắp các khu nên không biết trước hợp đồng vừa tạo thuộc
      // khu nào; nhận `propertyId` từ nơi gọi thì màn này luôn truyền `undefined` và lưới
      // phòng lặng lẽ không bao giờ được nạp lại — BR-031 đổi `Room.status` mà màn phòng vẫn
      // hiện trạng thái cũ.
      void queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.all });
    },
  });
}

export function useCreateContract(sellerId: string) {
  return useContractMutation(sellerId, (input: CreateContractInput) => createContract(input));
}

export function useExtendContract(sellerId: string) {
  return useContractMutation(sellerId, (variables: { contractId: string; newEndDate: string }) =>
    extendContract(variables.contractId, variables.newEndDate),
  );
}

export function useTerminateContract(sellerId: string) {
  return useContractMutation(sellerId, (variables: { contractId: string; reason: string }) =>
    terminateContract(variables.contractId, variables.reason),
  );
}
