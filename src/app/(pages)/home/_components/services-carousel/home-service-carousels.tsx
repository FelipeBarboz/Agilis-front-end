"use client";

import { Eye, Star, Award } from "lucide-react";
import { ServiceCarouselSection } from "./service-carousel-section";

export function HomeServiceCarousels() {
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

      {/* 2. Serviços Mais Bem Avaliados */}
      <ServiceCarouselSection
        title="Mais Bem Avaliados"
        subtitle="Profissionais e serviços com as melhores notas e comentários"
        badgeText="Destaques"
        icon={Star}
        filter="top_rated"
      />

      {/* 3. Serviços Mais Contratados */}
      <ServiceCarouselSection
        title="Mais Contratados"
        subtitle="Os serviços com maior número de agendamentos e realizações concluídas"
        badgeText="Populares"
        icon={Award}
        filter="most_hired"
      />
    </div>
  );
}
