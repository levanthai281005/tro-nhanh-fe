'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  INVOICE_QUERY_KEYS,
  UTILITY_QUERY_KEYS,
} from '@/features/workspace/constants/workspaceQueryKeys';
import { getInvoiceRoomOptions } from '@/features/workspace/services/invoiceOptionsService';
import {
  createInvoice,
  getInvoicesBySeller,
  markInvoiceSent,
  recordPayment,
} from '@/features/workspace/services/invoicesService';
import type {
  CreateInvoiceInput,
  InvoiceListItem,
  RecordPaymentInput,
} from '@/features/workspace/types/invoice';

// TODO: bỏ `staleTime: 0` khi nối API thật (kho mock nằm trong từng tiến trình).
export function useInvoices(sellerId: string | undefined) {
  return useQuery({
    queryKey: INVOICE_QUERY_KEYS.bySeller(sellerId),
    queryFn: () => getInvoicesBySeller(sellerId),
    staleTime: 0,
  });
}

export function useInvoiceRoomOptions(sellerId: string | undefined, period: string) {
  return useQuery({
    queryKey: INVOICE_QUERY_KEYS.roomOptions(sellerId, period),
    queryFn: () => getInvoiceRoomOptions(sellerId, period),
    staleTime: 0,
  });
}

/**
 * Nền chung cho mọi mutation hóa đơn.
 *
 * Service trả về **bản ghi mới của cả hóa đơn** (kèm trạng thái đã suy lại và danh sách thu),
 * nên ghi thẳng vào danh sách đang hiển thị trước rồi mới `invalidate`: chỉ `invalidate` thôi
 * sẽ để lộ khoảng một giây thông báo "đã ghi nhận" hiện ra trong khi badge vẫn là trạng thái cũ.
 *
 * `UTILITY_QUERY_KEYS.all` cũng phải làm mới, và phải là **cả nhánh**: tạo hóa đơn khóa chỉ số
 * của kỳ đó lại, nhưng màn này không biết chắc bảng chỉ số đang mở ở khu nào và kỳ nào. Truyền
 * khóa hẹp xuống là cái bẫy im lặng đã gặp ở B11 — bảng vẫn cho sửa ô đã bị khóa.
 */
function useInvoiceMutation<TVariables>(
  sellerId: string,
  mutationFn: (variables: TVariables) => Promise<InvoiceListItem>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (invoice) => {
      queryClient.setQueryData(
        INVOICE_QUERY_KEYS.bySeller(sellerId),
        (current: { items: readonly InvoiceListItem[] } | undefined) => {
          if (!current) return current;
          const items = current.items.some((item) => item.id === invoice.id)
            ? current.items.map((item) => (item.id === invoice.id ? invoice : item))
            : [invoice, ...current.items];
          return { ...current, items };
        },
      );

      // Tổng ở đầu màn và danh sách kỳ đều là giá trị dẫn xuất — để service tính lại thay vì
      // vá bằng tay ở đây, nếu không hai chỗ sẽ trôi khỏi nhau.
      void queryClient.invalidateQueries({ queryKey: INVOICE_QUERY_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: UTILITY_QUERY_KEYS.all });
    },
  });
}

export function useCreateInvoice(sellerId: string) {
  return useInvoiceMutation(sellerId, (input: CreateInvoiceInput) => createInvoice(input));
}

export function useRecordPayment(sellerId: string) {
  return useInvoiceMutation(sellerId, (input: RecordPaymentInput) => recordPayment(input));
}

export function useMarkInvoiceSent(sellerId: string) {
  return useInvoiceMutation(sellerId, (invoiceId: string) => markInvoiceSent(invoiceId));
}
