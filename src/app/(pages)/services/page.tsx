"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ServicesSearchBar } from "./_components/services-search-bar";
import { CategoryFilter } from "./_components/category-filter";
import { FilterPanel, type Filters } from "./_components/filter-panel";
import { ServicesGrid } from "./_components/services-grid";
import { mockServices } from "@/lib/mocks/services";

const DEFAULT_FILTERS: Filters = {
  city: "",
  priceRange: [0, 1000],
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

  const filtered = useMemo(() => {
    return mockServices.filter((s) => {
      const matchesSearch =
        search === "" ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "todos" || s.category === category;

      const matchesPrice =
        s.price.inicial >= appliedFilters.priceRange[0] &&
        s.price.inicial <= appliedFilters.priceRange[1];

      const matchesRating =
        appliedFilters.rating === 0 || s.rating >= appliedFilters.rating;

      const matchesCity =
        appliedFilters.city === "" ||
        s.availability.toLowerCase().includes(appliedFilters.city.toLowerCase());

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesCity;
    });
  }, [search, category, appliedFilters]);

  return (
    <main className="flex flex-1 flex-col gap-4 overflow-y-auto bg-muted p-6">

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
        />
      </motion.div>

      <motion.p
        className="text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        {filtered.length} {filtered.length === 1 ? "serviço encontrado" : "serviços encontrados"}
      </motion.p>

      <ServicesGrid services={filtered} />

    </main>
  );
}