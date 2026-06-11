import { HeroSection } from "./_components/hero-section";
import { SearchBar } from "./_components/search-bar";
import { PopularServices } from "./_components/popular-services";
import { CorporateBanner } from "./_components/corporate-banner";
import { HomeFooter } from "./_components/home-footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Scrollable content area */}
      <main className="flex flex-1 flex-col gap-8 overflow-y-auto bg-[#F5F5F5] p-6">
        <HeroSection />
        <SearchBar />
        <PopularServices />
        <CorporateBanner />
      </main>

      <HomeFooter />
    </div>
  );
}
