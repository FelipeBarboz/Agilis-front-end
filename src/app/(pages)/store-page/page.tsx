"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getStoreById, getServicesByStore } from "@/lib/mocks/stores";
import { type Service } from "@/lib/mocks/services";
import { getServicesByStoreId } from "@/lib/services/services-service";
import { StoreHeader } from "./_components/store-header";
import { StoreServices } from "./_components/store-services";
import { PageTransition } from "@/components/ui/motion";

function StorePageContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("id") ?? searchParams.get("storeId") ?? "store-super-pinturas";
  const nameParam = searchParams.get("name") ?? searchParams.get("storeName") ?? "";

  const store = useMemo(() => {
    const s = getStoreById(storeId);
    if (nameParam && storeId !== "store-super-pinturas") {
      return {
        ...s,
        id: storeId,
        name: nameParam,
        initials: nameParam
          .split(" ")
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase(),
      };
    }
    return s;
  }, [storeId, nameParam]);

  const [services, setServices] = useState<Service[]>(() => getServicesByStore(store));

  useEffect(() => {
    let isCancelled = false;

    // Busca serviços da loja no backend via GET /api/v1/services/store/{storeId}
    getServicesByStoreId(storeId, store.name)
      .then((items) => {
        if (!isCancelled) {
          if (items.length > 0) {
            setServices(items);
          } else {
            setServices(getServicesByStore(store));
          }
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn(`[StorePage] Falha ao carregar serviços da loja ${storeId}:`, err);
          setServices(getServicesByStore(store));
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [storeId, store]);

  return (
    <main className="flex flex-1 flex-col gap-6 bg-muted p-4 sm:p-6 lg:p-8">
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
