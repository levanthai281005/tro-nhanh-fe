'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PROPERTY_QUERY_KEYS } from '@/features/workspace/constants/workspaceQueryKeys';
import { createProperty, getProperties } from '@/features/workspace/services/propertiesService';
import type { CreatePropertyInput } from '@/features/workspace/types/property';

/**
 * `staleTime: 0` là cố ý, và chỉ đúng chừng nào tầng dữ liệu còn là mock.
 *
 * Kho mock nằm trong bộ nhớ **từng tiến trình**: bản ở server (nơi chạy prefetch) không thấy
 * mutation người dùng vừa làm trên trình duyệt. Với `staleTime` mặc định 30s của app, dữ liệu
 * server ghi đè cache client rồi được coi là còn tươi — chủ trọ thêm phòng xong quay lại danh
 * sách khu vẫn thấy số cũ và tưởng thao tác hỏng. Prefetch vẫn giữ để có nội dung ngay ở lần
 * sơn đầu; refetch khi mount là bước hòa giải.
 */
// TODO: bỏ `staleTime: 0` khi nối API thật — lúc đó server và client cùng một nguồn.
export function useProperties(sellerId: string | undefined) {
  return useQuery({
    queryKey: PROPERTY_QUERY_KEYS.list(sellerId),
    queryFn: () => getProperties(sellerId),
    staleTime: 0,
  });
}

export function useCreateProperty(sellerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePropertyInput) => createProperty(sellerId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROPERTY_QUERY_KEYS.list(sellerId) });
    },
  });
}
