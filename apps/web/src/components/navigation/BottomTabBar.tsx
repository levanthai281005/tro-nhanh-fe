'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BOTTOM_TABS, getActiveBottomTab } from '@/components/navigation/navigationData';
import { cn } from '@/utils/cn';

export interface BottomTabBarProps {
  isAuthenticated?: boolean;
  unreadCount?: number;
}

export function BottomTabBar(props: BottomTabBarProps) {
  const { isAuthenticated = false, unreadCount = 0 } = props;
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getActiveBottomTab(pathname);

  return (
    <nav
      className="sticky bottom-0 z-[100] flex h-[60px] shrink-0 border-t border-line bg-surface shadow-lg md:hidden"
      data-testid="mobile-tab-bar"
    >
      {BOTTOM_TABS.map(({ id, Icon, label, href, requiresAuth, showsUnread }) => {
        const isActive = activeTab === id;
        const badge = showsUnread && isAuthenticated ? unreadCount : 0;

        return (
          <button
            key={id}
            aria-current={isActive ? 'page' : undefined}
            className="relative flex min-h-11 flex-1 flex-col items-center justify-center gap-[3px]"
            data-testid={`mobile-tab-${id}`}
            onClick={() => {
              if (requiresAuth && !isAuthenticated) {
                router.push(`/dang-nhap?redirect=${encodeURIComponent(href)}`);
                return;
              }
              router.push(href);
            }}
            type="button"
          >
            <Icon
              aria-hidden="true"
              className={cn('size-[22px]', isActive ? 'text-primary' : 'text-status-rented')}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
            <span
              className={cn(
                'text-[10px]',
                isActive ? 'font-bold text-primary' : 'text-status-rented',
              )}
            >
              {label}
            </span>
            {badge > 0 ? (
              <span
                className="absolute left-[calc(50%+6px)] top-1.5 min-w-4 rounded-full bg-accent-warn px-1 text-center text-[10px] font-extrabold leading-4 text-surface"
                data-testid="mobile-tab-unread"
              >
                {badge > 9 ? '9+' : badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
