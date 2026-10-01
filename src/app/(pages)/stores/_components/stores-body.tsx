"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Store, Building2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  mockUserStoreAssociations,
  getEmployeeStoresFromStorage,
  saveEmployeeStoresToStorage,
  type UserStoreAssociation,
} from "@/lib/mocks/invites";
import { JoinStoreCard } from "./join-store-card";
import { StoreCardItem } from "./store-card-item";

export function StoresBody() {
  const router = useRouter();
  const [associations, setAssociations] = useState<UserStoreAssociation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Carrega do storage ou do mock inicial
    const stored = getEmployeeStoresFromStorage();
    if (stored && stored.length > 0) {
      setAssociations(stored);
    } else {
      setAssociations(mockUserStoreAssociations);
      saveEmployeeStoresToStorage(mockUserStoreAssociations);
    }
    setIsLoaded(true);
  }, []);

  const handleStoreJoined = (newAssoc: UserStoreAssociation) => {
    setAssociations((prev) => {
      // Remove somente vínculo duplicado de funcionário na mesma loja, preservando sempre a loja proprietária
      const filtered = prev.filter(
        (a) => a.id !== newAssoc.id && !(a.role === "employee" && a.storeId === newAssoc.storeId)
      );
      const updated = [newAssoc, ...filtered];
      saveEmployeeStoresToStorage(updated);
      return updated;
    });
  };

  const handleApprovePending = (assocId: string) => {
    setAssociations((prev) => {
      const updated = prev.map((a) =>
        a.id === assocId ? { ...a, status: "active" as const } : a
      );
      saveEmployeeStoresToStorage(updated);
      return updated;
    });
  };

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      
      {/* Botão de voltar flutuante */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-4xl flex-col space-y-7 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        
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
          <Link href="/register/provider">
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
            <span className="text-xs text-muted-foreground">
              {associations.length} {associations.length === 1 ? "loja" : "lojas"}
            </span>
          </div>

          {/* Lista de cards */}
          {isLoaded && associations.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
                <Store className="size-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Nenhuma loja encontrada
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Você ainda não está cadastrado em nenhuma loja. Você pode criar sua própria loja ou entrar em uma utilizando um link de convite.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {associations.map((assoc) => (
                <StoreCardItem
                  key={assoc.id}
                  association={assoc}
                  onApprovePending={handleApprovePending}
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
