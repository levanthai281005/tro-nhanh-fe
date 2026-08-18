import { Home, MessageSquare, Search, User, type LucideIcon } from 'lucide-react';

export interface BottomTab {
  id: 'home' | 'search' | 'messages' | 'account';
  Icon: LucideIcon;
  label: string;
  href: string;
  requiresAuth?: boolean;
  showsUnread?: boolean;
}

export const BOTTOM_TABS: BottomTab[] = [
  { id: 'home', Icon: Home, label: 'Trang chủ', href: '/' },
  { id: 'search', Icon: Search, label: 'Tìm phòng', href: '/tim-phong' },
  {
    id: 'messages',
    Icon: MessageSquare,
    label: 'Tin nhắn',
    href: '/tin-nhan',
    requiresAuth: true,
    showsUnread: true,
  },
  {
    id: 'account',
    Icon: User,
    label: 'Tài khoản',
    href: '/tai-khoan/ho-so',
    requiresAuth: true,
  },
];

export function getActiveBottomTab(pathname: string): BottomTab['id'] | null {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/tim-phong')) return 'search';
  if (pathname.startsWith('/tin-nhan')) return 'messages';
  if (pathname.startsWith('/tai-khoan')) return 'account';
  return null;
}
