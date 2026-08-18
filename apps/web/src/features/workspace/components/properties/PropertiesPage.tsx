'use client';

import { Building2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { WriteGuardButton } from '@/features/session/components/WriteGuardButton';
import { useSurfaceAccess } from '@/features/session/hooks/useSurfaceAccess';
import { AddPropertyDialog } from '@/features/workspace/components/properties/AddPropertyDialog';
import { PropertyCard } from '@/features/workspace/components/properties/PropertyCard';
import { useProperties } from '@/features/workspace/hooks/useProperties';

/**
 * B6 — danh sách khu trọ.
 *
 * Prototype không có màn này: khu trọ chỉ là một dropdown ở header màn quản lý phòng, nên
 * chủ trọ có nhiều khu không có chỗ nào nhìn được toàn cảnh. Đây là màn viết mới theo
 * `SCREENS_WORKSPACE.md` B6.
 */
export function PropertiesPage({ sellerId }: { sellerId: string }) {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { data, isPending, isError } = useProperties(sellerId);
  const { getLimitDenial } = useSurfaceAccess('workspace');

  const properties = data?.items ?? [];
  const limitDenial = getLimitDenial('properties', properties.length);

  return (
    <main className="flex flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.05em] text-ink-muted">
            Quản lý vận hành
          </p>
          <h1 className="m-0 mt-1.5 text-[22px] font-extrabold text-ink md:text-[26px]">
            Khu trọ của tôi
          </h1>
          {data ? (
            <p className="m-0 mt-1 text-[13px] text-ink-muted">
              {data.items.length} khu · {data.totalRooms} phòng ·{' '}
              <strong className="text-status-available">{data.totalAvailable} đang trống</strong>
            </p>
          ) : null}
        </div>

        <WriteGuardButton
          disabled={limitDenial !== null}
          icon={<Plus aria-hidden="true" className="size-4" />}
          onClick={() => setIsAddOpen(true)}
          surface="workspace"
          title={limitDenial?.message}
          variant="primary"
        >
          Thêm khu trọ
        </WriteGuardButton>
      </header>

      {limitDenial ? (
        <p className="m-0 rounded-sm border border-warning bg-warning-soft px-4 py-3 text-[13px] font-semibold text-warning">
          {limitDenial.message}
        </p>
      ) : null}

      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-[168px] rounded-md" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          description="Vui lòng tải lại trang. Nếu vẫn lỗi, hãy thử lại sau ít phút."
          title="Chưa tải được danh sách khu trọ"
        />
      ) : properties.length === 0 ? (
        <EmptyState
          action={
            <WriteGuardButton
              onClick={() => setIsAddOpen(true)}
              surface="workspace"
              variant="primary"
            >
              Tạo khu trọ đầu tiên
            </WriteGuardButton>
          }
          description="Khu trọ là nơi chứa các phòng của bạn. Tạo khu đầu tiên để bắt đầu thêm phòng, ghi điện nước và xuất hóa đơn."
          icon={<Building2 aria-hidden="true" className="size-9 text-ink-muted" />}
          title="Bạn chưa có khu trọ nào"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {isAddOpen ? (
        <AddPropertyDialog
          onClose={() => setIsAddOpen(false)}
          onCreated={(propertyId) => {
            setIsAddOpen(false);
            // Đưa thẳng sang màn phòng của khu vừa tạo: việc tiếp theo của người dùng chắc
            // chắn là thêm phòng, không phải ngắm danh sách khu.
            router.push(`/chu-tro/khu-tro/${propertyId}/phong`);
          }}
          sellerId={sellerId}
        />
      ) : null}
    </main>
  );
}
