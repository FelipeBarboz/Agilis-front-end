"use client";

import { ServiceCard } from "./service-card";
import { type Service } from "@/lib/mocks/services";

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-base font-medium text-foreground">Nenhum serviço encontrado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tente ajustar os filtros ou buscar por outro termo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <ServiceCard key={service.id} service={service} index={index} />
      ))}
    </div>
  );
}