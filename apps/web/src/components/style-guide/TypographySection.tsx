import { StyleGuideSection } from '@/components/style-guide/StyleGuideSection';
import { TYPE_SCALE } from '@/components/style-guide/styleGuideData';

export function TypographySection() {
  return (
    <StyleGuideSection id="sec-2" title="2 · Chữ / Typography">
      <p className="mb-5 text-[13px] text-ink-muted">
        Font: <strong>Be Vietnam Pro</strong> — đầy đủ dấu tiếng Việt. Fallback: Inter, system-ui,
        sans-serif.
      </p>
      <div className="flex flex-col">
        {TYPE_SCALE.map((typeItem) => (
          <div
            key={typeItem.name}
            className="grid grid-cols-[100px_1fr] items-start gap-4 border-b border-line py-4"
          >
            <div>
              <p className="m-0 text-xs font-bold text-ink-muted">{typeItem.name}</p>
              <p className="mt-0.5 text-[10px] text-sand">{typeItem.meta}</p>
            </div>
            <p className={typeItem.className}>{typeItem.sample}</p>
          </div>
        ))}
      </div>
    </StyleGuideSection>
  );
}
