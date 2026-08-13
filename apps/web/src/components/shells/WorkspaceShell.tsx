'use client';

import {
  Bell,
  Building2,
  FileText,
  FileSignature,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Package,
  PlusCircle,
  ReceiptText,
  Search,
  User,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { cn } from '@/utils/cn';

export type WorkspaceStatus = 'NONE' | 'TRIAL' | 'ACTIVE' | 'READ_ONLY';

export interface WorkspaceShellProps {
  children: ReactNode;
  workspaceStatus?: WorkspaceStatus;
  trialDaysLeft?: number;
}

interface WorkspaceNavItem {
  label: string;
  href: string;
  Icon: LucideIcon;
}

const FREE_NAV: WorkspaceNavItem[] = [
  { label: 'Tin đăng của tôi', href: '/tai-khoan/tin-cho-thue', Icon: FileText },
  { label: 'Đăng tin cho thuê', href: '/dang-tin-cho-thue', Icon: PlusCircle },
];

const SAAS_NAV: WorkspaceNavItem[] = [
  { label: 'Tổng quan', href: '/chu-tro/tong-quan', Icon: LayoutDashboard },
  { label: 'Khu trọ & Phòng', href: '/chu-tro/khu-tro', Icon: Building2 },
  { label: 'Người ở & Hợp đồng', href: '/chu-tro/hop-dong', Icon: FileSignature },
  { label: 'Hóa đơn & Thanh toán', href: '/chu-tro/hoa-don', Icon: ReceiptText },
  { label: 'Gói dịch vụ', href: '/chu-tro/goi-dich-vu', Icon: Package },
];

export function WorkspaceShell({
  children,
  workspaceStatus = 'NONE',
  trialDaysLeft = 30,
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const mobileTitle = [...FREE_NAV, ...SAAS_NAV].find((item) =>
    pathname.startsWith(item.href),
  )?.label;

  return (
    <div className="flex min-h-screen bg-canvas">
      <WorkspaceSidebar pathname={pathname} workspaceStatus={workspaceStatus} />
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceMobileHeader title={mobileTitle ?? 'Workspace quản lý'} />
        <SubscriptionBanner status={workspaceStatus} trialDaysLeft={trialDaysLeft} />
        <div className="min-w-0 flex-1">{children}</div>
        <WorkspaceMobileTabs pathname={pathname} workspaceStatus={workspaceStatus} />
      </div>
    </div>
  );
}

function WorkspaceSidebar({
  pathname,
  workspaceStatus,
}: {
  pathname: string;
  workspaceStatus: WorkspaceStatus;
}) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="border-b border-line px-5 pb-[18px] pt-[22px]">
        <Link aria-label="Trọ Nhanh Workspace" href="/chu-tro">
          <BrandLogo size="sm" />
        </Link>
        <p className="mb-0.5 mt-2 text-[13px] font-bold text-ink">Workspace quản lý</p>
        <p className="m-0 text-[11.5px] text-ink-muted">Quản lý phòng trọ chuyên nghiệp</p>
      </div>

      <div className="flex items-center gap-3 border-b border-line bg-sand-soft/20 px-5 py-3.5">
        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-cream text-[15px] font-bold text-primary">
          C
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13.5px] font-bold text-ink">Chủ trọ</span>
          <span className="mt-0.5 block truncate text-[11.5px] text-ink-muted">
            Không gian vận hành
          </span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-[3px] overflow-y-auto px-3 py-3.5">
        <NavGroupLabel>Tin đăng — miễn phí</NavGroupLabel>
        {FREE_NAV.map((item) => (
          <WorkspaceNavLink key={item.href} item={item} pathname={pathname} />
        ))}

        <NavGroupLabel className="mt-4">Quản lý vận hành — SaaS</NavGroupLabel>
        {SAAS_NAV.map((item) => (
          <WorkspaceNavLink
            key={item.href}
            item={item}
            pathname={pathname}
            isLocked={workspaceStatus === 'NONE'}
          />
        ))}
      </nav>

      <div className="border-t border-line px-3 py-3.5">
        <Link
          className="flex items-center gap-3 rounded-[10px] px-[13px] py-2 text-[13px] font-medium text-ink-muted transition-colors hover:bg-canvas"
          href="/"
        >
          <Search aria-hidden="true" className="size-4" />
          Về trang tìm phòng
        </Link>
        <Link
          className="mt-1 flex items-center gap-3 rounded-[10px] px-[13px] py-2 text-[13px] font-medium text-ink-muted transition-colors hover:bg-canvas"
          href="/tin-nhan"
        >
          <MessageSquare aria-hidden="true" className="size-4" />
          Tin nhắn
        </Link>
      </div>
    </aside>
  );
}

function NavGroupLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'mx-3 mb-1.5 mt-1.5 text-[11px] font-bold uppercase tracking-[0.05em] text-ink-muted',
        className,
      )}
    >
      {children}
    </p>
  );
}

function WorkspaceNavLink({
  item,
  pathname,
  isLocked = false,
}: {
  item: WorkspaceNavItem;
  pathname: string;
  isLocked?: boolean;
}) {
  const isActive = pathname.startsWith(item.href);
  const href = isLocked ? '/chu-tro' : item.href;

  return (
    <Link
      className={cn(
        'flex items-center justify-between rounded-[10px] px-[13px] py-2.5 text-[13.5px] font-medium text-ink-muted transition-colors hover:bg-canvas',
        isActive && 'bg-cream font-bold text-primary hover:bg-cream',
      )}
      href={href}
      title={isLocked ? 'Kích hoạt dùng thử để mở tính năng này' : undefined}
    >
      <span className="flex items-center gap-3">
        <item.Icon aria-hidden="true" className="size-[17px]" />
        {item.label}
      </span>
      {isLocked ? <Lock aria-hidden="true" className="size-3.5 text-status-rented" /> : null}
    </Link>
  );
}

function WorkspaceMobileHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-[100] flex h-14 shrink-0 items-center gap-3 bg-primary-press px-4 shadow-lg lg:hidden">
      <BrandLogo className="text-cream" size="sm" />
      <span className="min-w-0 flex-1 truncate text-lg font-extrabold text-cream">{title}</span>
      <Link
        aria-label="Thông báo"
        className="relative flex size-9 items-center justify-center rounded-full bg-surface/10 text-cream"
        href="/thong-bao"
      >
        <Bell aria-hidden="true" className="size-[17px]" />
        <span className="absolute right-[9px] top-2 size-[7px] rounded-full bg-warning" />
      </Link>
    </header>
  );
}

function SubscriptionBanner({
  status,
  trialDaysLeft,
}: {
  status: WorkspaceStatus;
  trialDaysLeft: number;
}) {
  if (status === 'TRIAL') {
    return (
      <div className="flex items-center justify-between gap-2.5 border-b border-line bg-warning-soft px-5 py-2.5 text-[13px] font-bold text-primary">
        <p>⚡ Bạn đang sử dụng bản dùng thử SaaS. Còn {trialDaysLeft} ngày dùng thử.</p>
        <Link
          className="shrink-0 rounded-sm bg-primary px-3.5 py-1.5 text-xs text-surface"
          href="/chu-tro/goi-dich-vu"
        >
          Nâng cấp gói
        </Link>
      </div>
    );
  }

  if (status === 'READ_ONLY') {
    return (
      <div className="flex items-center justify-between gap-2.5 border-b border-error bg-error-soft px-5 py-2.5 text-[13px] font-bold text-error">
        <p>⚠️ Gói dịch vụ đã hết hạn. Workspace đang ở chế độ chỉ đọc.</p>
        <Link
          className="shrink-0 rounded-sm bg-error px-3.5 py-1.5 text-xs text-surface"
          href="/chu-tro/goi-dich-vu"
        >
          Gia hạn gói
        </Link>
      </div>
    );
  }

  return null;
}

function WorkspaceMobileTabs({
  pathname,
  workspaceStatus,
}: {
  pathname: string;
  workspaceStatus: WorkspaceStatus;
}) {
  const tabs = [
    { label: 'Tổng quan', href: '/chu-tro/tong-quan', Icon: LayoutDashboard },
    { label: 'Khu trọ', href: '/chu-tro/khu-tro', Icon: Building2 },
    { label: 'Hóa đơn', href: '/chu-tro/hoa-don', Icon: ReceiptText },
    { label: 'Tài khoản', href: '/tai-khoan/ho-so', Icon: User, isFree: true },
  ];

  return (
    <nav className="sticky bottom-0 z-[80] flex h-[60px] shrink-0 border-t border-line bg-surface shadow-lg lg:hidden">
      {tabs.map((tab) => {
        const isLocked = workspaceStatus === 'NONE' && !tab.isFree;
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            className="flex min-h-11 flex-1 flex-col items-center justify-center gap-[3px]"
            href={isLocked ? '/chu-tro' : tab.href}
          >
            <span className="relative">
              <tab.Icon
                aria-hidden="true"
                className={cn('size-[22px]', isActive ? 'text-primary' : 'text-status-rented')}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              {isLocked ? (
                <Lock className="absolute -right-2 -top-1 size-2.5 text-status-rented" />
              ) : null}
            </span>
            <span
              className={cn(
                'text-[10px]',
                isActive ? 'font-bold text-primary' : 'text-status-rented',
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
