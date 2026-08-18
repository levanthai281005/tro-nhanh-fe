'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PROPERTY_QUERY_KEYS } from '@/features/workspace/constants/workspaceQueryKeys';
import {
  deleteProperty,
  getPropertyById,
  setPropertyPublicProfile,
  updatePropertyInfo,
  updatePropertyPayout,
  updatePropertyPricing,
} from '@/features/workspace/services/propertiesService';
import type {
  Property,
  UpdatePropertyInfoInput,
  UpdatePropertyPayoutInput,
  UpdatePropertyPricingInput,
} from '@/features/workspace/types/property';

/** `staleTime: 0` — cùng lý do đã ghi ở `useProperties`: kho mock nằm trong từng tiến trình. */
// TODO: bỏ `staleTime: 0` khi nối API thật.
export function usePropertyDetail(propertyId: string) {
  return useQuery({
    queryKey: PROPERTY_QUERY_KEYS.detail(propertyId),
    queryFn: () => getPropertyById(propertyId),
    staleTime: 0,
  });
}

/**
 * Mutation trả về bản ghi khu đã cập nhật.
 *
 * Ghi **thẳng** kết quả vào cache chi tiết thay vì `invalidate` rồi đợi refetch: service đã
 * trả đúng bản ghi mới, nên đợi thêm một vòng chỉ tạo ra khoảng một giây mà thông báo "đã
 * lưu" đứng cạnh dữ liệu cũ — hai chỗ trên cùng màn hình nói ngược nhau.
 *
 * Danh sách khu vẫn `invalidate` vì nó là dữ liệu gộp (đếm phòng, cờ nhận tiền), không suy ra
 * được từ một bản ghi. Quên bước này thì đổi tên khu xong quay về B6 vẫn thấy tên cũ.
 */
function usePropertyWriteMutation<TVariables>(
  propertyId: string,
  sellerId: string,
  mutationFn: (variables: TVariables) => Promise<Property>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (updated) => {
      queryClient.setQueryData(PROPERTY_QUERY_KEYS.detail(propertyId), updated);
      void queryClient.invalidateQueries({ queryKey: PROPERTY_QUERY_KEYS.list(sellerId) });
    },
  });
}

export function useUpdatePropertyInfo(propertyId: string, sellerId: string) {
  return usePropertyWriteMutation(propertyId, sellerId, (input: UpdatePropertyInfoInput) =>
    updatePropertyInfo(propertyId, input),
  );
}

export function useUpdatePropertyPricing(propertyId: string, sellerId: string) {
  return usePropertyWriteMutation(propertyId, sellerId, (input: UpdatePropertyPricingInput) =>
    updatePropertyPricing(propertyId, input),
  );
}

export function useUpdatePropertyPayout(propertyId: string, sellerId: string) {
  return usePropertyWriteMutation(propertyId, sellerId, (input: UpdatePropertyPayoutInput) =>
    updatePropertyPayout(propertyId, input),
  );
}

export function useSetPropertyPublicProfile(propertyId: string, sellerId: string) {
  return usePropertyWriteMutation(propertyId, sellerId, (isEnabled: boolean) =>
    setPropertyPublicProfile(propertyId, isEnabled),
  );
}

/** Xóa thì không có bản ghi để ghi lại — chỉ dọn cache và để trang điều hướng về B6. */
export function useDeleteProperty(propertyId: string, sellerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteProperty(propertyId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: PROPERTY_QUERY_KEYS.detail(propertyId) });
      void queryClient.invalidateQueries({ queryKey: PROPERTY_QUERY_KEYS.list(sellerId) });
    },
  });
}
