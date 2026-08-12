import { Building2, KeyRound, Search } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-8 px-6 py-16">
      <div className="inline-flex w-fit items-center gap-2 rounded-md bg-cream px-4 py-2 text-sm font-semibold text-primary">
        <Building2 aria-hidden="true" size={18} />
        Trọ Nhanh
      </div>
      <div className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-6xl">
          Quản lý nhà trọ gọn hơn, tìm phòng dễ hơn.
        </h1>
        <p className="text-lg leading-8 text-ink-muted">
          Một nền tảng dành cho cả chủ trọ và người ở, từ đăng tin đến vận hành hằng ngày.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-cream hover:bg-primary-hover"
          href="/chu-tro"
        >
          <KeyRound aria-hidden="true" size={18} />
          Không gian chủ trọ
        </Link>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-5 py-3 font-semibold text-ink hover:bg-cream"
          href="/nguoi-o"
        >
          <Search aria-hidden="true" size={18} />
          Không gian người ở
        </Link>
      </div>
    </main>
  );
}
