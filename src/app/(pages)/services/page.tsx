"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ServicesSearchBar } from "./_components/services-search-bar";
import { CategoryFilter } from "./_components/category-filter";
import { FilterPanel, type Filters } from "./_components/filter-panel";
import { ServicesGrid } from "./_components/services-grid";
import { StoreCard } from "./_components/store-card";
import { mockServices } from "@/lib/mocks/services";
import { mockStores } from "@/lib/mocks/stores";

const DEFAULT_FILTERS: Filters = {
  type: "todos",
  state: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  priceRange: [0, 10000],
  rating: 0,
};

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "todos";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);

  // ← Sincroniza o estado com a URL sempre que o query param mudar
  useEffect(() => {
    const cat = searchParams.get("category") ?? "todos";
    setCategory(cat);
  }, [searchParams]);

  const filteredServices = useMemo(() => {
    if (appliedFilters.type === "lojas") return [];

    return mockServices.filter((s) => {
      const matchesSearch =
        search === "" ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.company.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "todos" || s.category === category;

      const minP =
        appliedFilters.minPrice !== ""
          ? Number(appliedFilters.minPrice)
          : appliedFilters.priceRange[0];
      const maxP =
        appliedFilters.maxPrice !== ""
          ? Number(appliedFilters.maxPrice)
          : appliedFilters.priceRange[1];

      const matchesPrice =
        s.price.inicial >= minP && s.price.inicial <= maxP;

      const matchesRating =
        appliedFilters.rating === 0 || s.rating >= appliedFilters.rating;

      const matchesState =
        appliedFilters.state === "" ||
        (s.state && s.state.toLowerCase() === appliedFilters.state.toLowerCase());

      const matchesCity =
        appliedFilters.city === "" ||
        (s.city && s.city.toLowerCase().includes(appliedFilters.city.toLowerCase())) ||
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
        st.about?.address?.state.toLowerCase() === appliedFilters.state.toLowerCase();

      const matchesCity =
        appliedFilters.city === "" ||
        st.about?.address?.city.toLowerCase().includes(appliedFilters.city.toLowerCase());

      return matchesSearch && matchesCategory && matchesRating && matchesState && matchesCity;
    });
  }, [search, category, appliedFilters]);

  const totalResults =
    appliedFilters.type === "lojas"
      ? filteredStores.length
      : appliedFilters.type === "servicos"
      ? filteredServices.length
      : filteredServices.length + filteredStores.length;

  return (
    <main className="flex flex-1 flex-col gap-4 overflow-y-auto bg-muted p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ServicesSearchBar value={search} onChange={setSearch} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <CategoryFilter selected={category} onChange={setCategory} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FilterPanel
            onApply={setAppliedFilters}
            onClear={() => setAppliedFilters(DEFAULT_FILTERS)}
            initialFilters={appliedFilters}
          />
        </motion.div>

        <motion.p
          className="text-xs font-medium text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {totalResults} {totalResults === 1 ? "resultado encontrado" : "resultados encontrados"}
        </motion.p>

        {/* Visualização exclusiva de Lojas */}
        {appliedFilters.type === "lojas" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStores.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <p className="text-base font-medium text-foreground">Nenhuma loja encontrada</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente ajustar os filtros de localização ou categoria.
                </p>
              </div>
            ) : (
              filteredStores.map((store, index) => (
                <StoreCard key={store.id} store={store} index={index} />
              ))
            )}
          </div>
        )}

        {/* Visualização exclusiva de Serviços */}
        {appliedFilters.type === "servicos" && (
          <ServicesGrid services={filteredServices} />
        )}

        {/* Visualização de Todos (Serviços e Lojas) */}
        {appliedFilters.type === "todos" && (
          <div className="flex flex-col gap-6">
            {filteredStores.length > 0 && (
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base font-bold text-foreground">
                    Lojas encontradas
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {filteredStores.length} {filteredStores.length === 1 ? "loja" : "lojas"}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredStores.map((store, index) => (
                    <StoreCard key={store.id} store={store} index={index} />
                  ))}
                </div>
              </section>
            )}

            <section className="flex flex-col gap-3">
              {filteredStores.length > 0 && (
                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                  <h2 className="text-sm sm:text-base font-bold text-foreground">
                    Serviços disponíveis
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {filteredServices.length} {filteredServices.length === 1 ? "serviço" : "serviços"}
                  </span>
                </div>
              )}
              <ServicesGrid services={filteredServices} />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}