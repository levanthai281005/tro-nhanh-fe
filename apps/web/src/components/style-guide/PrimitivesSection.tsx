'use client';

import { BellOff } from 'lucide-react';
import { useState } from 'react';
import { StyleGuideSection } from '@/components/style-guide/StyleGuideSection';
import { AppSelect } from '@/components/ui/AppSelect';
import { Badge, type RoomStatus } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ModalShell } from '@/components/ui/ModalShell';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, type TableColumn } from '@/components/ui/Table';
import { Toast } from '@/components/ui/Toast';

interface RoomRow {
  id: string;
  room: string;
  price: string;
  status: RoomStatus;
}

const TABLE_COLUMNS: TableColumn<RoomRow>[] = [
  { key: 'room', label: 'Phòng', width: '30%' },
  { key: 'price', label: 'Giá thuê' },
  { key: 'status', label: 'Trạng thái' },
];

const TABLE_ROWS: RoomRow[] = [
  { id: '1', room: 'Phòng 101', price: '3.500.000 đ', status: 'Available' },
  { id: '2', room: 'Phòng 102', price: '4.000.000 đ', status: 'Rented' },
];

const SELECT_OPTIONS = [
  { label: 'Phòng trọ', value: 'boarding-room' },
  { label: 'Căn hộ dịch vụ', value: 'serviced-apartment' },
  { label: 'Căn hộ chung cư', value: 'apartment' },
];

export function PrimitivesSection() {
  const [page, setPage] = useState(1);
  const [propertyType, setPropertyType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StyleGuideSection id="sec-8" title="8 · UI Primitives (Common)">
      <p className="mb-5 text-[13px] text-ink-muted">
        Bộ primitive dùng chung trong <code>src/components/ui/</code>.
      </p>
      <div className="flex flex-col gap-6">
        <div>
          <Tag>Button Primitive</Tag>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>

        <div>
          <Tag>Badge Primitive</Tag>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge kind="room" status="Available" />
            <Badge kind="room" status="Rented" />
            <Badge kind="room" status="Deposited" />
            <Badge kind="listing" status="Active" />
            <Badge kind="listing" status="PendingApproval" />
            <Badge kind="listing" status="Rejected" />
            <Badge kind="invoice" status="Paid" />
            <Badge kind="invoice" status="Unpaid" />
            <Badge kind="contract" status="Active" />
          </div>
        </div>

        <div>
          <Tag>Card Primitive</Tag>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <Card hoverable>
              <p className="font-semibold text-ink">Hoverable Card</p>
              <p className="mt-1 text-xs text-ink-muted">Di chuột để xem hiệu ứng viền & bóng.</p>
            </Card>
            <Card>
              <p className="font-semibold text-ink">Standard Card</p>
              <p className="mt-1 text-xs text-ink-muted">Nền trắng bo góc chuẩn.</p>
            </Card>
          </div>
        </div>

        <div>
          <Tag>Table Primitive</Tag>
          <Table
            columns={TABLE_COLUMNS}
            renderCell={(row, key) =>
              key === 'status' ? <Badge kind="room" status={row.status} /> : row[key]
            }
            rows={TABLE_ROWS}
          />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          <div>
            <Tag>Pagination Primitive</Tag>
            <Pagination onChange={setPage} page={page} pageSize={10} total={35} />
          </div>
          <div>
            <Tag>Toast Primitive</Tag>
            <div className="flex flex-col items-start gap-2">
              <Toast message="Cập nhật thông tin thành công" />
              <Toast message="Đã xảy ra lỗi kết nối" variant="error" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          <div>
            <Tag>EmptyState Primitive</Tag>
            <Card className="p-3">
              <EmptyState
                description="Bạn đã xem hết tất cả thông báo."
                icon={<BellOff aria-hidden="true" className="size-8" />}
                title="Chưa có thông báo"
              />
            </Card>
          </div>
          <div>
            <Tag>Skeleton Primitive</Tag>
            <Card>
              <Skeleton count={3} />
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          <div>
            <Tag>AppSelect Primitive</Tag>
            <div className="rounded-[10px] border-[1.5px] border-line bg-surface px-3 py-[9px]">
              <AppSelect
                onChange={setPropertyType}
                options={SELECT_OPTIONS}
                placeholder="Chọn loại hình"
                value={propertyType}
              />
            </div>
          </div>
          <div>
            <Tag>ModalShell Primitive</Tag>
            <Button onClick={() => setIsModalOpen(true)} variant="outline">
              Mở modal mẫu
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <ModalShell
          footer={
            <>
              <Button onClick={() => setIsModalOpen(false)} variant="ghost">
                Hủy
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Xác nhận</Button>
            </>
          }
          onClose={() => setIsModalOpen(false)}
          title="Xác nhận"
        >
          <p className="text-sm leading-6 text-ink-muted">Bạn có chắc muốn tiếp tục không?</p>
        </ModalShell>
      ) : null}
    </StyleGuideSection>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-ink-muted">
      {children}
    </span>
  );
}
