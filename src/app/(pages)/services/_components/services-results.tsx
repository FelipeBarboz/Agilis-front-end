"use client";

import { ServicesGrid } from "./services-grid";
import { StoresGrid } from "./stores-grid";
import { type Service } from "@/lib/mocks/services";
import { type Store } from "@/lib/mocks/stores";
import { type Filters } from "./filters/filter-panel";

interface ServicesResultsProps {
  filterType: Filters["type"];
  services: Service[];
  stores: Store[];
}

export function ServicesResults({
  filterType,
  services,
  stores,
}: ServicesResultsProps) {
  if (filterType === "lojas") {
    return <StoresGrid stores={stores} />;
  }

  if (filterType === "servicos") {
    return <ServicesGrid services={services} />;
  }

  // filterType === "todos"
  return (
    <div className="flex flex-col gap-6">
      {stores.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              Lojas encontradas
            </h2>
            <span className="text-xs text-muted-foreground">
              {stores.length} {stores.length === 1 ? "loja" : "lojas"}
            </span>
          </div>
          <StoresGrid stores={stores} showEmptyState={false} />
        </section>
      )}

      <section className="flex flex-col gap-3">
        {stores.length > 0 && (
          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              Serviços disponíveis
            </h2>
            <span className="text-xs text-muted-foreground">
              {services.length} {services.length === 1 ? "serviço" : "serviços"}
            </span>
          </div>
        )}
        <ServicesGrid services={services} />
      </section>
    </div>
  );
}
