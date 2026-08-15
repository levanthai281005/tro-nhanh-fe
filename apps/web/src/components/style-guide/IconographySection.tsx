import {
  Bath,
  Bell,
  Car,
  Clock,
  Heart,
  Home,
  Layers,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  PlusCircle,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Star,
  User,
  Wifi,
  Wind,
} from 'lucide-react';
import { StyleGuideSection } from '@/components/style-guide/StyleGuideSection';

const ICONS = [
  { Icon: Home, label: 'Trang chủ' },
  { Icon: Search, label: 'Tìm kiếm' },
  { Icon: MapPin, label: 'Vị trí' },
  { Icon: Heart, label: 'Yêu thích' },
  { Icon: Wifi, label: 'Wifi' },
  { Icon: Wind, label: 'Máy lạnh' },
  { Icon: Car, label: 'Để xe' },
  { Icon: Bath, label: 'WC riêng' },
  { Icon: Clock, label: 'Giờ tự do' },
  { Icon: Layers, label: 'Gác lửng' },
  { Icon: PawPrint, label: 'Thú cưng' },
  { Icon: Bell, label: 'Thông báo' },
  { Icon: User, label: 'Tài khoản' },
  { Icon: Phone, label: 'Gọi điện' },
  { Icon: MessageCircle, label: 'Nhắn tin' },
  { Icon: SlidersHorizontal, label: 'Bộ lọc' },
  { Icon: Settings, label: 'Cài đặt' },
  { Icon: PlusCircle, label: 'Đăng tin' },
  { Icon: Shield, label: 'An toàn' },
  { Icon: Star, label: 'Nổi bật' },
] as const;

export function IconographySection() {
  return (
    <StyleGuideSection id="sec-4" title="4 · Biểu Tượng / Iconography">
      <p className="mb-4 text-[13px] text-ink-muted">
        Phong cách duy nhất: <strong>outline</strong> · Lucide React · strokeWidth 1.8–2. Kích
        thước: 16px (inline), 20px (action), 22px (tab bar).
      </p>
      <div className="flex flex-wrap gap-3">
        {ICONS.map(({ Icon, label }) => (
          <div key={label} className="flex w-16 flex-col items-center gap-1.5">
            <span className="flex size-11 items-center justify-center rounded-[10px] bg-cream">
              <Icon aria-hidden="true" className="size-5 text-primary" strokeWidth={1.8} />
            </span>
            <span className="text-center text-[9px] leading-[1.3] text-ink-muted">{label}</span>
          </div>
        ))}
      </div>
    </StyleGuideSection>
  );
}
