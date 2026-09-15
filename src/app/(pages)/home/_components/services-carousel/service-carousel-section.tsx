"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Keep a ref to services length to scroll to new items after fetching
  const pendingScrollToIndexRef = useRef<number | null>(null);

  // Fetch initial 5 items on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialServices() {
      try {
        setInitialLoading(true);
        const res = await fetch(`/api/services?filter=${filter}&page=1&limit=5`);
        if (!res.ok) throw new Error("Falha ao buscar serviços");
        const data: PaginatedServicesResponse = await res.json();
        if (isMounted) {
          setServices(data.items);
          setPage(data.page);
          setHasMore(data.hasMore);
        }
      } catch (error) {
        console.warn("Fallback para mock local:", error);
        if (isMounted) {
          const fallbackData = getPaginatedServices({
            filter,
            page: 1,
            limit: 5,
          });
          setServices(fallbackData.items);
          setPage(fallbackData.page);
          setHasMore(fallbackData.hasMore);
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    }

    void loadInitialServices();

    return () => {
      isMounted = false;
    };
  }, [filter]);

  // Update canScroll state on carousel select / reInit
  useEffect(() => {
    if (!api) return;

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext() || hasMore);
    };

    updateScrollState();
    api.on("select", updateScrollState);
    api.on("reInit", updateScrollState);

    return () => {
      api.off("select", updateScrollState);
      api.off("reInit", updateScrollState);
    };
  }, [api, hasMore]);

  // After new items are added, scroll to the newly fetched items
  useEffect(() => {
    if (api && pendingScrollToIndexRef.current !== null) {
      const targetIndex = pendingScrollToIndexRef.current;
      pendingScrollToIndexRef.current = null;
      // Pequeno timeout para permitir que o Embla recalcule o tamanho e slides
      setTimeout(() => {
        api.reInit();
        api.scrollTo(targetIndex);
      }, 60);
    }
  }, [api, services]);

  // Fetch next 5 items (GET)
  const fetchNextFive = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const targetScrollIndex = services.length;
      pendingScrollToIndexRef.current = targetScrollIndex;

      const res = await fetch(
        `/api/services?filter=${filter}&page=${nextPage}&limit=5`
      );

      if (!res.ok) throw new Error("Erro na requisição dos serviços");
      const data: PaginatedServicesResponse = await res.json();

      setServices((prev) => [...prev, ...data.items]);
      setPage(nextPage);
      setHasMore(data.hasMore);
    } catch (error) {
      console.warn("Fallback para mock local na paginação:", error);
      const nextPage = page + 1;
      const fallbackData = getPaginatedServices({
        filter,
        page: nextPage,
        limit: 5,
      });

      setServices((prev) => [...prev, ...fallbackData.items]);
      setPage(nextPage);
      setHasMore(fallbackData.hasMore);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, filter, services.length]);

  // Handle clicking next arrow
  const handleNextClick = useCallback(() => {
    if (isLoading) return;

    if (api?.canScrollNext()) {
      api.scrollNext();
    } else if (hasMore) {
      void fetchNextFive();
    }
  }, [api, hasMore, isLoading, fetchNextFive]);

  // Handle clicking prev arrow
  const handlePrevClick = useCallback(() => {
    if (api?.canScrollPrev()) {
      api.scrollPrev();
    }
  }, [api]);

  return (
    <FadeIn>
      <section className="flex flex-col gap-4">
        {/* Header com Título, Badge e Botões de Navegação */}
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

          {/* Controles de Navegação e Contador */}
          <div className="flex items-center gap-2">
            {services.length > 0 && (
              <span className="text-xs font-medium text-muted-foreground mr-1 hidden sm:inline">
                {services.length} {services.length === 1 ? "serviço" : "serviços"} carregados
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevClick}
                disabled={!canScrollPrev}
                aria-label="Itens anteriores"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-2xs transition-all hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                <span className="sr-only">Anterior</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleNextClick}
                disabled={(!canScrollNext && !hasMore) || isLoading}
                aria-label="Próximos itens"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-2xs transition-all hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              >
                <span className="sr-only">Próximo</span>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo do Carrossel */}
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
                  <div className="h-full">
                    <ServiceCard service={service} index={index % 5} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </section>
    </FadeIn>
  );
}
