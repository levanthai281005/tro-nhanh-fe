import { MapPin } from 'lucide-react';

export function MapPlaceholder() {
  return (
    <div className="relative flex min-h-[400px] items-center justify-center overflow-hidden rounded-lg border border-line bg-sand-soft">
      <div aria-hidden="true" className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,theme(colors.sand)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.sand)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative z-10 flex max-w-xs flex-col items-center text-center">
        <span className="mb-4 flex size-12 rotate-[-45deg] items-center justify-center rounded-[50%_50%_50%_0] bg-primary shadow-lg">
          <MapPin aria-hidden="true" className="size-6 rotate-45 text-surface" />
        </span>
        <h2 className="text-base font-bold text-ink">Chế độ xem bản đồ</h2>
        <p className="mt-1 text-sm leading-6 text-ink-muted">
          Vị trí phòng sẽ hiển thị trên bản đồ khi dữ liệu tọa độ và tích hợp bản đồ sẵn sàng.
        </p>
      </div>
    </div>
  );
}
