import { Globe2, Mail, MapPin, MessageCircle, Phone, Play } from 'lucide-react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';

const DISCOVERY_LINKS = [
  { label: 'Tìm phòng trọ', href: '/tim-phong' },
  {
    label: 'Căn hộ dịch vụ',
    href: '/tim-phong?type=C%C4%83n%20h%E1%BB%99%20d%E1%BB%8Bch%20v%E1%BB%A5',
  },
  { label: 'Nhà nguyên căn', href: '/tim-phong?type=Nh%C3%A0%20nguy%C3%AAn%20c%C4%83n' },
  { label: 'Văn phòng cho thuê', href: '/tim-phong' },
] as const;

const SUPPORT_ITEMS = [
  'Trung tâm trợ giúp',
  'Quy định đăng tin',
  'Chính sách bảo mật',
  'Giải quyết khiếu nại',
] as const;

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com', Icon: Globe2 },
  { label: 'Zalo', href: 'https://zalo.me', Icon: MessageCircle },
  { label: 'YouTube', href: 'https://youtube.com', Icon: Play },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t-[1.5px] border-line bg-canvas px-4 pb-8 pt-12 md:px-8 md:pb-10 md:pt-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 grid grid-cols-1 gap-9 text-left md:grid-cols-4 md:gap-12">
          <div>
            <div className="mb-3.5">
              <BrandLogo size="md" />
            </div>
            <p className="mb-5 max-w-[260px] text-[13px] leading-[1.75] text-ink-muted">
              Nền tảng tìm kiếm và quản lý phòng trọ tại Việt Nam. Mang lại giải pháp an toàn và
              hiệu quả cho sinh viên và người lao động.
            </p>
            <div className="flex gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-full border border-line bg-surface text-ink-muted transition-colors hover:border-primary hover:text-primary"
                  href={href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon aria-hidden="true" className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Khám phá">
            {DISCOVERY_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                className="block text-[13.5px] text-ink-muted transition-colors hover:text-primary"
                href={href}
              >
                {label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Hỗ trợ">
            {SUPPORT_ITEMS.map((label) => (
              <span key={label} className="block text-[13.5px] text-ink-muted">
                {label}
              </span>
            ))}
          </FooterColumn>

          <FooterColumn title="Liên hệ">
            <ContactRow Icon={Mail} href="mailto:tronhanh2026@gmail.com">
              tronhanh2026@gmail.com
            </ContactRow>
            <ContactRow Icon={Phone} href="tel:1900123456">
              1900 123 456
            </ContactRow>
            <ContactRow Icon={MapPin}>Tầng 12, Tòa nhà Bitexco, Quận 1, TP. Hồ Chí Minh</ContactRow>
          </FooterColumn>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-[12.5px] text-ink-muted">
          <span>© 2024 Trọ Nhanh Platform. All rights reserved.</span>
          <div className="flex gap-5">
            <span>Điều khoản sử dụng</span>
            <span>Chính sách Cookie</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <h3 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface ContactRowProps {
  Icon: typeof Mail;
  children: React.ReactNode;
  href?: string;
}

function ContactRow({ Icon, children, href }: ContactRowProps) {
  const content = (
    <>
      <Icon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-sand" />
      <span>{children}</span>
    </>
  );

  return href ? (
    <a
      className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink-muted hover:text-primary"
      href={href}
    >
      {content}
    </a>
  ) : (
    <p className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink-muted">
      {content}
    </p>
  );
}
