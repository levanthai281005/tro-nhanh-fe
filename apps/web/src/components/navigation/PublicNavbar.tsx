'use client';

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
  void props;
  return null;
}
