import type { ReactNode } from 'react';

export interface StyleGuideSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function StyleGuideSection(props: StyleGuideSectionProps) {
  const { id, title, children } = props;

  return (
    <section id={id} className="mb-12 scroll-mt-6">
      <h2 className="mb-6 border-b-2 border-line pb-2 text-[22px] font-bold tracking-[-0.01em] text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}
