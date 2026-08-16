export interface SearchPageHeaderProps {
  total: number;
  isFiltered: boolean;
}

export function SearchPageHeader({ total, isFiltered }: SearchPageHeaderProps) {
  return (
    <header className="border-b border-line bg-sand-soft px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="mb-2.5 flex items-center gap-2 text-[13px] text-ink-muted">
          <span>Trang chủ</span>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-ink">{isFiltered ? 'Kết quả tìm phòng' : 'Tất cả phòng'}</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-black tracking-[-0.02em] text-ink">
              {isFiltered ? 'Kết quả tìm phòng' : 'Tất cả phòng đang đăng'}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              {isFiltered
                ? 'Các phòng phù hợp với tiêu chí bạn đã chọn.'
                : 'Khám phá các phòng trọ, căn hộ dịch vụ và căn hộ phù hợp với nhu cầu của bạn.'}
            </p>
          </div>
          {total > 0 ? (
            <p className="text-sm text-ink-muted">
              <span className="mr-1.5 text-[26px] font-black tracking-[-0.02em] text-primary">
                {total.toLocaleString('vi-VN')}
              </span>
              phòng đang đăng
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
