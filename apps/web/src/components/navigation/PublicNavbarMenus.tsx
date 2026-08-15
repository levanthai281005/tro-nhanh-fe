'use client';

import { Building2, KeyRound, UserSearch } from 'lucide-react';
import Link from 'next/link';
import type { NavbarViewer } from '@/components/navigation/PublicNavbar';

export interface PostMenuProps {
  onClose: () => void;
}

export interface AccountMenuProps {
  viewer: NavbarViewer;
  onClose: () => void;
  onSignOut?: () => void;
}

export function PostMenu(props: PostMenuProps) {
  const { onClose } = props;

  return (
    <div className="absolute right-0 top-[calc(100%+10px)] z-[200] w-[290px] rounded-xl border border-line bg-surface p-2 shadow-xl">
      <p className="mx-2.5 mb-2 mt-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-ink-muted">
        Chọn loại tin đăng
      </p>
      <MenuCard
        description="Dành cho chủ trọ muốn đăng phòng cho thuê."
        href="/chu-tro/dang-tin"
        Icon={KeyRound}
        onClose={onClose}
        title="Đăng tin cho thuê"
      />
      <MenuCard
        description="Dành cho người thuê muốn đăng nhu cầu tìm phòng."
        href="/tai-khoan/dang-tin-nhu-cau"
        Icon={UserSearch}
        onClose={onClose}
        title="Đăng tin tìm phòng"
      />
    </div>
  );
}

export function AccountMenu(props: AccountMenuProps) {
  const { viewer, onClose, onSignOut } = props;
  const isStaff = viewer.roles?.some((role) => role === 'Admin' || role === 'Moderator');
  const items = [
    { label: 'Hồ sơ', testId: 'account-menu-profile', href: '/tai-khoan/ho-so' },
    {
      label: 'Tin đăng của tôi',
      testId: 'account-menu-listings',
      href: '/tai-khoan/tin-cho-thue',
    },
    { label: 'Tin nhắn', testId: 'account-menu-messages', href: '/tin-nhan' },
    { label: 'Tin đã lưu', testId: 'account-menu-saved', href: '/tai-khoan/da-luu' },
    ...(isStaff
      ? [{ label: 'Quản trị hệ thống', testId: 'account-menu-admin', href: '/admin' }]
      : []),
    {
      label: 'Dashboard chủ trọ',
      testId: 'account-menu-workspace',
      href: '/chu-tro',
    },
  ];

  return (
    <div className="absolute right-0 top-[calc(100%+10px)] z-[200] w-[210px] rounded-lg border border-line bg-surface py-1.5 shadow-xl">
      {items.map((item) => (
        <Link
          key={item.href}
          className="block px-4 py-2.5 text-sm text-ink transition-colors hover:bg-canvas"
          data-testid={item.testId}
          href={item.href}
          onClick={onClose}
        >
          {item.label}
        </Link>
      ))}
      {onSignOut ? (
        <button
          className="mt-1 block w-full border-t border-line px-4 py-2.5 text-left text-sm text-error transition-colors hover:bg-error-soft"
          data-testid="account-menu-signout"
          onClick={() => {
            onSignOut();
            onClose();
          }}
          type="button"
        >
          Đăng xuất
        </button>
      ) : null}
    </div>
  );
}

interface MenuCardProps {
  description: string;
  href: string;
  Icon: typeof Building2;
  onClose: () => void;
  title: string;
}

function MenuCard({ description, href, Icon, onClose, title }: MenuCardProps) {
  return (
    <Link
      className="flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors hover:bg-canvas"
      href={href}
      onClick={onClose}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-cream">
        <Icon aria-hidden="true" className="size-[17px] text-primary" strokeWidth={1.8} />
      </span>
      <span>
        <span className="mb-0.5 block text-[13px] font-bold text-ink">{title}</span>
        <span className="block text-xs leading-[1.45] text-ink-muted">{description}</span>
      </span>
    </Link>
  );
}
