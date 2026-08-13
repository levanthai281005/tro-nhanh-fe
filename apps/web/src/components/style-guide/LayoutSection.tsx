import { StyleGuideSection } from '@/components/style-guide/StyleGuideSection';

const SPACING_SCALE = [
  { value: 4, className: 'size-1' },
  { value: 8, className: 'size-2' },
  { value: 12, className: 'size-3' },
  { value: 16, className: 'size-4' },
  { value: 24, className: 'size-6' },
  { value: 32, className: 'size-8' },
] as const;

const RADIUS_SCALE = [
  { label: 'sm / 8px', className: 'h-12 w-16 rounded-sm' },
  { label: 'md / 12px', className: 'h-12 w-16 rounded-md' },
  { label: 'lg / 14px', className: 'h-12 w-16 rounded-lg' },
  { label: 'pill', className: 'h-9 w-20 rounded-full' },
  { label: 'circle', className: 'size-12 rounded-full' },
] as const;

export function LayoutSection() {
  return (
    <StyleGuideSection id="sec-3" title="3 · Khoảng Cách & Bố Cục">
      <p className="mb-3 text-sm font-semibold text-ink">Spacing scale (8px base)</p>
      <div className="mb-8 flex flex-wrap items-end gap-6">
        {SPACING_SCALE.map((spacing) => (
          <div key={spacing.value} className="text-center">
            <div className="mb-1 flex h-10 items-end justify-center">
              <span className={`${spacing.className} block rounded-[3px] bg-primary`} />
            </div>
            <span className="text-[10px] text-ink-muted">{spacing.value}px</span>
          </div>
        ))}
      </div>

      <p className="mb-3 text-sm font-semibold text-ink">Corner radius scale</p>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        {RADIUS_SCALE.map((radius) => (
          <div key={radius.label} className="text-center">
            <span className={`${radius.className} block border-[1.5px] border-line bg-cream`} />
            <span className="mt-1.5 block text-[10px] text-ink-muted">{radius.label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-line bg-surface p-5">
        <p className="mb-2.5 text-[13px] font-bold text-ink">Responsive grid</p>
        {[
          {
            label: 'Desktop ≥ 1024px',
            description: 'Top navbar + 4-col room grid + left sidebar filters',
          },
          {
            label: 'Tablet 768–1023px',
            description: '2-col room grid, sidebar collapses',
          },
          {
            label: 'Mobile < 768px',
            description: 'Bottom tab bar + 1-col list + bottom-sheet filters + sticky CTA',
          },
        ].map((layout) => (
          <div
            key={layout.label}
            className="mb-1.5 flex items-center gap-3 rounded-sm bg-canvas px-3.5 py-[9px] last:mb-0"
          >
            <span className="min-w-[170px] shrink-0 text-[13px] font-bold text-primary">
              {layout.label}
            </span>
            <span className="text-[13px] text-ink-muted">{layout.description}</span>
          </div>
        ))}
      </div>
    </StyleGuideSection>
  );
}
