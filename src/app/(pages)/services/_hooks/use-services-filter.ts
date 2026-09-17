import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { mockServices } from "@/lib/mocks/services";
import { mockStores } from "@/lib/mocks/stores";
import type { Filters, EntityType } from "../_components/filters/filter-panel";
import { DEFAULT_FILTERS } from "../_components/filters/default-filters";

export function parseFiltersFromSearchParams(
  params: { get: (key: string) => string | null }
): {
  search: string;
  category: string;
  appliedFilters: Filters;
} {
  const category = params.get("category") ?? "todos";
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

  const filteredServices = useMemo(() => {
    if (appliedFilters.type === "lojas") return [];

    return mockServices.filter((s) => {
      const matchesSearch =
        search === "" ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.company.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "todos" || s.category === category;

      const minP =
        appliedFilters.minPrice !== ""
          ? Number(appliedFilters.minPrice)
          : appliedFilters.priceRange[0];
      const maxP =
        appliedFilters.maxPrice !== ""
          ? Number(appliedFilters.maxPrice)
          : appliedFilters.priceRange[1];

      const matchesPrice = s.price.inicial >= minP && s.price.inicial <= maxP;

      const matchesRating =
        appliedFilters.rating === 0 || s.rating >= appliedFilters.rating;

      const matchesState =
        appliedFilters.state === "" ||
        s.state?.toLowerCase() === appliedFilters.state.toLowerCase();

      const matchesCity =
        appliedFilters.city === "" ||
        Boolean(s.city?.toLowerCase().includes(appliedFilters.city.toLowerCase())) ||
        s.availability.toLowerCase().includes(appliedFilters.city.toLowerCase());

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesState &&
        matchesCity
      );
    });
  }, [search, category, appliedFilters]);

  const filteredStores = useMemo(() => {
    if (appliedFilters.type === "servicos") return [];

    return mockStores.filter((st) => {
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
  }, [search, category, appliedFilters]);

  const totalResults =
    appliedFilters.type === "lojas"
      ? filteredStores.length
      : appliedFilters.type === "servicos"
        ? filteredServices.length
        : filteredServices.length + filteredStores.length;

  return {
    search,
    setSearch,
    category,
    setCategory,
    appliedFilters,
    setAppliedFilters,
    clearFilters,
    filteredServices,
    filteredStores,
    totalResults,
  };
}
