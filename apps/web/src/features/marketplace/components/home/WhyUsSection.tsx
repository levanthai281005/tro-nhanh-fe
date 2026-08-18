'use client';

import { ArrowRight, CreditCard, Headphones, MessageSquare, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { InfoModal } from '@/features/marketplace/components/home/InfoModal';

const FEATURES = [
  {
    Icon: ShieldCheck,
    title: 'Thông tin xác thực',
    description: '100% tin đăng được đội ngũ kiểm duyệt kỹ lưỡng, đảm bảo hình ảnh thật, giá thật.',
  },
  {
    Icon: CreditCard,
    title: 'Thanh toán an toàn',
    description:
      'Chuyển khoản trực tiếp qua VietQR trên hóa đơn — không qua trung gian, không phí ẩn.',
  },
  {
    Icon: MessageSquare,
    title: 'Kết nối trực tiếp',
    description:
      'Hệ thống chat tích hợp giúp bạn liên hệ trực tiếp với chủ nhà không qua trung gian.',
  },
  {
    Icon: Headphones,
    title: 'Hỗ trợ qua Email',
    description:
      'Giải đáp thắc mắc và hỗ trợ chủ trọ cùng người ở qua email chính thức của Trọ Nhanh.',
  },
] as const;

export function WhyUsSection() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <section className="border-y border-line bg-cream">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-10 px-5 py-[52px] md:flex-row md:items-center md:gap-16 md:px-8 md:py-20">
        <div className="md:basis-[340px]">
          <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-sand">
            Lý do chọn Trọ Nhanh
          </p>
          <h2 className="mb-4 text-2xl font-black leading-tight tracking-[-0.02em] text-ink md:text-[32px]">
            Tại sao nên chọn <span className="text-primary">Trọ Nhanh?</span>
          </h2>
          <p className="mb-7 text-[15px] leading-[1.7] text-ink-muted">
            Chúng tôi tối ưu hóa quy trình tìm phòng, giúp bạn tiết kiệm thời gian và công sức.
          </p>
          <Button
            icon={<ArrowRight aria-hidden="true" className="size-[15px]" />}
            onClick={() => setIsInfoOpen(true)}
            variant="outline"
          >
            Tìm hiểu thêm
          </Button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map(({ Icon, title, description }) => (
            <div key={title} className="rounded-lg border border-line bg-surface px-[22px] py-6">
              <span className="mb-3.5 flex size-[42px] items-center justify-center rounded-[10px] bg-primary-soft text-primary">
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
              </span>
              <h3 className="mb-2 text-[15px] font-bold text-ink">{title}</h3>
              <p className="text-[13px] leading-[1.65] text-ink-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {isInfoOpen ? (
        <InfoModal
          description="Trọ Nhanh kết nối trực tiếp người tìm phòng và chủ trọ, công khai các chi phí cần thiết, hỗ trợ nhắn tin và giúp việc quản lý chỗ ở gọn gàng hơn."
          onClose={() => setIsInfoOpen(false)}
          title="Vì sao chọn Trọ Nhanh?"
        />
      ) : null}
    </section>
  );
}
