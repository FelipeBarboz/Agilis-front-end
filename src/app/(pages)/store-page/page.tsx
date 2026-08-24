"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getStoreById, getServicesByStore } from "@/lib/mocks/stores";
import { StoreHeader } from "./_components/store-header";
import { StoreServices } from "./_components/store-services";
import { PageTransition } from "@/components/ui/motion";

function StorePageContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("id") || searchParams.get("storeId") || "store-super-pinturas";

  const store = useMemo(() => getStoreById(storeId), [storeId]);
  const services = useMemo(() => getServicesByStore(store), [store]);

  return (
    <main className="flex flex-1 flex-col gap-6 overflow-y-auto bg-muted p-4 sm:p-6 lg:p-8">
      <PageTransition className="flex flex-col gap-6 mx-auto w-full max-w-6xl">
        {/* Cabeçalho da Loja com informações, logo, distância, avaliação, disponibilidade e botão sobre nós */}
        <StoreHeader store={store} />

        {/* Grade de serviços disponibilizados pela loja */}
        <StoreServices services={services} storeName={store.name} />
      </PageTransition>
    </main>
  );
}

export default function StorePage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center bg-muted p-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Carregando loja...</p>
          </div>
        </main>
      }
    >
      <StorePageContent />
    </Suspense>
  );
}
