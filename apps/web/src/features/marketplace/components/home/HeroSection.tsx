import { Building2, Clock, Shield, ShieldCheck, UserCheck } from 'lucide-react';
import Image from 'next/image';
import { HeroSearchBox } from '@/features/marketplace/components/home/HeroSearchBox';
import { TAGLINE } from '@/features/marketplace/constants/catalog';

const TRUST_ITEMS = [
  { value: 'Miễn phí', label: 'Đăng tin cho thuê', Icon: Building2 },
  { value: 'VietQR', label: 'Thanh toán trên hóa đơn', Icon: ShieldCheck },
  { value: '0đ', label: 'Phí trung gian', Icon: UserCheck },
  { value: 'Trực tiếp', label: 'Nhắn tin với chủ nhà', Icon: Clock },
] as const;

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-sand-soft via-cream to-status-rented-soft">
      <div className="px-4 py-10 text-center md:hidden">
        <TaglineBadge />
        <HeroHeading className="text-[26px]" />
        <HeroDescription className="mb-7 text-[13.5px]" />
        <div className="mb-7">
          <HeroSearchBox variant="mobile" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {TRUST_ITEMS.map(({ value, label, Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-md border border-line bg-surface p-3 shadow-sm"
            >
              <span className="mb-1.5 flex size-7 items-center justify-center rounded-full bg-cream text-primary">
                <Icon aria-hidden="true" className="size-3.5" />
              </span>
              <strong className="text-[15px] font-extrabold text-primary">{value}</strong>
              <span className="text-[10px] font-semibold text-ink-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto hidden max-w-[1200px] grid-cols-[1.25fr_1fr] items-center gap-[54px] px-8 py-[72px] md:grid lg:py-20">
        <div className="text-left">
          <TaglineBadge />
          <HeroHeading className="text-4xl lg:text-[44px]" />
          <HeroDescription className="mb-9 max-w-[540px] text-[15.5px]" />
          <div className="mb-10 w-full max-w-[680px]">
            <HeroSearchBox variant="desktop" />
          </div>
          <div className="flex flex-wrap gap-4">
            {TRUST_ITEMS.map(({ value, label, Icon }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="flex size-[34px] items-center justify-center rounded-full border border-line bg-surface text-primary shadow-sm">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span>
                  <strong className="block text-[17px] font-extrabold text-ink">{value}</strong>
                  <span className="block text-[11px] font-semibold text-ink-muted">{label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[420px] w-full" aria-hidden="true">
          <div className="absolute right-2.5 top-2.5 grid w-[140px] grid-cols-8 gap-2 opacity-20">
            {Array.from({ length: 48 }, (_, index) => (
              <span key={index} className="size-1 rounded-full bg-primary" />
            ))}
          </div>
          <div className="absolute left-0 top-[5%] h-[85%] w-[65%] overflow-hidden rounded-[24px] border-4 border-surface shadow-xl">
            <Image
              alt="Phòng trọ sáng sủa với đầy đủ nội thất"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 390px, 32vw"
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
            />
          </div>
          <div className="absolute right-0 top-0 z-[2] h-[45%] w-[40%] overflow-hidden rounded-xl border-4 border-surface shadow-xl">
            <Image
              alt=""
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 240px, 20vw"
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=80"
            />
          </div>
          <div className="absolute bottom-[5%] right-[5%] z-[2] h-[45%] w-[40%] overflow-hidden rounded-xl border-4 border-surface shadow-xl">
            <Image
              alt=""
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 240px, 20vw"
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80"
            />
          </div>
          <div className="absolute bottom-[15%] left-[8%] z-[3] flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2.5 shadow-xl">
            <span className="flex size-7 items-center justify-center rounded-full bg-status-available-soft text-status-available">
              <ShieldCheck className="size-4" />
            </span>
            <span className="text-left">
              <strong className="block text-xs font-bold text-ink">Thông tin xác thực</strong>
              <span className="block text-[10.5px] text-ink-muted">Kiểm duyệt kỹ lưỡng</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TaglineBadge() {
  return (
    <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-primary/10 bg-primary/5 px-3.5 py-1.5 text-primary">
      <Shield aria-hidden="true" className="size-3" />
      <span className="text-[11px] font-bold tracking-[0.02em] md:text-xs">{TAGLINE}</span>
    </div>
  );
}

function HeroHeading({ className }: { className: string }) {
  return (
    <h1 className={`mb-4 font-black leading-[1.2] tracking-[-0.02em] text-ink md:mb-5 ${className}`}>
      Tìm không gian <span className="text-primary">sống lý tưởng</span>,
      <br />
      nhanh chóng &amp; an tâm
    </h1>
  );
}

function HeroDescription({ className }: { className: string }) {
  return (
    <p className={`leading-[1.7] text-ink-muted ${className}`}>
      Nơi chủ nhà và người thuê gặp nhau trực tiếp. Xem giá, chi phí điện nước và liên hệ chủ
      nhà ngay trên tin đăng — không qua trung gian.
    </p>
  );
}
