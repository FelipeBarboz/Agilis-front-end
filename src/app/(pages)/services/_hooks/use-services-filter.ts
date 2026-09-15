import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { mockServices } from "@/lib/mocks/services";
import { mockStores } from "@/lib/mocks/stores";
import type { Filters } from "../_components/filters/filter-panel";
import { DEFAULT_FILTERS } from "../_components/filters/default-filters";

export function useServicesFilter() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "todos";
  const initialQ = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);

  // Sincroniza category e q com a URL sempre que os query params mudarem
  useEffect(() => {
    const cat = searchParams.get("category") ?? "todos";
    setCategory(cat);
    const q = searchParams.get("q") ?? "";
    if (q) setSearch(q);
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
        st.about?.address?.state.toLowerCase() ===
        appliedFilters.state.toLowerCase();

      const matchesCity =
        appliedFilters.city === "" ||
        st.about?.address?.city
          .toLowerCase()
          .includes(appliedFilters.city.toLowerCase());

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
    filteredServices,
    filteredStores,
    totalResults,
  };
}
