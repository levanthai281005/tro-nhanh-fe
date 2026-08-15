export interface PaletteItem {
  token: string;
  name: string;
  vietnameseName: string;
  usage: string;
  swatchClassName: string;
  isLight?: boolean;
}

export const PALETTE: PaletteItem[] = [
  {
    token: 'primary',
    name: 'Primary',
    vietnameseName: 'Nâu thương hiệu',
    usage: 'Nút CTA, giá tiền, brand trên nền sáng',
    swatchClassName: 'bg-primary',
  },
  {
    token: 'primary-press',
    name: 'Primary Dark',
    vietnameseName: 'Espresso',
    usage: 'Top nav, footer, nền tối nhấn mạnh',
    swatchClassName: 'bg-primary-press',
  },
  {
    token: 'sand',
    name: 'Secondary',
    vietnameseName: 'Nâu cát',
    usage: 'Nút phụ, icon active, viền nhấn',
    swatchClassName: 'bg-sand',
  },
  {
    token: 'sand-soft',
    name: 'Sand Soft',
    vietnameseName: 'Cát nhạt',
    usage: 'Badge, fill phụ, trạng thái hover',
    swatchClassName: 'bg-sand-soft',
    isLight: true,
  },
  {
    token: 'cream',
    name: 'Cream',
    vietnameseName: 'Kem',
    usage: 'Nền thẻ, nền phụ, brand trên nav tối',
    swatchClassName: 'bg-cream',
    isLight: true,
  },
  {
    token: 'canvas',
    name: 'Background',
    vietnameseName: 'Kem sáng',
    usage: 'Nền chính trang',
    swatchClassName: 'bg-canvas',
    isLight: true,
  },
  {
    token: 'ink',
    name: 'Text Primary',
    vietnameseName: 'Nâu đậm',
    usage: 'Chữ chính trên nền sáng',
    swatchClassName: 'bg-ink',
  },
  {
    token: 'ink-muted',
    name: 'Text Secondary',
    vietnameseName: 'Nâu xám',
    usage: 'Caption, chữ phụ',
    swatchClassName: 'bg-ink-muted',
  },
  {
    token: 'line',
    name: 'Border',
    vietnameseName: 'Viền cát',
    usage: 'Viền thẻ, đường kẻ',
    swatchClassName: 'bg-line',
    isLight: true,
  },
  {
    token: 'surface',
    name: 'Surface',
    vietnameseName: 'Trắng',
    usage: 'Nền input và thẻ nội dung chính',
    swatchClassName: 'bg-surface',
    isLight: true,
  },
];

export const STATUS_PALETTE = [
  {
    token: 'status-available',
    label: 'Trống',
    description: 'Phòng còn trống',
    swatchClassName: 'bg-status-available',
  },
  {
    token: 'status-deposited',
    label: 'Đã cọc',
    description: 'Phòng đã nhận cọc',
    swatchClassName: 'bg-status-deposited',
  },
  {
    token: 'status-rented',
    label: 'Đang thuê',
    description: 'Phòng đang có người thuê',
    swatchClassName: 'bg-status-rented',
  },
  {
    token: 'error',
    label: 'Lỗi',
    description: 'Form error và thao tác nguy hiểm',
    swatchClassName: 'bg-error',
  },
  {
    token: 'warning',
    label: 'Cảnh báo',
    description: 'Trạng thái cần chú ý',
    swatchClassName: 'bg-warning',
  },
] as const;

export const TYPE_SCALE = [
  {
    name: 'H1',
    meta: '34 · w700 · lh1.2',
    sample: 'Tìm đúng phòng. Quản đúng cách.',
    className: 'text-[34px] font-bold leading-[1.2] text-ink',
  },
  {
    name: 'H2',
    meta: '24 · w600 · lh1.3',
    sample: 'Phòng nổi bật tại TP. HCM',
    className: 'text-2xl font-semibold leading-[1.3] text-ink',
  },
  {
    name: 'H3',
    meta: '18 · w600 · lh1.4',
    sample: 'Tiện ích phòng trọ',
    className: 'text-lg font-semibold leading-[1.4] text-ink',
  },
  {
    name: 'Body',
    meta: '15 · w400 · lh1.6',
    sample: 'Phòng trọ & căn hộ dịch vụ — tìm nhanh, minh bạch, an toàn.',
    className: 'text-[15px] leading-[1.6] text-ink',
  },
  {
    name: 'Caption',
    meta: '13 · w400 · lh1.5',
    sample: 'Cập nhật lần cuối: hôm nay 09:41',
    className: 'text-[13px] leading-[1.5] text-ink-muted',
  },
  {
    name: 'Label',
    meta: '13 · w600 · lh1.4',
    sample: 'Khoảng giá thuê',
    className: 'text-[13px] font-semibold leading-[1.4] text-ink',
  },
  {
    name: 'Price Large',
    meta: '28 · w700 · lh1.15',
    sample: '3.200.000 đ/tháng',
    className: 'text-[28px] font-bold leading-[1.15] text-primary',
  },
] as const;
