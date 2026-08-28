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
  /**
   * Route đã dựng chưa.
   *
   * Sidebar liệt kê đủ bản đồ khu Workspace từ đầu, nên trong lúc rebuild sẽ có mục trỏ tới
   * route chưa tồn tại. Bấm vào là ra 404 — người dùng không phân biệt được "chưa làm" với
   * "hỏng", và ở buổi demo thì đó là câu hỏi đầu tiên bị hỏi. Mục chưa sẵn sàng vẫn **hiện**
   * (để thấy sản phẩm sẽ có gì) nhưng không bấm được và nói rõ là sắp có.
   */
  isReady?: boolean;
}

/**
 * Link **cross-surface** — đích nằm ở Surface Marketplace, không phải màn SaaS.
 *
 * B4/B5 chạy trên `RentalListing`, miễn phí và không chịu gating, nên thuộc Marketplace
 * (`SURFACES_AND_MODES.md` §2). Trước đây chúng nằm ngay trong sidebar dưới nhãn "Tin đăng —
 * miễn phí", khiến một màn bị hai shell cùng nhận; khi Workspace tách sang
 * `quanly.tronhanh.vn` thì đó là lỗi thật chứ không còn là chuyện thẩm mỹ. Giữ lại lối đi
 * nhưng đặt đúng chỗ và ghi rõ là đang rời khỏi Workspace.
 */
const CROSS_SURFACE_NAV: WorkspaceNavItem[] = [
  { label: 'Tin đăng của tôi', href: '/tai-khoan/tin-cho-thue', Icon: FileText, isReady: true },
  { label: 'Đăng tin cho thuê', href: '/dang-tin-cho-thue', Icon: PlusCircle, isReady: true },
  { label: 'Tin nhắn', href: '/tin-nhan', Icon: MessageSquare }, // A11
  { label: 'Về trang tìm phòng', href: '/', Icon: Search, isReady: true },
];

/** `isReady` bật lên khi route tương ứng được dựng — xem `SCREENS_WORKSPACE.md`. */
const SAAS_NAV: WorkspaceNavItem[] = [
  { label: 'Tổng quan', href: '/chu-tro/tong-quan', Icon: LayoutDashboard }, // B3
  { label: 'Khu trọ & Phòng', href: '/chu-tro/khu-tro', Icon: Building2, isReady: true }, // B6/B8
  { label: 'Người ở & Hợp đồng', href: '/chu-tro/hop-dong', Icon: FileSignature, isReady: true }, // B11
  { label: 'Hóa đơn & Thanh toán', href: '/chu-tro/hoa-don', Icon: ReceiptText, isReady: true }, // B12
  { label: 'Gói dịch vụ', href: '/chu-tro/goi-dich-vu', Icon: Package }, // B15
];

export function WorkspaceShell({
  children,
  workspaceStatus = 'NONE',
  trialDaysLeft = 30,
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const mobileTitle = SAAS_NAV.find((item) => pathname.startsWith(item.href))?.label;

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
        <NavGroupLabel>Quản lý vận hành</NavGroupLabel>
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
        <NavGroupLabel>Trên Trọ Nhanh</NavGroupLabel>
        {CROSS_SURFACE_NAV.map((item) => (
          <WorkspaceNavLink key={item.href} item={item} pathname={pathname} />
        ))}
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
  const rowClassName =
    'flex items-center justify-between rounded-[10px] px-[13px] py-2.5 text-[13.5px] font-medium';

  // Route chưa dựng: hiện để thấy bản đồ tính năng, nhưng không phải là link — bấm vào 404
  // thì người dùng đọc thành "hỏng", không đọc thành "chưa làm".
  if (!item.isReady) {
    return (
      <span
        className={cn(rowClassName, 'cursor-default text-ink-muted/55')}
        title="Màn hình này đang được xây dựng"
      >
        <span className="flex items-center gap-3">
          <item.Icon aria-hidden="true" className="size-[17px]" />
          {item.label}
        </span>
        <span className="text-[10.5px] font-bold uppercase tracking-wide">Sắp có</span>
      </span>
    );
  }

  return (
    <Link
      className={cn(
        rowClassName,
        'text-ink-muted transition-colors hover:bg-canvas',
        isActive && 'bg-cream font-bold text-primary hover:bg-cream',
      )}
      href={isLocked ? '/chu-tro' : item.href}
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
      {/* Màn thông báo chưa dựng — giữ chỗ, không dẫn tới 404. */}
      <span
        aria-hidden="true"
        className="relative flex size-9 items-center justify-center rounded-full bg-surface/10 text-cream opacity-50"
        title="Màn hình thông báo đang được xây dựng"
      >
        <Bell className="size-[17px]" />
      </span>
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
        <SubscriptionCta className="bg-primary" label="Nâng cấp gói" />
      </div>
    );
  }

  if (status === 'READ_ONLY') {
    return (
      <div className="flex items-center justify-between gap-2.5 border-b border-error bg-error-soft px-5 py-2.5 text-[13px] font-bold text-error">
        <p>⚠️ Gói dịch vụ đã hết hạn. Workspace đang ở chế độ chỉ đọc.</p>
        <SubscriptionCta className="bg-error" label="Gia hạn gói" />
      </div>
    );
  }

  return null;
}

/**
 * Nút dẫn tới màn Gói dịch vụ (B15).
 *
 * B15 chưa dựng, nên nút hiện chỉ là nhãn tĩnh. Một CTA thanh toán dẫn tới 404 tệ hơn hẳn
 * việc chưa có CTA: người dùng đang muốn trả tiền mà gặp trang lỗi sẽ không thử lại. Khi B15
 * xong, đổi `IS_SUBSCRIPTION_PAGE_READY` thành `true` là nút sống lại.
 */
const IS_SUBSCRIPTION_PAGE_READY = false;

function SubscriptionCta({ label, className }: { label: string; className: string }) {
  if (!IS_SUBSCRIPTION_PAGE_READY) {
    return (
      <span
        className="shrink-0 rounded-sm border border-current px-3.5 py-1.5 text-xs opacity-70"
        title="Màn hình gói dịch vụ đang được xây dựng"
      >
        {label} · sắp có
      </span>
    );
  }

  return (
    <Link
      className={cn('shrink-0 rounded-sm px-3.5 py-1.5 text-xs text-surface', className)}
      href="/chu-tro/goi-dich-vu"
    >
      {label}
    </Link>
  );
}

function WorkspaceMobileTabs({
  pathname,
  workspaceStatus,
}: {
  pathname: string;
  workspaceStatus: WorkspaceStatus;
}) {
  const tabs = [
    { label: 'Tổng quan', href: '/chu-tro/tong-quan', Icon: LayoutDashboard, isReady: false },
    { label: 'Khu trọ', href: '/chu-tro/khu-tro', Icon: Building2, isReady: true },
    { label: 'Hóa đơn', href: '/chu-tro/hoa-don', Icon: ReceiptText, isReady: true },
    { label: 'Tài khoản', href: '/tai-khoan/ho-so', Icon: User, isFree: true, isReady: false },
  ];

  return (
    <nav className="sticky bottom-0 z-[80] flex h-[60px] shrink-0 border-t border-line bg-surface shadow-lg lg:hidden">
      {tabs.map((tab) => {
        const isLocked = workspaceStatus === 'NONE' && !tab.isFree;
        const isActive = pathname.startsWith(tab.href);

        // Cùng lý do với sidebar: tab chưa có route thì làm mờ và không bấm được, thay vì
        // đưa người dùng tới 404.
        if (!tab.isReady) {
          return (
            <span
              key={tab.href}
              className="flex min-h-11 flex-1 flex-col items-center justify-center gap-[3px] opacity-40"
              title="Màn hình này đang được xây dựng"
            >
              <tab.Icon
                aria-hidden="true"
                className="size-[22px] text-status-rented"
                strokeWidth={1.8}
              />
              <span className="text-[10px] text-status-rented">{tab.label}</span>
            </span>
          );
        }

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
