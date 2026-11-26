"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ServiceCard } from "@/app/(pages)/services/_components/service-card";
import type { Service, ServiceFilterType } from "@/lib/mocks/services";
import {
  fetchMostHiredServices,
  fetchTopRatedServices,
  fetchTrendingServices,
} from "@/lib/services/services-service";
import { FadeIn } from "@/components/ui/motion";
import { type LucideIcon } from "lucide-react";

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
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);

  const LIMIT = 5;

  // Carrega os serviços da API real conforme o filtro
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setInitialLoading(true);
      let items: Service[] = [];

      if (filter === "top_rated") {
        items = await fetchTopRatedServices(15);
      } else if (filter === "most_visited") {
        // Combina trending com fallback para most-hired caso trending esteja vazio
        items = await fetchTrendingServices(15);
        if (items.length === 0) {
          items = await fetchMostHiredServices(15);
        }
      } else {
        items = await fetchMostHiredServices(15);
      }

      if (isMounted) {
        setAllServices(items);
        setPage(1);
        setInitialLoading(false);
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, [filter]);

  const totalPages = Math.max(1, Math.ceil(allServices.length / LIMIT));
  const hasMore = page < totalPages;
  const services = allServices.slice((page - 1) * LIMIT, page * LIMIT);

  // Volta ao primeiro slide sempre que os serviços mudam
  useEffect(() => {
    if (api) {
      api.scrollTo(0, true);
    }
  }, [api, page, allServices]);

  const handleNext = useCallback(() => {
    if (api?.canScrollNext()) {
      api.scrollNext();
      return;
    }
    if (!hasMore) return;
    setPage((prev) => Math.min(totalPages, prev + 1));
  }, [api, hasMore, totalPages]);

  const handlePrev = useCallback(() => {
    if (api?.canScrollPrev()) {
      api.scrollPrev();
      return;
    }
    if (page <= 1) return;
    setPage((prev) => Math.max(1, prev - 1));
  }, [api, page]);

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
                disabled={!canGoPrev || initialLoading}
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
                disabled={!canGoNext || initialLoading}
                aria-label="Próximos itens"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-2xs transition-all hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
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
        ) : services.length === 0 ? (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 py-10 text-sm text-muted-foreground">
            Nenhum serviço em destaque disponível no momento.
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
