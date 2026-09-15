"use client";

import { Suspense } from "react";
import { ServicesFilters } from "./_components/filters/services-filters";
import { ServicesResults } from "./_components/services-results";
import { DEFAULT_FILTERS } from "./_components/filters/default-filters";
import { useServicesFilter } from "./_hooks/use-services-filter";

function ServicesContent() {
  const {
    search,
    setSearch,
    category,
    setCategory,
    appliedFilters,
    setAppliedFilters,
    filteredServices,
    filteredStores,
    totalResults,
  } = useServicesFilter();

  return (
    <main className="flex flex-1 flex-col gap-4 overflow-y-auto bg-muted p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-4">
        <ServicesFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          appliedFilters={appliedFilters}
          onApplyFilters={setAppliedFilters}
          onClearFilters={() => setAppliedFilters(DEFAULT_FILTERS)}
          totalResults={totalResults}
        />

        <ServicesResults
          filterType={appliedFilters.type}
          services={filteredServices}
          stores={filteredStores}
        />
      </div>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center bg-muted p-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Carregando serviços...</p>
          </div>
        </main>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}