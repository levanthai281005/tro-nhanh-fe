import { ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export function LandlordCTA() {
  return (
    <section className="bg-surface px-4 py-10 md:px-8 md:py-12">
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-8 overflow-hidden rounded-[24px] bg-gradient-to-br from-ink via-primary-press to-primary-hover px-6 py-9 shadow-xl md:flex-row md:px-[60px] md:py-12">
        <span
          aria-hidden="true"
          className="absolute -right-[60px] -top-[60px] size-60 rounded-full bg-surface/5"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-20 -left-10 size-[300px] rounded-full bg-surface/5"
        />

        <div className="relative flex flex-1 items-center gap-5 text-left">
          <span className="hidden size-16 shrink-0 items-center justify-center rounded-xl bg-surface/10 text-sand md:flex">
            <Home aria-hidden="true" className="size-7" />
          </span>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.1em] text-cream/60">
              Dành cho chủ nhà
            </p>
            <h2 className="mb-2 text-[22px] font-black leading-tight tracking-[-0.02em] text-cream md:text-[28px]">
              Bạn có phòng cho thuê?
            </h2>
            <p className="max-w-[580px] text-[13.5px] leading-[1.6] text-surface/70 md:text-[14.5px]">
              Tham gia cùng hàng ngàn chủ nhà khác để tiếp cận lượng khách hàng tiềm năng thông qua
              nền tảng này.
            </p>
          </div>
        </div>

        <Link
          className="relative z-[2] inline-flex whitespace-nowrap rounded-md bg-surface px-[30px] py-3.5 text-[14.5px] font-bold text-primary shadow-lg transition hover:-translate-y-0.5 hover:bg-cream"
          href="/dang-tin-cho-thue"
        >
          Đăng tin miễn phí ngay
          <ArrowRight aria-hidden="true" className="ml-2 size-4" />
        </Link>
      </div>
    </section>
  );
}
