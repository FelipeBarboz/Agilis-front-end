"use client";

import { useState } from "react";
import { Plus, Tag, Clock } from "lucide-react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { mockProfileServices } from "@/lib/mocks/profile-services";

const PAGE_SIZE = 15;

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "ellipsis", total];
  if (current >= total - 2) return [1, "ellipsis", total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

export function ServicesList() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(mockProfileServices.length / PAGE_SIZE);
  const paged = mockProfileServices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Serviços da Loja</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os serviços oferecidos e seus valores
          </p>
        </div>
        <Link
          href="/provider/add-service"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/20"
        >
          <Plus className="size-4" />
          Novo serviço
        </Link>
      </div>

      <div className="mt-2 divide-y divide-border border-t border-border">
        {paged.map((service) => (
          <div key={service.id} className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-foreground">{service.name}</span>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <Tag className="size-3.5" />
                  {service.price}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {service.duration}
                </span>
              </div>
            </div>
            <Link
              href="/provider/add-service"
              className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
            >
              Editar
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pt-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="Anterior"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
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
                    if (page < totalPages) setPage(page + 1);
                  }}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            Página {page} de {totalPages} · {mockProfileServices.length} serviços
          </p>
        </div>
      )}
    </div>
  );
}
