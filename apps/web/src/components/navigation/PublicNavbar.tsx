'use client';

import { PublicNavbarDesktop } from '@/components/navigation/PublicNavbarDesktop';
import { PublicNavbarMobile } from '@/components/navigation/PublicNavbarMobile';

export interface NavbarViewer {
  displayName: string;
  roles?: Array<'Renter' | 'Seller' | 'Admin' | 'Moderator'>;
}

export interface PublicNavbarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  viewer?: NavbarViewer;
  unreadCount?: number;
  onSignOut?: () => void;
}

/**
 * Mốc chuyển là `lg` (1024px), không phải `md` (768px).
 *
 * Bản desktop cần tối thiểu ~1000px mới xếp đủ logo + ô tìm kiếm + cụm điều hướng bên phải.
 * Bật nó từ 768px khiến toàn site cuộn ngang trong khoảng 768–1023px — lỗi ở mọi trang, không
 * riêng trang nào. Từ 1024px trở lên bản desktop mới thực sự vừa.
 */
export function PublicNavbar(props: PublicNavbarProps) {
  return (
    <>
      <div className="hidden lg:block">
        <PublicNavbarDesktop {...props} />
      </div>
      <div className="lg:hidden">
        <PublicNavbarMobile {...props} />
      </div>
    </>
  );
}
