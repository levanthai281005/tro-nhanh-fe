import { MessageCircle, Phone, User } from 'lucide-react';
import { ButtonShowcase } from '@/components/style-guide/ButtonShowcase';
import { FormShowcase } from '@/components/style-guide/FormShowcase';
import { RoomCardShowcase } from '@/components/style-guide/RoomCardShowcase';
import { StyleGuideSection } from '@/components/style-guide/StyleGuideSection';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function ComponentSection() {
  return (
    <StyleGuideSection id="sec-5" title="5 · Components">
      <ButtonShowcase />
      <FormShowcase />
      <SurfaceShowcase />
      <RoomCardShowcase />
      <StatusShowcase />
      <ContactShowcase />
      <StatShowcase />
    </StyleGuideSection>
  );
}

function SurfaceShowcase() {
  const surfaces = [
    { className: 'bg-surface', label: 'Surface — thẻ nội dung chính', token: 'surface' },
    { className: 'bg-cream', label: 'Cream — nền thẻ phụ', token: 'cream' },
    { className: 'bg-canvas', label: 'Background — nền trang', token: 'canvas' },
  ];

  return (
    <div className="mb-8">
      <p className="mb-4 text-[15px] font-bold text-ink">5c · Card / Surface</p>
      <div className="flex flex-wrap gap-3">
        {surfaces.map((surface) => (
          <div
            key={surface.token}
            className={`${surface.className} min-w-[200px] rounded-md border border-line p-5 shadow-sm`}
          >
            <p className="mb-1 text-[13px] font-semibold text-ink">{surface.label}</p>
            <p className="text-[11px] text-ink-muted">{surface.token}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusShowcase() {
  return (
    <div className="mb-8">
      <p className="mb-3 text-[15px] font-bold text-ink">5e · Status Chip</p>
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge kind="room" status="Available" />
        <Badge kind="room" status="Deposited" />
        <Badge kind="room" status="Rented" />
      </div>
    </div>
  );
}

function ContactShowcase() {
  return (
    <div className="mb-8">
      <p className="mb-1.5 text-[15px] font-bold text-ink">
        5f · Owner Contact Card (Liên hệ chủ trọ)
      </p>
      <p className="mb-4 text-[13px] text-ink-muted">
        Dùng trên màn chi tiết phòng. Người thuê nhắn tin trong nền tảng hoặc gọi điện trực tiếp —{' '}
        <strong>không có đặt lịch trong app</strong>.
      </p>
      <Card className="max-w-80 p-5 shadow-md">
        <div className="mb-4 flex items-center gap-3 rounded-[10px] bg-canvas px-3 py-2.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sand">
            <User aria-hidden="true" className="size-5 text-primary-press" />
          </span>
          <span>
            <span className="block text-[11px] text-ink-muted">Chủ trọ</span>
            <span className="mt-0.5 block text-[15px] font-bold text-ink">Anh Minh</span>
            <span className="mt-0.5 block text-xs text-ink-muted">Phản hồi nhanh · Online</span>
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          <Button fullWidth icon={<MessageCircle aria-hidden="true" className="size-[15px]" />}>
            Gửi tin nhắn
          </Button>
          <Button
            fullWidth
            icon={<Phone aria-hidden="true" className="size-[15px]" />}
            variant="outline"
          >
            Gọi 0912 345 678
          </Button>
        </div>
        <p className="mt-2.5 text-center text-[11px] text-ink-muted">
          Nhắn tin trong nền tảng hoặc gọi điện trực tiếp
        </p>
      </Card>
    </div>
  );
}

function StatShowcase() {
  return (
    <div>
      <p className="mb-1.5 text-[15px] font-bold text-ink">
        5g · Stat Card lớn (Dashboard chủ trọ)
      </p>
      <p className="mb-4 text-[13px] text-ink-muted">
        “Số phòng trống” là thông tin chính — luôn hiển thị. Tổng phòng & số khách là toggle mặc
        định TẮT.
      </p>
      <div className="flex flex-wrap items-start gap-4">
        <Card className="min-w-[220px] p-7 shadow-md">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.06em] text-ink-muted">
            Số phòng trống
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[52px] font-extrabold leading-none text-primary">3</span>
            <span className="text-base text-ink-muted">/ 8 phòng</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-sm bg-canvas">
            <div className="h-full w-[37.5%] rounded-sm bg-primary" />
          </div>
          <p className="mt-2 text-xs text-ink-muted">37.5% số phòng đang trống</p>
        </Card>
        <Card className="min-w-[260px] p-5">
          <p className="mb-3.5 text-[13px] font-bold text-ink">Tùy chọn hiển thị</p>
          {['Hiển thị Tổng số phòng', 'Hiển thị Số khách đang ở'].map((label) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-line py-2.5"
            >
              <span className="text-[13px] text-ink">{label}</span>
              <span className="relative h-[22px] w-10 rounded-full bg-line">
                <span className="absolute left-[3px] top-[3px] size-4 rounded-full bg-surface" />
              </span>
            </div>
          ))}
          <p className="mt-2.5 text-[11px] text-ink-muted">
            Mặc định TẮT — chủ trọ tự bật mới thấy.
          </p>
        </Card>
      </div>
    </div>
  );
}
