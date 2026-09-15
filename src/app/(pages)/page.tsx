import { HeroSection } from "./home/_components/hero-section/hero-section";
import { PopularServices } from "./home/_components/popular-services/popular-services";
import { CorporateBanner } from "./home/_components/corporate-banner/corporate-banner";
import { HomeServiceCarousels } from "./home/_components/services-carousel/home-service-carousels";

export default function HomePage() {
  return (
    <main className="flex-1 overflow-y-auto bg-muted min-h-0">
      <div className="flex flex-col gap-8 p-6">
        <HeroSection />
        <PopularServices />
        <CorporateBanner />
        <HomeServiceCarousels />
      </div>
    </main>
  );
}
