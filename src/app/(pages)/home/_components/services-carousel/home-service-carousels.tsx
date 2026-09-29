"use client";

import { Eye, Star } from "lucide-react";
import { ServiceCarouselSection } from "./service-carousel-section";

interface HomeServiceCarouselsProps {
  showTopRated?: boolean;
}

export function HomeServiceCarousels({ showTopRated = false }: HomeServiceCarouselsProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* 1. Serviços Mais Visitados */}
      <ServiceCarouselSection
        title="Serviços Mais Visitados"
        subtitle="Os serviços que estão chamando mais atenção dos clientes"
        badgeText="Em Alta"
        icon={Eye}
        filter="most_visited"
      />

      {/* 2. Serviços Mais Bem Avaliados — só aparece logado */}
      {showTopRated && (
        <ServiceCarouselSection
          title="Mais Bem Avaliados"
          subtitle="Profissionais e serviços com as melhores notas e comentários"
          badgeText="Destaques"
          icon={Star}
          filter="top_rated"
        />
      )}
    </div>
  );
}
