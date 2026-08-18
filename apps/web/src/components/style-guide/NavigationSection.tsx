'use client';

import { Home, MessageSquare, Search, User } from 'lucide-react';
import { useState } from 'react';
import { StyleGuideSection } from '@/components/style-guide/StyleGuideSection';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

const DEMO_TABS = [
  { Icon: Home, label: 'Trang chủ' },
  { Icon: Search, label: 'Tìm phòng' },
  { Icon: MessageSquare, label: 'Tin nhắn' },
  { Icon: User, label: 'Tài khoản' },
] as const;

export function NavigationSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <StyleGuideSection id="sec-6" title="6 · Navigation">
      <div className="mb-7">
        <p className="mb-1.5 text-sm font-semibold text-ink">
          Top Navbar (Web) — Brand “Trọ Nhanh” dùng cream trên nền espresso
        </p>
        <p className="mb-3 text-xs text-error">
          ⚠ Không dùng primary cho brand ở đây — màu đó bị chìm vào nền tối.
        </p>
        <div className="flex h-16 items-center gap-9 overflow-x-auto rounded-md bg-primary-press px-7 shadow-lg">
          <span className="shrink-0 text-[21px] font-extrabold tracking-[-0.02em] text-cream">
            Trọ Nhanh
          </span>
          <span className="flex-1" />
          {['Tìm phòng', 'Đăng tin', 'Hỗ trợ'].map((label) => (
            <span key={label} className="shrink-0 text-sm font-medium text-cream/80">
              {label}
            </span>
          ))}
          <Button className="shrink-0" size="sm">
            Đăng nhập
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-ink">
          Bottom Tab Bar (Mobile) — active primary, inactive status-rented
        </p>
        <div className="max-w-[390px] overflow-hidden rounded-lg border border-line bg-canvas">
          <div className="flex h-20 items-center justify-center bg-cream">
            <span className="text-[13px] text-ink-muted">Nội dung màn hình</span>
          </div>
          <div className="flex rounded-b-lg border-t border-line bg-surface py-1.5">
            {DEMO_TABS.map(({ Icon, label }, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={label}
                  className="flex flex-1 flex-col items-center gap-[3px] py-1"
                  onClick={() => setActiveTab(index)}
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
                  {isActive ? <span className="size-1 rounded-full bg-primary" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </StyleGuideSection>
  );
}
