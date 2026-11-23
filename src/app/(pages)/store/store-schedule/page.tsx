"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { StoreScheduleBody } from "@/app/(pages)/employee-store/[storeId]/store-schedule/_components/store-schedule-body";
import { getMyStores } from "@/lib/services/stores-service";

function StoreSchedulePageContent() {
  const searchParams = useSearchParams();
  const storeIdParam = searchParams.get("storeId");
  const [storeId, setStoreId] = useState<string>(storeIdParam ?? "");

  useEffect(() => {
    if (storeIdParam) {
      setStoreId(storeIdParam);
      return;
    }

    async function loadStore() {
      try {
        const stores = await getMyStores();
        if (stores.length > 0 && stores[0]?.storeId) {
          setStoreId(stores[0].storeId);
        }
      } catch (err) {
        console.warn("[StoreSchedulePage] Falha ao carregar loja:", err);
      }
    }
    void loadStore();
  }, [storeIdParam]);

  return <StoreScheduleBody storeId={storeId} canEdit={true} />;
}

export default function StoreSchedulePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Carregando escala da loja...</div>}>
      <StoreSchedulePageContent />
    </Suspense>
  );
}
