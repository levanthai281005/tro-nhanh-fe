'use client';

import { Bell, Menu, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import type { PublicNavbarProps } from '@/components/navigation/PublicNavbar';

export function PublicNavbarMobile({ viewer, onSignOut }: PublicNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isStaff = viewer?.roles?.some((role) => role === 'Admin' || role === 'Moderator');
  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    { label: 'Tìm phòng', href: '/tim-phong' },
    { label: 'Tin nhu cầu', href: '/tin-tim-phong' },
    ...(viewer ? [{ label: 'Tin đăng của tôi', href: '/tai-khoan/tin-cho-thue' }] : []),
    ...(viewer ? [{ label: 'Tin đã lưu', href: '/tai-khoan/da-luu' }] : []),
    { label: 'Đăng tin cho thuê', href: '/chu-tro/dang-tin', isSubItem: true },
    { label: 'Đăng tin tìm phòng', href: '/tai-khoan/dang-tin-nhu-cau', isSubItem: true },
    ...(viewer ? [{ label: 'Tin nhắn', href: '/tin-nhan' }] : []),
    ...(isStaff ? [{ label: 'Quản trị hệ thống', href: '/admin' }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-[100] flex h-14 items-center justify-between border-b border-line bg-surface px-4 shadow-sm">
        <Link aria-label="Trọ Nhanh - Trang chủ" className="min-w-0" href="/">
          <BrandLogo size="sm" />
        </Link>
        <div className="flex items-center">
          <Link
            aria-label="Tìm kiếm"
            className="inline-flex size-10 items-center justify-center text-ink"
            href="/tim-phong"
          >
            <Search aria-hidden="true" className="size-[21px]" strokeWidth={1.8} />
          </Link>
          <Link
            aria-label="Thông báo"
            className="relative inline-flex size-10 items-center justify-center text-ink"
            href={viewer ? '/thong-bao' : '/dang-nhap?redirect=%2Fthong-bao'}
          >
            <Bell aria-hidden="true" className="size-[21px]" strokeWidth={1.8} />
          </Link>
          <button
            aria-expanded={isMenuOpen}
            aria-label="Mở menu"
            className="inline-flex size-10 items-center justify-center text-ink"
            onClick={() => setIsMenuOpen((open) => !open)}
            type="button"
          >
            <Menu aria-hidden="true" className="size-[21px]" strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {isMenuOpen ? (
        <>
          <button
            aria-label="Đóng menu"
            className="fixed inset-0 z-[198] bg-ink/40 backdrop-blur-[2px]"
            onClick={closeMenu}
            type="button"
          />
          <div className="fixed inset-x-0 top-14 z-[199] border-b border-line bg-surface pb-4 pt-2 shadow-xl">
            <div className="flex items-center justify-between px-4 pb-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-[0.07em] text-ink-muted">
                Menu
              </span>
              <button
                aria-label="Đóng menu"
                className="inline-flex size-7 items-center justify-center text-ink-muted"
                onClick={closeMenu}
                type="button"
              >
                <X aria-hidden="true" className="size-[18px]" />
              </button>
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                className={
                  item.isSubItem
                    ? 'mx-4 block border-l-2 border-line px-3 py-2.5 text-[13px] text-ink-muted'
                    : 'block px-4 py-3 text-[15px] font-semibold text-ink'
                }
                href={item.href}
                onClick={closeMenu}
              >
                {item.isSubItem ? <span className="mr-1.5 text-sand">↳</span> : null}
                {item.label}
              </Link>
            ))}
            {viewer ? (
              <>
                <Link
                  className="block px-4 py-3 text-[15px] font-semibold text-ink"
                  href="/tai-khoan/ho-so"
                  onClick={closeMenu}
                >
                  Tài khoản
                </Link>
                {onSignOut ? (
                  <button
                    className="block w-full px-4 py-3 text-left text-[15px] font-semibold text-error"
                    onClick={() => {
                      onSignOut();
                      closeMenu();
                    }}
                    type="button"
                  >
                    Đăng xuất
                  </button>
                ) : null}
              </>
            ) : (
              <Link
                className="block px-4 py-3 text-[15px] font-semibold text-primary"
                href="/dang-nhap"
                onClick={closeMenu}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </>
      ) : null}
    </>
  );
}
