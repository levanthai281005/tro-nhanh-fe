import { ComponentSection } from '@/components/style-guide/ComponentSection';
import { IconographySection } from '@/components/style-guide/IconographySection';
import { LayoutSection } from '@/components/style-guide/LayoutSection';
import { NavigationSection } from '@/components/style-guide/NavigationSection';
import { OverlaySection } from '@/components/style-guide/OverlaySection';
import { PaletteSection } from '@/components/style-guide/PaletteSection';
import { PrimitivesSection } from '@/components/style-guide/PrimitivesSection';
import { StyleGuideBackButton } from '@/components/style-guide/StyleGuideBackButton';
import { TypographySection } from '@/components/style-guide/TypographySection';

const SECTIONS = [
  '1. Màu sắc',
  '2. Chữ',
  '3. Khoảng cách',
  '4. Biểu tượng',
  '5. Components',
  '6. Navigation',
  '7. Overlays',
  '8. Primitives',
];

export function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="flex h-[34px] items-center justify-center border-b border-line bg-cream px-4 text-center">
        <span className="text-xs font-medium text-primary-press">
          Đây là sản phẩm demo để lấy feedback, tối ưu nhất khi xem trên giao diện web.
        </span>
      </div>

      <header className="bg-primary-press pb-6 pt-7">
        <div className="mx-auto max-w-[1100px] px-8">
          <StyleGuideBackButton />
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="text-[26px] font-extrabold text-cream">Trọ Nhanh</span>
            <span className="text-[13px] text-surface/40">Design System · v2.0 · Style Guide</span>
          </div>
          <p className="mb-5 mt-2 text-sm text-surface/60">
            Hệ thống thiết kế — tông màu cát ấm, thân thiện & đáng tin cậy.
          </p>
          <nav className="flex flex-wrap gap-2" aria-label="Mục lục Style Guide">
            {SECTIONS.map((section, index) => (
              <a
                key={section}
                className="rounded-full border border-surface/20 px-3 py-1 text-[11px] text-surface/60 transition-colors hover:bg-surface/10 hover:text-surface"
                href={`#sec-${index + 1}`}
              >
                {section}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-8 pb-20 pt-11">
        <PaletteSection />
        <TypographySection />
        <LayoutSection />
        <IconographySection />
        <ComponentSection />
        <NavigationSection />
        <OverlaySection />
        <PrimitivesSection />
      </main>

      <footer className="bg-primary-press px-8 py-[22px] text-center">
        <span className="text-xs text-surface/40">
          Trọ Nhanh Design System · v2.0 · Sản phẩm demo — chỉ dùng để thu thập feedback
        </span>
      </footer>
    </div>
  );
}
