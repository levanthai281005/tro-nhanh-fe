'use client';

import { AlertTriangle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AppSelect } from '@/components/ui/AppSelect';
import { Button } from '@/components/ui/Button';
import { FieldBox, FormField, inputClassName } from '@/components/ui/FormField';
import { FormSection } from '@/components/ui/FormSection';
import { ModalShell } from '@/components/ui/ModalShell';
import { NumberField } from '@/components/ui/NumberField';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { InvoiceDraftLines } from '@/features/workspace/components/billing/InvoiceDraftLines';
import { useCreateInvoice, useInvoiceRoomOptions } from '@/features/workspace/hooks/useInvoices';
import type { CreateInvoiceItemInput, InvoiceListItem } from '@/features/workspace/types/invoice';
import { buildInvoiceDraft, defaultDueDate } from '@/features/workspace/utils/buildInvoiceDraft';
import { buildPeriodOptions, formatPeriod } from '@/features/workspace/utils/period';
import { formatVnd } from '@/utils/formatVnd';

function toNumber(raw: string): number {
  return raw.trim() === '' ? 0 : Number(raw.replace(/\D/g, ''));
}

export function CreateInvoiceDialog({
  sellerId,
  defaultPeriod,
  onClose,
  onCreated,
}: {
  sellerId: string;
  defaultPeriod: string;
  onClose: () => void;
  onCreated: (invoice: InvoiceListItem) => void;
}) {
  const [period, setPeriod] = useState(defaultPeriod);
  const [roomId, setRoomId] = useState('');
  const [dueDate, setDueDate] = useState(() => defaultDueDate(defaultPeriod));
  const [rentAmount, setRentAmount] = useState('');
  const [serviceAmount, setServiceAmount] = useState('');
  const [otherLabel, setOtherLabel] = useState('');
  const [otherAmount, setOtherAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: rooms = [], isPending } = useInvoiceRoomOptions(sellerId, period);
  const createInvoice = useCreateInvoice(sellerId);

  const selectable = useMemo(() => rooms.filter((item) => !item.hasInvoiceForPeriod), [rooms]);
  const selectedRoom = selectable.find((item) => item.roomId === roomId) ?? null;
  const blockedCount = rooms.length - selectable.length;

  // Đổi kỳ thì tập phòng chọn được đổi theo (kỳ đó phòng nào đã có hóa đơn rồi), nên phải chọn
  // lại phòng và dời hạn thanh toán — giữ nguyên là xuất hóa đơn kỳ này với hạn của kỳ khác.
  useEffect(() => {
    setDueDate(defaultDueDate(period));
  }, [period]);

  useEffect(() => {
    if (selectable.length === 0) {
      setRoomId('');
      return;
    }
    setRoomId((current) =>
      selectable.some((item) => item.roomId === current) ? current : (selectable[0]?.roomId ?? ''),
    );
  }, [selectable]);

  useEffect(() => {
    if (!selectedRoom) return;
    setRentAmount(String(selectedRoom.rentPrice));
    setServiceAmount(String(selectedRoom.servicePrice));
  }, [selectedRoom]);

  const draftLines = useMemo(
    () => (selectedRoom ? buildInvoiceDraft(selectedRoom, period) : []),
    [selectedRoom, period],
  );

  const items = useMemo<readonly CreateInvoiceItemInput[]>(() => {
    if (!selectedRoom) return [];

    const utilityItems = draftLines
      .filter((line) => line.type === 'Electricity' || line.type === 'Water')
      .filter((line) => line.isIncluded && line.amount > 0)
      .map(({ type, description, quantity, unitPrice, amount }) => ({
        type,
        description,
        quantity,
        unitPrice,
        amount,
      }));

    const rent = toNumber(rentAmount);
    const service = toNumber(serviceAmount);
    const other = toNumber(otherAmount);

    return [
      {
        type: 'Rent' as const,
        description: `Tiền phòng kỳ ${period}`,
        quantity: 1,
        unitPrice: rent,
        amount: rent,
      },
      ...utilityItems,
      ...(service > 0
        ? [
            {
              type: 'Service' as const,
              description: `Phí dịch vụ kỳ ${period}`,
              quantity: 1,
              unitPrice: service,
              amount: service,
            },
          ]
        : []),
      ...(other > 0
        ? [
            {
              type: 'Other' as const,
              description: otherLabel.trim() === '' ? `Khoản khác kỳ ${period}` : otherLabel.trim(),
              quantity: 1,
              unitPrice: other,
              amount: other,
            },
          ]
        : []),
    ];
  }, [selectedRoom, draftLines, rentAmount, serviceAmount, otherAmount, otherLabel, period]);

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = () => {
    if (!selectedRoom) return;
    setError(null);

    createInvoice.mutate(
      {
        roomId: selectedRoom.roomId,
        contractId: selectedRoom.contractId,
        period,
        dueDate,
        items,
      },
      {
        onSuccess: onCreated,
        onError: (cause) =>
          setError(cause instanceof Error ? cause.message : 'Chưa tạo được hóa đơn.'),
      },
    );
  };

  return (
    <ModalShell
      footer={
        <>
          <Button disabled={createInvoice.isPending} onClick={onClose} variant="ghost">
            Hủy
          </Button>
          <WriteGuardButton
            disabled={!selectedRoom || total <= 0}
            loading={createInvoice.isPending}
            onClick={handleSubmit}
            surface="workspace"
            variant="primary"
          >
            Tạo hóa đơn {total > 0 ? formatVnd(total) : ''}
          </WriteGuardButton>
        </>
      }
      onClose={onClose}
      size="lg"
      title="Tạo hóa đơn"
    >
      <div className="flex flex-col gap-6">
        {error ? (
          <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
            {error}
          </p>
        ) : null}

        <FormSection
          description="Chỉ hiện phòng đang có hợp đồng hiệu lực — hóa đơn gắn với hợp đồng, mỗi kỳ một hóa đơn."
          title="Phòng và kỳ"
        >
          <div className="grid gap-3.5 sm:grid-cols-2">
            <FormField isRequired label="Kỳ hóa đơn">
              <FieldBox>
                <AppSelect
                  onChange={setPeriod}
                  options={buildPeriodOptions().map((item) => ({
                    value: item,
                    label: formatPeriod(item),
                  }))}
                  value={period}
                />
              </FieldBox>
            </FormField>

            <FormField isRequired label="Hạn thanh toán">
              <input
                className={inputClassName}
                onChange={(event) => setDueDate(event.target.value)}
                type="date"
                value={dueDate}
              />
            </FormField>
          </div>

          <FormField
            hint={
              blockedCount > 0
                ? `${blockedCount} phòng đã có hóa đơn kỳ này nên không hiện ở đây.`
                : undefined
            }
            isRequired
            label="Phòng"
          >
            <FieldBox>
              <AppSelect
                onChange={setRoomId}
                options={selectable.map((item) => ({
                  value: item.roomId,
                  label: `${item.roomCode} · ${item.propertyName} · ${item.occupantName}`,
                }))}
                placeholder={isPending ? 'Đang tải…' : 'Chưa có phòng nào'}
                searchable
                value={roomId}
              />
            </FieldBox>
          </FormField>
        </FormSection>

        {selectedRoom ? (
          <>
            <InvoiceDraftLines lines={draftLines} period={period} />

            <FormSection title="Số tiền">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <FormField
                  hint="Lấy từ hợp đồng, không lấy giá niêm yết của phòng."
                  isRequired
                  label="Tiền phòng"
                >
                  <NumberField
                    onValueChange={setRentAmount}
                    suffix="đ"
                    value={rentAmount}
                    withThousandSeparator
                  />
                </FormField>
                <FormField label="Phí dịch vụ">
                  <NumberField
                    onValueChange={setServiceAmount}
                    suffix="đ"
                    value={serviceAmount}
                    withThousandSeparator
                  />
                </FormField>
                <FormField label="Khoản khác">
                  <input
                    className={inputClassName}
                    onChange={(event) => setOtherLabel(event.target.value)}
                    placeholder="VD: Phí gửi xe tháng 8"
                    type="text"
                    value={otherLabel}
                  />
                </FormField>
                <FormField label="Số tiền khoản khác">
                  <NumberField
                    onValueChange={setOtherAmount}
                    suffix="đ"
                    value={otherAmount}
                    withThousandSeparator
                  />
                </FormField>
              </div>
            </FormSection>
          </>
        ) : isPending ? null : (
          <p className="m-0 flex items-start gap-2.5 rounded-sm border border-line bg-canvas px-3.5 py-3 text-[13px] leading-relaxed text-ink-muted">
            <AlertTriangle aria-hidden="true" className="mt-px size-4 shrink-0 text-warning" />
            <span>
              Không có phòng nào xuất được hóa đơn kỳ {formatPeriod(period)}. Phòng phải{' '}
              <strong className="text-ink">đang có hợp đồng hiệu lực</strong> và{' '}
              <strong className="text-ink">chưa có hóa đơn kỳ này</strong>.
            </span>
          </p>
        )}
      </div>
    </ModalShell>
  );
}
