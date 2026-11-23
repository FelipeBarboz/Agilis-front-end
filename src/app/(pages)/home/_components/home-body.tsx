"use client";

import { HeroSection } from "./hero-section/hero-section";
import { PopularServices } from "./popular-services/popular-services";
import { CorporateBanner } from "./corporate-banner/corporate-banner";
import { HomeServiceCarousels } from "./services-carousel/home-service-carousels";
import { WhyAgilis } from "./why-agilis/why-agilis";
import { FirstServiceDiscount } from "./first-service-discount/first-service-discount";
import { useHomeAuth } from "../_hooks/use-home-auth";

export function HomeBody() {
  const { isLoggedIn } = useHomeAuth();

  return (
    <main className="flex-1 bg-muted">
      <div className="flex flex-col gap-0 p-0 lg:gap-8 lg:p-6">
        <HeroSection />
        <PopularServices />
        <CorporateBanner />

        {/* Seção "Por que usar o Agilis?" — somente deslogado */}
        {!isLoggedIn && <WhyAgilis />}

        {/* Card de 30% de desconto — sempre visível */}
        <FirstServiceDiscount />

        {/* Carrosséis — desktop only */}
        <div className="hidden lg:block">
          <HomeServiceCarousels showTopRated={isLoggedIn} />
        </div>
      </div>
    </main>
  );
}
