"use client";

import { motion } from "motion/react";
import { ServicesSearchBar } from "../services-search-bar";
import { CategoryFilter } from "./category-filter";
import { FilterPanel, type Filters } from "./filter-panel";

interface ServicesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  appliedFilters: Filters;
  onApplyFilters: (filters: Filters) => void;
  onClearFilters: () => void;
  totalResults: number;
}

export function ServicesFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  appliedFilters,
  onApplyFilters,
  onClearFilters,
  totalResults,
}: ServicesFiltersProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ServicesSearchBar value={search} onChange={onSearchChange} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <CategoryFilter selected={category} onChange={onCategoryChange} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <FilterPanel
          onApply={onApplyFilters}
          onClear={onClearFilters}
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
    </>
  );
}
