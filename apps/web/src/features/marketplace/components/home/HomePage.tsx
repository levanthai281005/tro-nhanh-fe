import { FeaturedRoomsSection } from '@/features/marketplace/components/home/FeaturedRoomsSection';
import { HeroSection } from '@/features/marketplace/components/home/HeroSection';
import { LandlordCTA } from '@/features/marketplace/components/home/LandlordCTA';
import { MarketplaceSections } from '@/features/marketplace/components/home/MarketplaceSections';
import { PostingCTASection } from '@/features/marketplace/components/home/PostingCTASection';
import { SiteFooter } from '@/features/marketplace/components/SiteFooter';
import { WhyUsSection } from '@/features/marketplace/components/home/WhyUsSection';

export function HomePage() {
  return (
    <>
      <main className="flex-1 bg-canvas">
        <HeroSection />
        <FeaturedRoomsSection />
        <MarketplaceSections />
        <WhyUsSection />
        <PostingCTASection />
        <LandlordCTA />
      </main>
      <SiteFooter />
    </>
  );
}
