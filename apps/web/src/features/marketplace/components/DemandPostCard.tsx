import { Banknote, Building2, MapPin, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { DemandPostCardView } from '@/features/marketplace/types/home';

export interface DemandPostCardProps {
  post: DemandPostCardView;
  onMessage: () => void;
  onView: () => void;
}

const PROPERTY_TYPE_LABELS = {
  BoardingRoom: 'Phòng trọ',
  ServicedApartment: 'Căn hộ dịch vụ',
  Apartment: 'Căn hộ',
} as const;

function formatCurrency(value: number) {
  return `${value.toLocaleString('vi-VN')}đ`;
}

function formatMoveInDate(value: string | null) {
  if (!value) return 'Dọn vào ngay';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Dọn vào ngay';
  return `Dọn vào ${date.getMonth() + 1}/${date.getFullYear()}`;
}

function formatGender(gender: 'Male' | 'Female' | 'Any') {
  if (gender === 'Male') return 'Nam';
  if (gender === 'Female') return 'Nữ';
  return 'Nam/Nữ';
}

export function DemandPostCard({ post, onMessage, onView }: DemandPostCardProps) {
  const isRoomWanted = post.kind === 'RoomWanted';
  const location = isRoomWanted
    ? post.desiredDistricts.join(', ') || 'TP. Hồ Chí Minh'
    : post.district;
  const price = isRoomWanted
    ? post.priceMin && post.priceMax
      ? `${formatCurrency(post.priceMin)} - ${formatCurrency(post.priceMax)}`
      : post.priceMax
        ? `Dưới ${formatCurrency(post.priceMax)}`
        : 'Thỏa thuận'
    : post.sharePrice
      ? `${formatCurrency(post.sharePrice)}/tháng`
      : 'Thỏa thuận';

  return (
    <Card
      className="flex min-w-0 flex-col rounded-xl bg-gradient-to-br from-surface to-canvas p-[18px]"
      data-demand-id={post.id}
      data-testid="demand-post-card"
      hoverable
    >
      <div className="mb-3.5 flex items-center gap-2.5">
        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sand text-xs font-extrabold text-surface">
          {post.initials || 'KT'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold leading-[1.35] text-ink">{post.name}</p>
          <p className="mt-0.5 text-[11px] text-ink-muted">Người thuê</p>
        </div>
        <span
          className={
            isRoomWanted
              ? 'whitespace-nowrap rounded-full border border-primary/20 bg-primary-soft px-2.5 py-1 text-[10.5px] font-bold text-primary-press'
              : 'whitespace-nowrap rounded-full border border-sand/30 bg-cream px-2.5 py-1 text-[10.5px] font-bold text-sand-press'
          }
          data-testid="demand-kind-badge"
        >
          {isRoomWanted ? 'Tìm phòng' : 'Ở ghép'}
        </span>
      </div>

      <h3 className="mb-3 min-h-11 text-[14.5px] font-extrabold leading-[1.45] text-ink">
        {post.title}
      </h3>

      <div className="mb-3.5 flex flex-col gap-2 text-xs leading-[1.45] text-ink-muted">
        <p className="flex items-start gap-2">
          <MapPin aria-hidden="true" className="mt-0.5 size-[13px] shrink-0 text-sand" />
          {location}
        </p>
        <p className="flex items-start gap-2 font-bold text-primary">
          <Banknote aria-hidden="true" className="mt-0.5 size-[13px] shrink-0 text-sand" />
          {price}
        </p>
        <p className="flex items-start gap-2">
          {isRoomWanted ? (
            <>
              <Building2 aria-hidden="true" className="mt-0.5 size-[13px] shrink-0 text-sand" />
              {PROPERTY_TYPE_LABELS[post.propertyType]} • {formatMoveInDate(post.moveInDate)}
            </>
          ) : (
            <>
              <Users aria-hidden="true" className="mt-0.5 size-[13px] shrink-0 text-sand" />
              Cần {post.neededCount} người • {formatGender(post.genderRequirement)}
            </>
          )}
        </p>
      </div>

      {post.tags.length > 0 ? (
        <div className="mb-4 mt-auto flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-sm border border-line bg-canvas px-2 py-1 text-[10px] font-semibold text-ink-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex gap-2">
        <Button
          className="min-w-0 flex-1 justify-center"
          data-testid="demand-contact-btn"
          icon={<MessageSquare aria-hidden="true" className="size-[13px]" />}
          onClick={onMessage}
          size="sm"
        >
          Nhắn tin
        </Button>
        <Button
          className="min-w-0 flex-1 justify-center"
          onClick={onView}
          size="sm"
          variant="outline"
        >
          Xem chi tiết
        </Button>
      </div>
    </Card>
  );
}
