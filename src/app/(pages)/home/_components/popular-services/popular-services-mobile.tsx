"use client";

import { ServiceCard } from "../service-card";
import { FadeInSection } from "@/components/ui/motion";
import { popularCategories } from "./popular-categories";

export function PopularServicesMobile() {
  return (
    <FadeInSection>
      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Serviços Populares
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {popularCategories.map((service, index) => (
            <FadeInSection key={service.href} delay={index * 0.05} className="h-full">
              <ServiceCard {...service} />
            </FadeInSection>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}