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

export function PublicNavbar(props: PublicNavbarProps) {
  return (
    <>
      <div className="hidden md:block">
        <PublicNavbarDesktop {...props} />
      </div>
      <div className="md:hidden">
        <PublicNavbarMobile {...props} />
      </div>
    </>
  );
}
