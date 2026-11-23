"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Store, Building2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyStores, type MyStore } from "@/lib/services/stores-service";
import { JoinStoreCard } from "./join-store-card";
import { StoreCardItem } from "./store-card-item";

export function StoresBody() {
  const router = useRouter();
  const [stores, setStores] = useState<MyStore[]>([]);
  const [currentStoreId, setCurrentStoreId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadStores = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const activeId = localStorage.getItem("current_store_id") || "";
      setCurrentStoreId(activeId);

      const myStoresList = await getMyStores();
      setStores(myStoresList);

      // Se há lojas e nenhuma ativa (ou a ativa não está na lista), define a primeira como ativa
      if (myStoresList.length > 0) {
        const hasValidCurrent = myStoresList.some((s) => s.storeId === activeId);
        if (!activeId || !hasValidCurrent) {
          const firstStore = myStoresList[0];
          if (firstStore) {
            localStorage.setItem("current_store_id", firstStore.storeId);
            localStorage.setItem("has_active_store", "true");
            setCurrentStoreId(firstStore.storeId);
          }
        }
      }
    } catch (err: unknown) {
      console.error("[StoresBody] Erro ao buscar lojas do usuário:", err);
      const msg =
        err instanceof Error ? err.message : "Falha ao carregar suas lojas.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStores();
  }, [loadStores]);

  const handleSelectStore = (store: MyStore) => {
    localStorage.setItem("current_store_id", store.storeId);
    localStorage.setItem("has_active_store", "true");
    localStorage.setItem("is_provider", "true");
    setCurrentStoreId(store.storeId);

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("auth-change"));

    const isOwner =
      store.role?.toUpperCase() === "OWNER" ||
      store.role?.toLowerCase() === "proprietario" ||
      store.role?.toLowerCase() === "owner";

    if (isOwner) {
      router.push(`/store/store-profile?storeId=${encodeURIComponent(store.storeId)}`);
    } else {
      router.push(`/employee-store/${encodeURIComponent(store.storeId)}`);
    }
  };

  const handleStoreJoined = () => {
    void loadStores();
  };

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-4xl flex-col space-y-7 px-4 pt-8 pb-8 sm:px-6 sm:py-8 lg:px-8">
        
        {/* Header da Página */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              Minhas Lojas
            </h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Acesse as lojas em que você é proprietário ou funcionário.
            </p>
          </div>

          {/* Botão Criar Loja */}
          <Link href="/provider/create-store">
            <Button className="gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold shadow-xs cursor-pointer">
              <Plus className="size-4" />
              <span>Criar Nova Loja</span>
            </Button>
          </Link>
        </div>

        {/* Card para Entrar como Funcionário via Link */}
        <JoinStoreCard onStoreJoined={handleStoreJoined} />

        {/* Seção de Lojas Cadastradas */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Lojas Vinculadas
              </h2>
            </div>
            {!isLoading && (
              <span className="text-xs text-muted-foreground">
                {stores.length} {stores.length === 1 ? "loja" : "lojas"}
              </span>
            )}
          </div>

          {/* Alerta de erro com botão de retry */}
          {errorMessage && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-medium text-destructive">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void loadStores()}
                className="gap-1.5 rounded-xl border-destructive/30 hover:bg-destructive/10 text-xs shrink-0 cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                <span>Tentar novamente</span>
              </Button>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-muted" />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-5 w-40 rounded-lg bg-muted" />
                      <div className="h-3 w-28 rounded-lg bg-muted" />
                    </div>
                  </div>
                  <div className="h-9 w-full rounded-xl bg-muted/60 mt-2" />
                </div>
              ))}
            </div>
          )}

          {/* Lista de cards */}
          {!isLoading && stores.length === 0 && !errorMessage ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
                <Store className="size-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Nenhuma loja encontrada
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mb-4">
                Você ainda não possui lojas vinculadas à sua conta. Crie sua própria loja para começar ou entre em uma com um link de convite.
              </p>
              <Link href="/provider/create-store">
                <Button className="gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold shadow-xs cursor-pointer">
                  <Plus className="size-4" />
                  <span>Criar Minha Primeira Loja</span>
                </Button>
              </Link>
            </div>
          ) : (
            !isLoading && (
              <div className="flex flex-col gap-4">
                {stores.map((store) => (
                  <StoreCardItem
                    key={store.storeId}
                    store={store}
                    isCurrent={store.storeId === currentStoreId}
                    onSelectStore={handleSelectStore}
                  />
                ))}
              </div>
            )
          )}
        </div>

      </main>
    </div>
  );
}
