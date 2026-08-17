'use client';

import { DoorOpen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { DeletePropertyDialog } from '@/features/workspace/components/property-detail/DeletePropertyDialog';
import { PropertyInfoSection } from '@/features/workspace/components/property-detail/PropertyInfoSection';
import { PropertyPayoutSection } from '@/features/workspace/components/property-detail/PropertyPayoutSection';
import { PropertyPricingSection } from '@/features/workspace/components/property-detail/PropertyPricingSection';
import { PropertyPublicSection } from '@/features/workspace/components/property-detail/PropertyPublicSection';
import { SectionCard } from '@/features/workspace/components/property-detail/SectionCard';
import { useDeleteProperty, usePropertyDetail } from '@/features/workspace/hooks/usePropertyDetail';
import { useRooms } from '@/features/workspace/hooks/useRooms';
import { countBlockingRooms } from '@/features/workspace/services/propertiesService';

interface PropertyDetailPageProps {
  sellerId: string;
  propertyId: string;
}

/** B7 — chi tiết khu trọ: thông tin, đơn giá, nhận tiền, hồ sơ công khai, xóa khu. */
export function PropertyDetailPage({ sellerId, propertyId }: PropertyDetailPageProps) {
  const router = useRouter();
  const { data: property, isPending } = usePropertyDetail(propertyId);
  const { data: roomsResult } = useRooms(propertyId);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [blockingRoomCount, setBlockingRoomCount] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteProperty = useDeleteProperty(propertyId, sellerId);

  const openDeleteDialog = () => {
    setDeleteError(null);
    setBlockingRoomCount(null);
    setIsDeleteOpen(true);
    // Chỉ để hiển thị lý do trước khi bấm; biên chặn thật nằm trong service (và backend).
    void countBlockingRooms(propertyId).then(setBlockingRoomCount);
  };

  if (isPending) {
    return <main className="p-4 md:p-6" />;
  }

  if (!property) {
    return (
      <main className="p-4 md:p-6">
        <EmptyState description="Khu trọ này có thể đã bị xóa." title="Không tìm thấy khu trọ" />
      </main>
    );
  }

  const roomCount = roomsResult?.counts.all ?? 0;

  return (
    <main className="flex flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink-muted">
            <Link className="transition-colors hover:text-primary" href="/chu-tro/khu-tro">
              Khu trọ
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">{property.name}</span>
          </nav>
          <h1 className="m-0 mt-1.5 text-[22px] font-extrabold text-ink md:text-[26px]">
            Cài đặt khu trọ
          </h1>
        </div>

        <Button
          onClick={() => router.push(`/chu-tro/khu-tro/${propertyId}/phong`)}
          variant="outline"
        >
          <DoorOpen aria-hidden="true" className="size-4" />
          Quản lý {roomCount} phòng
        </Button>
      </header>

      <div className="flex max-w-3xl flex-col gap-5">
        <PropertyInfoSection property={property} sellerId={sellerId} />
        <PropertyPricingSection property={property} sellerId={sellerId} />
        <PropertyPayoutSection property={property} sellerId={sellerId} />
        <PropertyPublicSection property={property} sellerId={sellerId} />

        <SectionCard
          description={`Xóa khu trọ sẽ gỡ khu này cùng ${roomCount} phòng của nó khỏi màn quản lý. Không xóa được khi còn phòng đang cho thuê hoặc đã nhận cọc.`}
          title="Vùng nguy hiểm"
          tone="danger"
        >
          <div>
            <WriteGuardButton
              icon={<Trash2 aria-hidden="true" className="size-4" />}
              onClick={openDeleteDialog}
              surface="workspace"
              variant="danger"
            >
              Xóa khu trọ này
            </WriteGuardButton>
          </div>
        </SectionCard>
      </div>

      {isDeleteOpen ? (
        <DeletePropertyDialog
          blockingRoomCount={blockingRoomCount}
          error={deleteError}
          isDeleting={deleteProperty.isPending}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            setDeleteError(null);
            deleteProperty.mutate(undefined, {
              onSuccess: () => {
                setIsDeleteOpen(false);
                router.push('/chu-tro/khu-tro');
              },
              onError: (error) =>
                setDeleteError(error instanceof Error ? error.message : 'Chưa xóa được khu trọ.'),
            });
          }}
          propertyName={property.name}
          roomCount={roomCount}
        />
      ) : null}
    </main>
  );
}
