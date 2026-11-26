"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, Clock, Sparkles } from "lucide-react";
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
import { fetchServicesByStore, type ServiceDetailDTO } from "@/lib/services/services-service";

const PAGE_SIZE = 15;

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "ellipsis", total];
  if (current >= total - 2) return [1, "ellipsis", total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

interface ServiceItemView {
  id: string | number;
  name: string;
  price: string;
  duration: string;
  category?: string;
}

interface ServicesListProps {
  isRestricted?: boolean;
  storeId?: string;
}

export function ServicesList({ isRestricted = false, storeId }: ServicesListProps) {
  const [page, setPage] = useState(1);
  const [services, setServices] = useState<ServiceItemView[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const effectiveStoreId =
      storeId ||
      (typeof window !== "undefined" &&
        (localStorage.getItem("current_store_id") ||
          sessionStorage.getItem("form_storeId"))) ||
      "";

    if (!effectiveStoreId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetchServicesByStore(effectiveStoreId)
      .then((data: ServiceDetailDTO[]) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          const mapped: ServiceItemView[] = data.map((item) => {
            const numPrice = Number(item.price) || 0;
            const priceFormatted = numPrice.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            });
            const mins = item.durationMinutes || 0;
            let durationFormatted = "A combinar";
            if (mins >= 60) {
              const h = Math.floor(mins / 60);
              const m = mins % 60;
              durationFormatted = m > 0 ? `${h}h${m}` : `${h}h`;
            } else if (mins > 0) {
              durationFormatted = `${mins}min`;
            }

            return {
              id: item.id,
              name: item.title,
              price: priceFormatted,
              duration: durationFormatted,
              category: item.category,
            };
          });
          setServices(mapped);
        }
      })
      .catch((err) => {
        console.warn("[ServicesList] Erro ao buscar serviços da loja na API:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [storeId]);

  const totalPages = Math.ceil(services.length / PAGE_SIZE) || 1;
  const paged = services.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const addServiceHref = storeId
    ? `/provider/add-service?storeId=${encodeURIComponent(storeId)}`
    : "/provider/add-service";

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Serviços da Loja</h2>
          <p className="text-sm text-muted-foreground">
            {isRestricted ? "Visualização dos serviços oferecidos pela loja" : "Gerencie os serviços oferecidos e seus valores"}
          </p>
        </div>
        {!isRestricted && (
          <Link
            href={addServiceHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/20"
          >
            <Plus className="size-4" />
            Novo serviço
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-2">
            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-xs text-muted-foreground">Carregando serviços...</span>
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-sm font-semibold text-foreground">Nenhum serviço cadastrado ainda</p>
          <p className="text-xs text-muted-foreground mt-1">
            Clique em &quot;Novo serviço&quot; para cadastrar o primeiro serviço da loja.
          </p>
        </div>
      ) : (
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
                  {service.category && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-muted px-2 py-0.5 rounded-md">
                      <Sparkles className="size-3 text-primary" />
                      {service.category}
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/provider/edit-service/${service.id}`}
                className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
      )}

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
            Página {page} de {totalPages} · {services.length} serviços
          </p>
        </div>
      )}
    </div>
  );
}
