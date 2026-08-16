'use client';

import { Building2, Heart, Home, Search, Settings, Star, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface AccountShellProps {
  children: ReactNode;
}

interface AccountNavItem {
  label: string;
  href: string;
  Icon: LucideIcon;
}

const POST_NAV: AccountNavItem[] = [
  { label: 'Tin cho thuê của tôi', href: '/tai-khoan/tin-cho-thue', Icon: Building2 },
  { label: 'Tin nhu cầu của tôi', href: '/tai-khoan/tin-cua-toi', Icon: Search },
  { label: 'Tin đã lưu', href: '/tai-khoan/da-luu', Icon: Heart },
];

const RENTING_NAV: AccountNavItem[] = [
  { label: 'Phòng của tôi', href: '/tai-khoan/phong-cua-toi', Icon: Home },
  { label: 'Đánh giá của tôi', href: '/tai-khoan/danh-gia', Icon: Star },
];

const PROFILE_NAV: AccountNavItem[] = [
  { label: 'Hồ sơ & cài đặt', href: '/tai-khoan/ho-so', Icon: Settings },
];

/**
 * Khung khu vực tài khoản: sidebar điều hướng bên trái, nội dung chiếm phần còn lại, và
 * **cả cụm được căn giữa màn hình** để lề hai bên luôn cân nhau ở mọi kích thước.
 *
 * Mức chặn 1600px thay cho 1280px cũ: bản cũ hẹp tới mức bảng danh sách phải cuộn ngang
 * ngay cả trên màn 1920px. Trang nào cần hẹp hơn (form, bài đọc) thì tự đặt bề rộng riêng
 * bên trong `main`.
 */
export function AccountShell({ children }: AccountShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start gap-6 px-4 pb-[60px] pt-6 md:flex-row md:gap-8 md:px-6 lg:px-8">
      <aside className="w-full shrink-0 rounded-xl border border-line bg-surface px-3 py-4 md:sticky md:top-6 md:w-[248px]">
        <div className="border-b border-line px-3 pb-3 pt-2">
          <h2 className="m-0 text-base font-extrabold text-ink">Tài khoản của tôi</h2>
          <p className="mt-1 text-xs text-ink-muted">Tin đăng · Thuê trọ · Hồ sơ</p>
        </div>
        <nav className="flex flex-col gap-[3px]">
          <AccountNavGroup label="Tin của tôi" items={POST_NAV} pathname={pathname} />
          <AccountNavGroup label="Thuê trọ" items={RENTING_NAV} pathname={pathname} />
          <AccountNavGroup label="Hồ sơ" items={PROFILE_NAV} pathname={pathname} />
        </nav>
      </aside>
      <main className="w-full min-w-0 flex-1">{children}</main>
    </div>
  );
}

function AccountNavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: AccountNavItem[];
  pathname: string;
}) {
  return (
    <>
      <p className="mx-3 mb-1.5 mt-3.5 text-[11px] font-bold uppercase tracking-[0.07em] text-ink-muted">
        {label}
      </p>
      {items.map((item) => {
        const isSelected = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            className={cn(
              'flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:bg-canvas',
              isSelected && 'bg-cream font-bold text-primary hover:bg-cream',
            )}
            href={item.href}
          >
            <item.Icon
              aria-hidden="true"
              className={cn('size-4', isSelected ? 'text-primary' : 'text-ink-muted')}
            />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
