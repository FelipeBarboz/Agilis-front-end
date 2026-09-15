"use client";

import { StoreCard } from "./store-card";
import { type Store } from "@/lib/mocks/stores";

interface StoresGridProps {
  stores: Store[];
  showEmptyState?: boolean;
}

export function StoresGrid({ stores, showEmptyState = true }: StoresGridProps) {
  if (stores.length === 0 && showEmptyState) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
        <p className="text-base font-medium text-foreground">
          Nenhuma loja encontrada
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tente ajustar os filtros de localização ou categoria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stores.map((store, index) => (
        <StoreCard key={store.id} store={store} index={index} />
      ))}
    </div>
  );
}
