import { StyleGuideSection } from '@/components/style-guide/StyleGuideSection';
import { PALETTE, STATUS_PALETTE, type PaletteItem } from '@/components/style-guide/styleGuideData';
import { cn } from '@/utils/cn';

export function PaletteSection() {
  return (
    <StyleGuideSection id="sec-1" title="1 · Bảng Màu Sắc">
      <p className="mb-5 text-[13px] text-ink-muted">
        Tất cả cặp text/nền đảm bảo dễ đọc. Brand trên nav tối dùng cream — không dùng primary.
      </p>
      <div className="mb-7 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
        {PALETTE.map((paletteItem) => (
          <ColorSwatch key={paletteItem.token} {...paletteItem} />
        ))}
      </div>
      <p className="mb-3 text-sm font-bold text-ink">Màu trạng thái & ngữ nghĩa</p>
      <div className="flex flex-wrap gap-2.5">
        {STATUS_PALETTE.map((status) => (
          <div
            key={status.token}
            className="flex min-w-[200px] items-center gap-2.5 rounded-[10px] border border-line bg-surface px-3.5 py-2.5"
          >
            <span className={cn('size-8 shrink-0 rounded-sm', status.swatchClassName)} />
            <span>
              <span className="block text-[13px] font-bold text-ink">{status.label}</span>
              <span className="mt-0.5 block text-[10px] text-ink-muted">
                {status.description} · {status.token}
              </span>
            </span>
          </div>
        ))}
      </div>
    </StyleGuideSection>
  );
}

function ColorSwatch({
  token,
  name,
  vietnameseName,
  usage,
  swatchClassName,
  isLight,
}: PaletteItem) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface">
      <div className={cn('flex h-[72px] items-end px-2.5 py-1.5', swatchClassName)}>
        <span
          className={cn('text-[10px] font-bold opacity-80', isLight ? 'text-ink' : 'text-surface')}
        >
          {token}
        </span>
      </div>
      <div className="px-3 py-2.5">
        <p className="m-0 text-[13px] font-bold text-ink">{name}</p>
        <p className="mb-1 mt-0.5 text-[11px] text-sand">{vietnameseName}</p>
        <p className="m-0 text-[10px] leading-[1.4] text-ink-muted">{usage}</p>
      </div>
    </div>
  );
}
