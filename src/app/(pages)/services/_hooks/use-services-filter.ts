import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { mockStores, type Store } from "@/lib/mocks/stores";
import type { Filters, EntityType } from "../_components/filters/filter-panel";
import { DEFAULT_FILTERS } from "../_components/filters/default-filters";
import {
  fetchServicesSearch,
  normalizeSearchItemToService,
} from "@/lib/services/services-service";
import {
  fetchStoresSearch,
  normalizeStoreSearchToStore,
  getStoreById,
  type StoreSearchItem,
  type StoreProfileDTO,
} from "@/lib/services/stores-service";
import { type Service } from "@/lib/mocks/services";

// Cache em memória para perfis detalhados de loja
const storeProfileCache = new Map<string, StoreProfileDTO>();

async function getEnrichedStore(item: StoreSearchItem): Promise<Store> {
  const storeId = item.storeId || item.id || "";

  if (item.storeName || item.name) {
    return normalizeStoreSearchToStore(item, null);
  }

  if (storeId && storeProfileCache.has(storeId)) {
    return normalizeStoreSearchToStore(item, storeProfileCache.get(storeId)!);
  }

  if (storeId) {
    try {
      const profile = await getStoreById(storeId);
      if (profile?.id) {
        storeProfileCache.set(storeId, profile);
        return normalizeStoreSearchToStore(item, profile);
      }
    } catch {
      // Se a consulta detalhada falhar, normaliza com os dados básicos da busca
    }
  }

  return normalizeStoreSearchToStore(item, null);
}

export function parseFiltersFromSearchParams(
  params: { get: (key: string) => string | null }
): {
  search: string;
  category: string;
  appliedFilters: Filters;
} {
  const rawCategory = (params.get("category") ?? "todos").trim().toLowerCase();
  const category = rawCategory === "tecnologia" ? "tecnologia_tv" : rawCategory;
  const search = params.get("q") ?? params.get("search") ?? "";

  const typeParam = params.get("type");
  const type: EntityType =
    typeParam === "servicos" || typeParam === "lojas" ? typeParam : "todos";

  const rawState = params.get("state") ?? "";
  const state = rawState.trim().toUpperCase();
  const city = (params.get("city") ?? "").trim();

  const minPriceParam = params.get("minPrice");
  const minPrice =
    minPriceParam !== null && minPriceParam !== "" && !isNaN(Number(minPriceParam))
      ? Math.max(0, Number(minPriceParam))
      : "";

  const maxPriceParam = params.get("maxPrice");
  const maxPrice =
    maxPriceParam !== null && maxPriceParam !== "" && !isNaN(Number(maxPriceParam))
      ? Math.max(0, Number(maxPriceParam))
      : "";

  const ratingParam = params.get("rating");
  const rating =
    ratingParam !== null && ratingParam !== "" && !isNaN(Number(ratingParam))
      ? Math.max(0, Math.min(5, Number(ratingParam)))
      : 0;

  const minVal = minPrice === "" ? 0 : Number(minPrice);
  const maxVal = maxPrice === "" ? 10000 : Number(maxPrice);

  return {
    search,
    category,
    appliedFilters: {
      type,
      state,
      city,
      minPrice,
      maxPrice,
      priceRange: [minVal, maxVal],
      rating,
    },
  };
}

export function buildQueryString(
  search: string,
  category: string,
  filters: Filters
): string {
  const params = new URLSearchParams();

  const trimmedSearch = search.trim();
  if (trimmedSearch) {
    params.set("q", trimmedSearch);
  }

  if (category && category !== "todos") {
    params.set("category", category);
  }

  if (filters.type && filters.type !== "todos") {
    params.set("type", filters.type);
  }

  const trimmedState = filters.state?.trim();
  if (trimmedState) {
    params.set("state", trimmedState.toUpperCase());
  }

  const trimmedCity = filters.city?.trim();
  if (trimmedCity) {
    params.set("city", trimmedCity);
  }

  if (
    filters.minPrice !== "" &&
    filters.minPrice !== undefined &&
    !isNaN(Number(filters.minPrice))
  ) {
    params.set("minPrice", String(filters.minPrice));
  }

  if (
    filters.maxPrice !== "" &&
    filters.maxPrice !== undefined &&
    !isNaN(Number(filters.maxPrice))
  ) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  if (filters.rating && filters.rating > 0) {
    params.set("rating", String(filters.rating));
  }

  return params.toString();
}

function areFiltersEqual(a: Filters, b: Filters): boolean {
  return (
    a.type === b.type &&
    a.state.toUpperCase() === b.state.toUpperCase() &&
    a.city.toLowerCase() === b.city.toLowerCase() &&
    a.minPrice === b.minPrice &&
    a.maxPrice === b.maxPrice &&
    a.rating === b.rating
  );
}

export function useServicesFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parsing inicial a partir dos searchParams
  const initial = useMemo(
    () => parseFiltersFromSearchParams(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [search, setSearch] = useState<string>(initial.search);
  const [category, setCategory] = useState<string>(initial.category);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initial.appliedFilters);

  // Estados dos serviços reais carregados da API
  const [services, setServices] = useState<Service[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [isServicesLoading, setIsServicesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados das lojas reais carregadas da API
  const [stores, setStores] = useState<Store[]>([]);
  const [isStoresLoading, setIsStoresLoading] = useState<boolean>(false);

  const isInitialMount = useRef<boolean>(true);
  // Armazena a última query string enviada via router.replace para prevenir loops
  const lastPushedQueryRef = useRef<string>(searchParams.toString());

  const clearFilters = useCallback(() => {
    setAppliedFilters(DEFAULT_FILTERS);
  }, []);

  // Sincroniza estado interno -> URL (sempre de forma assíncrona após a renderização)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentQs = searchParams.toString();
    const newQs = buildQueryString(search, category, appliedFilters);

    if (newQs === currentQs || newQs === lastPushedQueryRef.current) {
      return;
    }

    const currentQ = searchParams.get("q") ?? searchParams.get("search") ?? "";
    const isSearchChanged = search.trim() !== currentQ.trim();
    const delay = isSearchChanged ? 350 : 0;

    const timer = setTimeout(() => {
      lastPushedQueryRef.current = newQs;
      const newUrl = newQs ? `${pathname}?${newQs}` : pathname;
      router.replace(newUrl, { scroll: false });
    }, delay);

    return () => clearTimeout(timer);
  }, [search, category, appliedFilters, pathname, router, searchParams]);

  // Sincroniza o estado interno se a URL mudar externamente (ex: botão Voltar/Avançar, links na sidebar)
  useEffect(() => {
    const currentQs = searchParams.toString();
    if (currentQs === lastPushedQueryRef.current) {
      return;
    }

    lastPushedQueryRef.current = currentQs;
    const parsed = parseFiltersFromSearchParams(searchParams);

    setSearch((prev) => (prev !== parsed.search ? parsed.search : prev));
    setCategory((prev) => (prev !== parsed.category ? parsed.category : prev));
    setAppliedFilters((prev) =>
      !areFiltersEqual(prev, parsed.appliedFilters) ? parsed.appliedFilters : prev
    );
  }, [searchParams]);

  // Redefine para página 1 quando filtros mudarem
  const prevFilterStateRef = useRef({ search, category, appliedFilters });
  useEffect(() => {
    const prev = prevFilterStateRef.current;
    if (
      prev.search !== search ||
      prev.category !== category ||
      !areFiltersEqual(prev.appliedFilters, appliedFilters)
    ) {
      setPage(1);
      prevFilterStateRef.current = { search, category, appliedFilters };
    }
  }, [search, category, appliedFilters]);

  // Busca dados reais de serviços na API (/api/v1/services/search)
  useEffect(() => {
    if (appliedFilters.type === "lojas") {
      setServices([]);
      setTotalElements(0);
      setTotalPages(1);
      setIsServicesLoading(false);
      return;
    }

    let isCancelled = false;
    setIsServicesLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      void (async () => {
        try {
          const response = await fetchServicesSearch({
            search,
            q: search,
            category,
            state: appliedFilters.state,
            city: appliedFilters.city,
            minPrice: appliedFilters.minPrice,
            maxPrice: appliedFilters.maxPrice,
            rating: appliedFilters.rating,
            page: Math.max(0, page - 1),
            size: 15,
          });

          if (!isCancelled) {
            const mapped = response.items.map(normalizeSearchItemToService);
            setServices(mapped);
            const total = response.totalElements ?? mapped.length;
            setTotalElements(total);
            const totalP =
              response.totalPages && response.totalPages > 0
                ? response.totalPages
                : Math.max(1, Math.ceil(total / 15));
            setTotalPages(totalP);
            setIsServicesLoading(false);
          }
        } catch (err) {
          if (!isCancelled) {
            console.error("[Services] Erro ao carregar serviços da API:", err);
            setError("Não foi possível carregar os serviços da API.");
            setIsServicesLoading(false);
          }
        }
      })();
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [search, category, appliedFilters, page]);

  // Busca lojas reais na API (/api/v1/stores/search)
  useEffect(() => {
    if (appliedFilters.type === "servicos") {
      setStores([]);
      setIsStoresLoading(false);
      return;
    }

    let isCancelled = false;
    setIsStoresLoading(true);

    const timer = setTimeout(() => {
      void (async () => {
        try {
          const apiStores = await fetchStoresSearch({
            search,
            q: search,
            category:
              category !== "todos"
                ? category === "tecnologia"
                  ? "TECNOLOGIA_TV"
                  : category.toUpperCase()
                : undefined,
            state: appliedFilters.state || undefined,
            city: appliedFilters.city || undefined,
          });

          if (isCancelled) return;

          if (Array.isArray(apiStores) && apiStores.length > 0) {
            const enriched = await Promise.all(
              apiStores.map((item) => getEnrichedStore(item))
            );
            if (!isCancelled) {
              // Desduplica lojas por ID caso a API retorne múltiplos registros para a mesma loja
              const uniqueStores = Array.from(
                new Map(
                  enriched.map((s, idx) => [
                    s.id || s.slug || `store-${idx}`,
                    s,
                  ])
                ).values()
              );
              setStores(uniqueStores);
              setIsStoresLoading(false);
            }
          } else {
            // Se a busca na API não retornar lojas, usa fallback filtrado de mockStores
            const fallback = mockStores.filter((st) => {
              const matchesSearch =
                search === "" ||
                st.name.toLowerCase().includes(search.toLowerCase()) ||
                st.category.toLowerCase().includes(search.toLowerCase()) ||
                st.about?.description?.toLowerCase().includes(search.toLowerCase());

              const matchesCategory =
                category === "todos" ||
                st.category.toLowerCase().includes(category.toLowerCase());

              const matchesRating =
                appliedFilters.rating === 0 || st.rating >= appliedFilters.rating;

              const matchesState =
                appliedFilters.state === "" ||
                st.about?.address?.state?.toLowerCase() ===
                  appliedFilters.state.toLowerCase();

              const matchesCity =
                appliedFilters.city === "" ||
                Boolean(
                  st.about?.address?.city
                    ?.toLowerCase()
                    .includes(appliedFilters.city.toLowerCase())
                );

              return (
                matchesSearch &&
                matchesCategory &&
                matchesRating &&
                matchesState &&
                matchesCity
              );
            });

            if (!isCancelled) {
              setStores(fallback);
              setIsStoresLoading(false);
            }
          }
        } catch (err) {
          if (!isCancelled) {
            console.warn("[Stores] Erro ao carregar lojas, usando fallback:", err);
            setStores([]);
            setIsStoresLoading(false);
          }
        }
      })();
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [search, category, appliedFilters]);

  const isLoading =
    appliedFilters.type === "lojas"
      ? isStoresLoading
      : appliedFilters.type === "servicos"
        ? isServicesLoading
        : isServicesLoading || isStoresLoading;

  const totalResults =
    appliedFilters.type === "lojas"
      ? stores.length
      : appliedFilters.type === "servicos"
        ? totalElements
        : totalElements + stores.length;

  return {
    search,
    setSearch,
    category,
    setCategory,
    appliedFilters,
    setAppliedFilters,
    clearFilters,
    filteredServices: services,
    filteredStores: stores,
    totalResults,
    isLoading,
    error,
    page,
    totalPages,
    setPage,
  };
}
