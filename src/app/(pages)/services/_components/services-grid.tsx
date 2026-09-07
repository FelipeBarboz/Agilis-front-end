"use client";

import { useState } from "react";
import { ServiceCard } from "./service-card";
import { type Service } from "@/lib/mocks/services";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PAGE_SIZE = 15;

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "ellipsis", total];
  if (current >= total - 2) return [1, "ellipsis", total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

interface ServicesGridProps {
  services: Service[];
}

export function ServicesGrid({ services }: ServicesGridProps) {
  const [page, setPage] = useState(1);

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

  const totalPages = Math.ceil(services.length / PAGE_SIZE);
  const safePage = Math.min(page, totalPages);
  const paged = services.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="Anterior"
                  onClick={(e) => {
                    e.preventDefault();
                    if (safePage > 1) setPage(safePage - 1);
                  }}
                  aria-disabled={safePage === 1}
                  className={safePage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPageNumbers(safePage, totalPages).map((p, i) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === safePage}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="Próxima"
                  onClick={(e) => {
                    e.preventDefault();
                    if (safePage < totalPages) setPage(safePage + 1);
                  }}
                  aria-disabled={safePage === totalPages}
                  className={safePage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p className="text-xs text-muted-foreground">
            Página {safePage} de {totalPages} · {services.length} serviços
          </p>
        </div>
      )}
    </div>
  );
}