'use client';

import { ChevronDown, Heart, MessageSquare, Search, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import type { PublicNavbarProps } from '@/components/navigation/PublicNavbar';
import { AccountMenu, PostMenu } from '@/components/navigation/PublicNavbarMenus';
import { cn } from '@/utils/cn';

export function PublicNavbarDesktop({
  searchQuery = '',
  onSearchChange,
  viewer,
  unreadCount = 0,
  onSignOut,
}: PublicNavbarProps) {
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const postMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setLocalQuery(searchQuery), [searchQuery]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!postMenuRef.current?.contains(target)) setIsPostMenuOpen(false);
      if (!accountMenuRef.current?.contains(target)) setIsAccountMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToSearch = (event?: FormEvent) => {
    event?.preventDefault();
    const query = localQuery.trim();
    router.push(query ? `/tim-phong?loc=${encodeURIComponent(query)}` : '/tim-phong');
  };

  return (
    <nav
      // Khoảng 1024–1279px chỉ vừa đủ chỗ: thu gọn padding và khoảng cách, nới lại từ `xl`.
      className={cn(
        'sticky top-0 z-[100] flex h-[68px] items-center gap-2 border-b bg-surface px-4 transition duration-200 xl:gap-4 xl:px-7',
        isScrolled ? 'border-line shadow-md' : 'border-transparent shadow-sm',
      )}
    >
      <Link aria-label="Trọ Nhanh - Trang chủ" className="shrink-0 py-1" href="/">
        <BrandLogo size="md" />
      </Link>

      <div className="flex min-w-0 flex-1 justify-center px-2 xl:px-5">
        <form
          className="flex w-full max-w-[450px] items-center gap-2.5 rounded-full border-[1.5px] border-line bg-surface py-2 pl-[18px] pr-3.5 shadow-sm transition focus-within:border-sand hover:border-sand"
          onSubmit={goToSearch}
        >
          <Search aria-hidden="true" className="size-[15px] shrink-0 text-ink-muted" />
          <input
            aria-label="Tìm khu vực"
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-muted/60"
            onChange={(event) => {
              setLocalQuery(event.target.value);
              onSearchChange?.(event.target.value);
            }}
            placeholder="Tìm khu vực, phường, tên trường..."
            value={localQuery}
          />
          <span aria-hidden="true" className="h-4 w-px shrink-0 bg-line" />
          <button
            className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-surface transition-colors hover:bg-primary-hover active:bg-primary-press"
            type="submit"
          >
            Tìm
          </button>
        </form>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <NavLink href="/tim-phong">Tìm phòng</NavLink>
        <NavLink href="/tin-tim-phong">Tin nhu cầu</NavLink>
        <NavIconLink href="/tai-khoan/da-luu" label="Yêu thích">
          <Heart aria-hidden="true" className="size-[15px]" strokeWidth={1.8} />
        </NavIconLink>
        {viewer ? (
          <NavIconLink href="/tin-nhan" label="Tin nhắn">
            <MessageSquare aria-hidden="true" className="size-[15px]" strokeWidth={1.8} />
            {unreadCount > 0 ? (
              <span className="ml-0.5 rounded-full bg-accent-warn px-1.5 py-0.5 text-[10px] font-extrabold text-surface">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            ) : null}
          </NavIconLink>
        ) : null}

        <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

        <div ref={postMenuRef} className="relative">
          <button
            aria-expanded={isPostMenuOpen}
            className="flex items-center gap-1.5 rounded-[10px] bg-primary px-4 py-2 text-[13.5px] font-bold text-surface shadow-md transition-colors hover:bg-primary-hover active:bg-primary-press"
            onClick={() => {
              setIsPostMenuOpen((open) => !open);
              setIsAccountMenuOpen(false);
            }}
            type="button"
          >
            Đăng tin
            <ChevronDown
              aria-hidden="true"
              className={cn('size-3.5 transition-transform', isPostMenuOpen && 'rotate-180')}
            />
          </button>
          {isPostMenuOpen ? <PostMenu onClose={() => setIsPostMenuOpen(false)} /> : null}
        </div>

        <div ref={accountMenuRef} className="relative">
          {viewer ? (
            <button
              aria-expanded={isAccountMenuOpen}
              className="flex items-center gap-2 rounded-[10px] border border-line bg-surface px-3.5 py-2 text-[13.5px] font-bold text-ink transition-colors hover:bg-cream"
              data-testid="account-menu-trigger"
              onClick={() => {
                setIsAccountMenuOpen((open) => !open);
                setIsPostMenuOpen(false);
              }}
              type="button"
            >
              <span className="flex size-[22px] items-center justify-center rounded-full bg-line">
                <User aria-hidden="true" className="size-[13px] text-primary" />
              </span>
              <span className="max-w-28 truncate">{viewer.displayName}</span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'size-3.5 text-ink-muted transition-transform',
                  isAccountMenuOpen && 'rotate-180',
                )}
              />
            </button>
          ) : (
            <Link
              className="flex items-center gap-1.5 rounded-[10px] bg-primary px-4 py-2 text-[13.5px] font-semibold text-surface shadow-md transition-colors hover:bg-primary-hover active:bg-primary-press"
              data-testid="navbar-login-btn"
              href="/dang-nhap"
            >
              <User aria-hidden="true" className="size-[15px]" />
              Đăng nhập
            </Link>
          )}
          {viewer && isAccountMenuOpen ? (
            <AccountMenu
              onClose={() => setIsAccountMenuOpen(false)}
              onSignOut={onSignOut}
              viewer={viewer}
            />
          ) : null}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      className="whitespace-nowrap rounded-sm px-2.5 py-2 text-[13.5px] text-ink-muted transition-colors hover:bg-canvas hover:font-semibold hover:text-primary-press xl:px-3"
      href={href}
    >
      {children}
    </Link>
  );
}

/**
 * Dưới `xl` chỉ hiện icon: nhãn chữ giữ nguyên thì cụm bên phải không co đủ để navbar vừa
 * màn 1024px. `aria-label` gánh phần tên gọi khi chữ bị ẩn.
 */
function NavIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      aria-label={label}
      className="flex items-center gap-1 rounded-sm px-2.5 py-2 text-[13.5px] text-ink-muted transition-colors hover:bg-cream xl:px-3"
      href={href}
    >
      {children}
      <span className="hidden whitespace-nowrap xl:inline">{label}</span>
    </Link>
  );
}
