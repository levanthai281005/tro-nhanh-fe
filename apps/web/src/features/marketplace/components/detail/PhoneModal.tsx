'use client';

import { Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ModalShell } from '@/components/ui/ModalShell';

export interface PhoneModalProps {
  open: boolean;
  phone: string;
  redirectPath: string;
  viewerId?: string;
  onClose: () => void;
}

function getVisiblePhone(phone: string, viewerId: string | undefined) {
  const normalizedPhone = phone.replace(/\s+/g, '');
  if (viewerId) return normalizedPhone;
  if (normalizedPhone.length < 7) return '****';
  return `${normalizedPhone.slice(0, 4)}****${normalizedPhone.slice(-3)}`;
}

export function PhoneModal({ open, phone, redirectPath, viewerId, onClose }: PhoneModalProps) {
  const router = useRouter();
  if (!open) return null;

  const visiblePhone = getVisiblePhone(phone, viewerId);
  const goToLogin = () => {
    onClose();
    router.push(`/dang-nhap?redirect=${encodeURIComponent(redirectPath)}`);
  };

  return (
    <ModalShell
      footer={
        viewerId ? (
          <>
            <Button onClick={onClose} variant="outline">
              Hủy
            </Button>
            <a
              className="inline-flex items-center gap-1.5 rounded-sm border border-transparent bg-primary px-5 py-[9px] text-sm font-semibold text-surface transition-colors hover:bg-primary-hover"
              href={`tel:${phone.replace(/\s+/g, '')}`}
            >
              <Phone aria-hidden="true" className="size-4" />
              Gọi ngay
            </a>
          </>
        ) : (
          <>
            <Button onClick={onClose} variant="outline">
              Đóng
            </Button>
            <Button onClick={goToLogin}>Đăng nhập</Button>
          </>
        )
      }
      onClose={onClose}
      title="Liên hệ chủ phòng"
      variant="bottom-sheet"
    >
      <div className="flex flex-col items-center text-center">
        <span className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-sand-soft text-primary">
          <Phone aria-hidden="true" className="size-6" />
        </span>
        {viewerId ? (
          <p className="text-sm leading-6 text-ink-muted">Số điện thoại của chủ phòng</p>
        ) : (
          <p className="text-sm leading-6 text-ink-muted">
            Số điện thoại đã được che một phần. Đăng nhập để xem và gọi trực tiếp cho chủ phòng.
          </p>
        )}
        <p
          className="mt-4 rounded-lg bg-sand-soft px-5 py-3 text-xl font-extrabold tracking-[0.03em] text-primary"
          data-testid="listing-phone-value"
        >
          {visiblePhone}
        </p>
      </div>
    </ModalShell>
  );
}
