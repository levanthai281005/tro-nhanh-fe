'use client';

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
  void props;
  return null;
}

export function AccountMenu(props: AccountMenuProps) {
  void props;
  return null;
}
