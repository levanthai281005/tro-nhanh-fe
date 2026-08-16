'use client';

import { FileText, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { Toast } from '@/components/ui/Toast';
import { BoostListingDialog } from '@/features/marketplace/components/my-listings/BoostListingDialog';
import { ConfirmListingDialog } from '@/features/marketplace/components/my-listings/ConfirmListingDialog';
import { MyListingCardList } from '@/features/marketplace/components/my-listings/MyListingCardList';
import { MyListingsFilters } from '@/features/marketplace/components/my-listings/MyListingsFilters';
import { MyListingsKpiCards } from '@/features/marketplace/components/my-listings/MyListingsKpiCards';
import { MyListingsTable } from '@/features/marketplace/components/my-listings/MyListingsTable';
import {
  useBoostListing,
  useDeleteListing,
  useMyListings,
  useRenewListing,
  useToggleListingVisibility,
} from '@/features/marketplace/hooks/useMyListings';
import type {
  MyListingFilters,
  MyListingRow,
  MyListingSort,
} from '@/features/marketplace/types/myListings';
import {
  countAdvancedFilters,
  EMPTY_MY_LISTING_FILTERS,
  filterMyListings,
} from '@/features/marketplace/utils/filterMyListings';

const PAGE_SIZE = 10;
const POST_LISTING_HREF = '/dang-tin-cho-thue';

type DialogKind = 'boost' | 'renew' | 'delete';

export interface MyListingsPageProps {
  sellerId: string;
}

export function MyListingsPage({ sellerId }: MyListingsPageProps) {
  const router = useRouter();
  const { data, isPending, isError } = useMyListings(sellerId);

  const [filters, setFilters] = useState<MyListingFilters>(EMPTY_MY_LISTING_FILTERS);
  const [sort, setSort] = useState<MyListingSort>('newest');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<{ kind: DialogKind; row: MyListingRow } | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleVisibility = useToggleListingVisibility(sellerId);
  const deleteListing = useDeleteListing(sellerId);
  const boostListing = useBoostListing(sellerId);
  const renewListing = useRenewListing(sellerId);

  const rows = data?.rows ?? [];
  const filteredRows = useMemo(() => filterMyListings(rows, filters, sort), [rows, filters, sort]);
  const pagedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const busyListingId = toggleVisibility.isPending ? toggleVisibility.variables?.listingId : null;

  const patchFilters = (patch: Partial<MyListingFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  };

  const closeDialog = () => {
    setDialog(null);
    setDialogError(null);
  };

  const openDialog = (kind: DialogKind, row: MyListingRow) => {
    setDialogError(null);
    setDialog({ kind, row });
  };

  const handleToggleVisibility = (row: MyListingRow) => {
    const nextStatus = row.status === 'Active' ? 'Hidden' : 'Active';
    toggleVisibility.mutate(
      { listingId: row.id, nextStatus },
      {
        onSuccess: () =>
          setToastMessage(nextStatus === 'Active' ? 'Đã hiện lại tin đăng.' : 'Đã ẩn tin đăng.'),
        onError: () => setToastMessage('Không đổi được trạng thái tin. Vui lòng thử lại.'),
      },
    );
  };

  const runDialogAction = (action: Promise<unknown>, successMessage: string) => {
    action
      .then(() => {
        closeDialog();
        setToastMessage(successMessage);
      })
      .catch((error: unknown) => {
        setDialogError(error instanceof Error ? error.message : 'Thao tác không thành công.');
      });
  };

  const tableHandlers = {
    busyListingId: busyListingId ?? null,
    onView: (row: MyListingRow) => router.push(`/phong/${row.id}`),
    onEdit: (row: MyListingRow) => router.push(`${POST_LISTING_HREF}/${row.id}`),
    onToggleVisibility: handleToggleVisibility,
    onBoost: (row: MyListingRow) => openDialog('boost', row),
    onRenew: (row: MyListingRow) => openDialog('renew', row),
    onDelete: (row: MyListingRow) => openDialog('delete', row),
  };

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1.5 text-[21px] font-extrabold tracking-[-0.02em] text-ink md:text-[28px]">
            Quản lý tin đăng
          </h1>
          <p className="m-0 text-[12.8px] text-ink-muted md:text-sm">
            Quản lý và theo dõi các tin cho thuê của bạn.
          </p>
        </div>
        <Button
          icon={<Plus aria-hidden="true" className="size-4" />}
          onClick={() => router.push(POST_LISTING_HREF)}
        >
          Đăng tin mới
        </Button>
      </header>

      <div className="flex flex-col gap-5">
        <MyListingsKpiCards isPending={isPending} stats={data?.stats} />

        {isError ? (
          <Card className="px-6 py-10 text-center" role="alert">
            <p className="m-0 font-semibold text-error">
              Không tải được danh sách tin đăng. Vui lòng thử lại.
            </p>
          </Card>
        ) : (
          <>
            <MyListingsFilters
              advancedCount={countAdvancedFilters(filters)}
              districts={data?.districts ?? []}
              filters={filters}
              isAdvancedOpen={isAdvancedOpen}
              onFiltersChange={patchFilters}
              onReset={() => {
                setFilters(EMPTY_MY_LISTING_FILTERS);
                setPage(1);
              }}
              onSortChange={setSort}
              onToggleAdvanced={() => setIsAdvancedOpen((open) => !open)}
              sort={sort}
            />

            {isPending ? (
              <Skeleton count={4} variant="row" />
            ) : rows.length === 0 ? (
              <Card className="px-6 py-12">
                <EmptyState
                  action={
                    <Button
                      icon={<Plus aria-hidden="true" className="size-4" />}
                      onClick={() => router.push(POST_LISTING_HREF)}
                    >
                      Đăng tin đầu tiên
                    </Button>
                  }
                  data-testid="my-listings-empty"
                  description="Đăng phòng trống của bạn để tiếp cận người đang tìm thuê."
                  icon={<FileText aria-hidden="true" className="size-6" />}
                  title="Bạn chưa có tin đăng nào"
                />
              </Card>
            ) : filteredRows.length === 0 ? (
              <Card className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <p className="m-0 text-sm text-ink-muted">
                  Không có tin đăng nào khớp điều kiện lọc.
                </p>
                <Button
                  onClick={() => {
                    setFilters(EMPTY_MY_LISTING_FILTERS);
                    setPage(1);
                  }}
                  size="sm"
                  variant="outline"
                >
                  Xóa bộ lọc
                </Button>
              </Card>
            ) : (
              <>
                <div className="hidden md:block">
                  <MyListingsTable rows={pagedRows} {...tableHandlers} />
                </div>
                <div className="md:hidden">
                  <MyListingCardList rows={pagedRows} {...tableHandlers} />
                </div>
                <Pagination
                  onChange={setPage}
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={filteredRows.length}
                />
              </>
            )}
          </>
        )}
      </div>

      {dialog?.kind === 'boost' ? (
        <BoostListingDialog
          errorMessage={dialogError}
          isSubmitting={boostListing.isPending}
          listingTitle={dialog.row.title}
          onClose={closeDialog}
          onConfirm={(days) =>
            runDialogAction(
              boostListing.mutateAsync({ listingId: dialog.row.id, days }),
              'Đã đẩy tin nổi bật.',
            )
          }
        />
      ) : null}

      {dialog?.kind === 'renew' ? (
        <ConfirmListingDialog
          confirmLabel="Gia hạn 60 ngày"
          description="Tin sẽ hiển thị lại thêm 60 ngày và không cần duyệt lại, miễn là bạn không sửa nội dung."
          errorMessage={dialogError}
          isSubmitting={renewListing.isPending}
          listingTitle={dialog.row.title}
          onClose={closeDialog}
          onConfirm={() =>
            runDialogAction(renewListing.mutateAsync(dialog.row.id), 'Đã gia hạn tin đăng.')
          }
          title="Gia hạn tin đăng"
        />
      ) : null}

      {dialog?.kind === 'delete' ? (
        <ConfirmListingDialog
          confirmLabel="Xóa tin"
          description="Tin đăng sẽ bị gỡ khỏi danh sách của bạn. Thao tác này không thể hoàn tác."
          errorMessage={dialogError}
          isDanger
          isSubmitting={deleteListing.isPending}
          listingTitle={dialog.row.title}
          onClose={closeDialog}
          onConfirm={() =>
            runDialogAction(deleteListing.mutateAsync(dialog.row.id), 'Đã xóa tin đăng.')
          }
          title="Xóa tin đăng"
        />
      ) : null}

      {toastMessage ? (
        <div className="fixed bottom-8 left-1/2 z-[600] -translate-x-1/2">
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      ) : null}
    </div>
  );
}
