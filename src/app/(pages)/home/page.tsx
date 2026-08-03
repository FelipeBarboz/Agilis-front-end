import { HeroSection } from "./_components/hero-section/hero-section";
import { PopularServices } from "./_components/popular-services/popular-services";
import { CorporateBanner } from "./_components/corporate-banner/corporate-banner";
import { HomeFooter } from "./_components/home-footer/home-footer";
import { PageTransition } from "@/components/ui/motion";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col gap-8 overflow-y-auto bg-muted p-6">
        <PageTransition className="flex flex-col gap-8">
          <HeroSection />
          <PopularServices />
          <CorporateBanner />
        </PageTransition>
      </main>
      <HomeFooter />
    </div>
  );
}