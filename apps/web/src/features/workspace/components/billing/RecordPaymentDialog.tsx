'use client';

import type { PaymentMethod } from '@tronhanh/schemas';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormField, inputClassName } from '@/components/ui/FormField';
import { ModalShell } from '@/components/ui/ModalShell';
import { NumberField } from '@/components/ui/NumberField';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { useRecordPayment } from '@/features/workspace/hooks/useInvoices';
import type { InvoiceListItem } from '@/features/workspace/types/invoice';
import { cn } from '@/utils/cn';
import { formatVnd } from '@/utils/formatVnd';

const METHODS: ReadonlyArray<{ value: PaymentMethod; label: string }> = [
  { value: 'BankTransfer', label: 'Chuyển khoản' },
  { value: 'Cash', label: 'Tiền mặt' },
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Ghi nhận tiền đã nhận — AS-002, nền tảng không giữ tiền thuê.
 *
 * Ô số tiền điền sẵn **số còn thiếu**, không phải tổng hóa đơn. Đây chính là chỗ prototype sai:
 * nút của nó gửi thẳng `total_amount`, nên hóa đơn 3tr đã thu 1tr bấm một cái là sổ ghi nhận
 * 4tr — và vì trạng thái suy ra vẫn là "Paid" nên không có dấu hiệu nào để nhận ra.
 *
 * Vẫn cho **sửa** số tiền: thu một phần là chuyện thường ở nhà trọ, và ép đúng số còn thiếu
 * sẽ đẩy chủ trọ sang ghi sổ tay.
 */
export function RecordPaymentDialog({
  invoice,
  sellerId,
  onClose,
}: {
  invoice: InvoiceListItem;
  sellerId: string;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(String(invoice.remainingAmount));
  const [method, setMethod] = useState<PaymentMethod>('BankTransfer');
  const [paidAt, setPaidAt] = useState(todayIso);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recordPayment = useRecordPayment(sellerId);

  // Ô để trống ≠ số 0: `Number('')` ra `0` và sẽ trượt qua kiểm "phải lớn hơn 0" theo cách khó
  // hiểu ("số tiền phải lớn hơn 0" cho một ô nhìn thì thấy trống trơn).
  const parsedAmount = amount.trim() === '' ? null : Number(amount.replace(/\D/g, ''));
  const remainingAfter =
    parsedAmount === null ? invoice.remainingAmount : invoice.remainingAmount - parsedAmount;

  const handleSubmit = () => {
    setError(null);

    if (parsedAmount === null || parsedAmount === 0) {
      setError('Vui lòng nhập số tiền đã nhận.');
      return;
    }

    recordPayment.mutate(
      { invoiceId: invoice.id, amount: parsedAmount, method, paidAt, note: note.trim() || null },
      {
        onSuccess: onClose,
        onError: (cause) =>
          setError(cause instanceof Error ? cause.message : 'Chưa ghi nhận được khoản thu.'),
      },
    );
  };

  return (
    <ModalShell
      footer={
        <>
          <Button disabled={recordPayment.isPending} onClick={onClose} variant="ghost">
            Hủy
          </Button>
          <WriteGuardButton
            loading={recordPayment.isPending}
            onClick={handleSubmit}
            surface="workspace"
            variant="primary"
          >
            Ghi nhận
          </WriteGuardButton>
        </>
      }
      onClose={onClose}
      title={`Ghi nhận thu · ${invoice.roomCode}`}
    >
      {/* Lỗi hiển thị **bên trong** modal. Đặt ở trang nền thì nó nằm sau lớp phủ và người dùng
          chỉ thấy hộp thoại đứng im không rõ lý do. */}
      {error ? (
        <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
          {error}
        </p>
      ) : null}

      <p className="m-0 rounded-sm border border-line bg-canvas px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-muted">
        Hóa đơn {formatVnd(invoice.totalAmount)} · đã thu{' '}
        <strong className="text-ink">{formatVnd(invoice.paidAmount)}</strong> · còn thiếu{' '}
        <strong className="text-primary">{formatVnd(invoice.remainingAmount)}</strong>
      </p>

      <FormField isRequired label="Số tiền đã nhận">
        <NumberField
          hasError={remainingAfter < 0}
          onValueChange={setAmount}
          suffix="đ"
          value={amount}
          withThousandSeparator
        />
      </FormField>

      {remainingAfter < 0 ? (
        <p className="m-0 text-xs font-semibold text-error" role="alert">
          Vượt quá số còn thiếu {formatVnd(invoice.remainingAmount)}.
        </p>
      ) : remainingAfter > 0 ? (
        <p className="m-0 text-xs text-ink-muted">
          Sau khoản này còn thiếu {formatVnd(remainingAfter)}.
        </p>
      ) : (
        <p className="m-0 text-xs font-semibold text-success">Sau khoản này hóa đơn thu đủ.</p>
      )}

      <FormField isRequired label="Hình thức">
        <div className="flex gap-1.5">
          {METHODS.map((item) => (
            <button
              key={item.value}
              className={cn(
                'flex-1 rounded-sm border px-3.5 py-2.5 text-[13px] transition-colors',
                method === item.value
                  ? 'border-primary bg-cream font-bold text-primary'
                  : 'border-line bg-surface font-medium text-ink hover:border-sand',
              )}
              onClick={() => setMethod(item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField isRequired label="Ngày nhận">
        <input
          className={inputClassName}
          onChange={(event) => setPaidAt(event.target.value)}
          type="date"
          value={paidAt}
        />
      </FormField>

      <FormField label="Ghi chú">
        <input
          className={inputClassName}
          onChange={(event) => setNote(event.target.value)}
          placeholder="VD: Trả trước tiền phòng, còn lại cuối tháng"
          type="text"
          value={note}
        />
      </FormField>
    </ModalShell>
  );
}
