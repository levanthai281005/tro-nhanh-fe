'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  INVOICE_QUERY_KEYS,
  UTILITY_QUERY_KEYS,
} from '@/features/workspace/constants/workspaceQueryKeys';
import {
  getUtilityReadingRows,
  saveUtilityReadings,
} from '@/features/workspace/services/utilityReadingsService';
import type { SaveUtilityReadingsInput } from '@/features/workspace/types/utilityReading';

/** `staleTime: 0` — cùng lý do đã ghi ở `useProperties`: kho mock nằm trong từng tiến trình. */
// TODO: bỏ `staleTime: 0` khi nối API thật.
export function useUtilityReadings(
  sellerId: string | undefined,
  propertyId: string,
  period: string,
) {
  return useQuery({
    queryKey: UTILITY_QUERY_KEYS.byPeriod(sellerId, propertyId, period),
    queryFn: () => getUtilityReadingRows(propertyId, period),
    enabled: propertyId !== '',
    staleTime: 0,
  });
}

/**
 * Lưu cả bảng chỉ số trong một lần bấm.
 *
 * Service trả về **toàn bộ bảng** sau khi lưu, và ở đây ghi thẳng vào cache bằng
 * `setQueryData` trước khi `invalidate`. Hai lý do, cả hai đều là cạm bẫy đã gặp:
 *
 * - Một thao tác chạm **nhiều bản ghi**, nên ghi lẻ từng dòng vào cache sẽ để lộ trạng thái
 *   nửa vời (đúng kiểu đã làm màn hợp đồng hiện hai người cùng làm đại diện).
 * - Chỉ `invalidate` thôi thì có khoảng một giây thông báo "đã lưu" hiện ra trong khi bảng vẫn
 *   là số cũ, chờ refetch xong mới đổi.
 *
 * Hóa đơn cũng phải làm mới: ghi chỉ số xong là danh sách phòng đủ điều kiện xuất hóa đơn đổi
 * theo.
 */
export function useSaveUtilityReadings(sellerId: string, propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveUtilityReadingsInput) => saveUtilityReadings(propertyId, input),
    onSuccess: (rows, input) => {
      queryClient.setQueryData(
        UTILITY_QUERY_KEYS.byPeriod(sellerId, propertyId, input.period),
        rows,
      );
      void queryClient.invalidateQueries({ queryKey: INVOICE_QUERY_KEYS.all });
    },
  });
}
