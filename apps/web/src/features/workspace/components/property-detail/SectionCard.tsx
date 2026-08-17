import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/**
 * Khung một khối cài đặt trong màn chi tiết khu.
 *
 * Mỗi khối **lưu độc lập** thay vì một nút Lưu chung cuối trang: chủ trọ vào đây thường chỉ
 * để sửa đúng một thứ (điền số tài khoản, đổi giá điện), và một nút lưu chung buộc họ phải
 * tin rằng ba khối kia không bị đụng tới.
 */
export function SectionCard({
  title,
  description,
  children,
  footer,
  tone = 'default',
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  tone?: 'default' | 'danger';
}) {
  return (
    <section
      className={cn(
        'rounded-md border bg-surface',
        tone === 'danger' ? 'border-error' : 'border-line',
      )}
    >
      <div className="flex flex-col gap-4 p-4 md:p-[22px]">
        <div>
          <h2
            className={cn(
              'm-0 text-[17px] font-extrabold',
              tone === 'danger' ? 'text-error' : 'text-ink',
            )}
          >
            {title}
          </h2>
          {description ? (
            <p className="m-0 mt-1 text-[13px] leading-relaxed text-ink-muted">{description}</p>
          ) : null}
        </div>
        {children}
      </div>

      {footer ? (
        <div className="flex items-center justify-end gap-2 border-t border-line px-4 py-3 md:px-[22px]">
          {footer}
        </div>
      ) : null}
    </section>
  );
}

/** Thông báo kết quả của riêng một khối — đặt trong khối, không dồn lên đầu trang. */
export function SectionFeedback({
  error,
  successMessage,
}: {
  error: string | null;
  successMessage: string | null;
}) {
  if (error) {
    return (
      <p className="m-0 rounded-sm border border-error bg-error-soft px-3.5 py-2.5 text-[13px] font-semibold text-error">
        {error}
      </p>
    );
  }
  if (successMessage) {
    return (
      <p className="m-0 rounded-sm border border-success bg-success-soft px-3.5 py-2.5 text-[13px] font-semibold text-success">
        {successMessage}
      </p>
    );
  }
  return null;
}
