import { HeroSection } from "./home/_components/hero-section/hero-section";
import { PopularServices } from "./home/_components/popular-services/popular-services";
import { CorporateBanner } from "./home/_components/corporate-banner/corporate-banner";
import { HomeServiceCarousels } from "./home/_components/services-carousel/home-service-carousels";

export default function HomePage() {
  return (
    <main className="flex-1 bg-muted">
      <div className="flex flex-col gap-0 p-0 lg:gap-8 lg:p-6">
        <HeroSection />
        <PopularServices />
        <CorporateBanner />
        <div className="hidden lg:block">
          <HomeServiceCarousels />
        </div>
      </div>
    </main>
  );
}
