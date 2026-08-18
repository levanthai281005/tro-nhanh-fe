import type { Metadata } from 'next';
import { StyleGuidePage } from '@/components/style-guide/StyleGuidePage';

export const metadata: Metadata = {
  title: 'Design System',
  description: 'Style Guide và bộ primitive giao diện của Trọ Nhanh.',
};

export default function Page() {
  return <StyleGuidePage />;
}
