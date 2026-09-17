"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ServiceCard } from "@/app/(pages)/services/_components/service-card";
import {
  type Service,
  type ServiceFilterType,
  type PaginatedServicesResponse,
  getPaginatedServices,
} from "@/lib/mocks/services";
import { FadeIn } from "@/components/ui/motion";
import { Loader2, type LucideIcon } from "lucide-react";

interface ServiceCarouselSectionProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  icon: LucideIcon;
  filter: ServiceFilterType;
}

export function ServiceCarouselSection({
  title,
  subtitle,
  badgeText,
  icon: Icon,
  filter,
}: ServiceCarouselSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const LIMIT = 5;

  async function fetchPage(targetPage: number): Promise<PaginatedServicesResponse | null> {
    try {
      const res = await fetch(`/api/services?filter=${filter}&page=${targetPage}&limit=${LIMIT}`);
      if (!res.ok) throw new Error("Falha ao buscar serviços");
      return await res.json();
    } catch {
      return getPaginatedServices({ filter, page: targetPage, limit: LIMIT });
    }
  }

  // Carrega a primeira página
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setInitialLoading(true);
      const data = await fetchPage(1);
      if (isMounted && data) {
        setServices(data.items);
        setPage(data.page);
        setHasMore(data.hasMore);
      }
      if (isMounted) setInitialLoading(false);
    }

    void load();
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Volta ao primeiro slide sempre que os serviços mudam
  useEffect(() => {
    if (api) {
      api.scrollTo(0, true);
    }
  }, [api, services]);

  const handleNext = useCallback(async () => {
    if (isLoading) return;

    // Se ainda há slides para rolar no Embla, rola
    if (api?.canScrollNext()) {
      api.scrollNext();
      return;
    }

    // Sem mais slides e sem mais páginas
    if (!hasMore) return;

    // Carrega próxima página e substitui
    setIsLoading(true);
    const nextPage = page + 1;
    const data = await fetchPage(nextPage);
    if (data) {
      setServices(data.items);
      setPage(data.page);
      setHasMore(data.hasMore);
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, hasMore, isLoading, page]);

  const handlePrev = useCallback(async () => {
    if (isLoading) return;

    // Se há slides anteriores no Embla, rola
    if (api?.canScrollPrev()) {
      api.scrollPrev();
      return;
    }

    // Se estamos na primeira página, não faz nada
    if (page <= 1) return;

    // Carrega página anterior e substitui
    setIsLoading(true);
    const prevPage = page - 1;
    const data = await fetchPage(prevPage);
    if (data) {
      setServices(data.items);
      setPage(data.page);
      setHasMore(true); // voltando sempre tem mais para frente
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, isLoading, page]);

  const canGoPrev = (api?.canScrollPrev() ?? false) || page > 1;
  const canGoNext = (api?.canScrollNext() ?? false) || hasMore;

  return (
    <FadeIn>
      <section className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-2xs">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {title}
                </h2>
                {badgeText && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {badgeText}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-2">
            {services.length > 0 && (
              <span className="text-xs font-medium text-muted-foreground mr-1 hidden sm:inline">
                Página {page}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canGoPrev || isLoading}
                aria-label="Itens anteriores"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-2xs transition-all hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext || isLoading}
                aria-label="Próximos itens"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-2xs transition-all hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Carrossel */}
        {initialLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex h-80 flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card p-4 animate-pulse"
              >
                <div className="h-40 w-full rounded-lg bg-muted" />
                <div className="space-y-2 pt-3">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-5 w-1/3 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              breakpoints: {
                "(min-width: 1280px)": { slidesToScroll: 5 },
                "(min-width: 1024px)": { slidesToScroll: 4 },
                "(min-width: 768px)": { slidesToScroll: 3 },
                "(min-width: 640px)": { slidesToScroll: 2 },
              },
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 py-1">
              {services.map((service, index) => (
                <CarouselItem
                  key={`${service.id}-${index}`}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <ServiceCard service={service} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </section>
    </FadeIn>
  );
}
