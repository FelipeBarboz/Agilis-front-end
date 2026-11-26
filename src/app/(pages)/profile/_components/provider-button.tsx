"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  CalendarDays,
  Store,
} from "lucide-react";
import { getMyStores } from "@/lib/services/stores-service";

export function ProviderButton() {
  const [mounted, setMounted] = useState(false);
  const [hasActiveStore, setHasActiveStore] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setMounted(true);

    async function checkState() {
      try {
        const myStores = await getMyStores();
        if (isCancelled) return;
        const hasStore = Array.isArray(myStores) && myStores.length > 0;
        setHasActiveStore(hasStore);
        if (hasStore && myStores[0]?.storeId) {
          try {
            localStorage.setItem("current_store_id", myStores[0].storeId);
            localStorage.setItem("has_active_store", "true");
            localStorage.setItem("is_provider", "true");
          } catch {}
        }
      } catch {
        if (!isCancelled) {
          setHasActiveStore(false);
        }
      }
    }

    void checkState();
    return () => {
      isCancelled = true;
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground px-1 mb-2">
          Área do Prestador
        </h2>

        {hasActiveStore ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <Link
              href="/provider/chat-corporative"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted/50 hover:border-primary/40 group"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <MessageSquare className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Chat</span>
                <span className="text-xs text-muted-foreground">Fale com clientes</span>
              </div>
            </Link>

            <Link
              href="/provider/scheduling-provider"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted/50 hover:border-primary/40 group"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <CalendarDays className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Agenda</span>
                <span className="text-xs text-muted-foreground">Seus horários</span>
              </div>
            </Link>

            <Link
              href="/store"
              className="flex items-center gap-3 rounded-2xl border border-primary/40 bg-card p-4 shadow-sm transition-all hover:bg-muted/50 hover:border-primary group"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
                <Store className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-primary">Sua Loja</span>
                <span className="text-xs text-muted-foreground">Painel e perfil da loja</span>
              </div>
            </Link>
          </div>
        ) : (
          // CNPJ cadastrado, mas loja ainda não criada: apenas o botão "Criar Loja"
          <div className="grid grid-cols-1">
            <Link
              href="/provider/create-store"
              className="flex items-center gap-3 rounded-2xl border border-primary/40 bg-card p-4 shadow-sm transition-all hover:bg-muted/50 hover:border-primary group sm:p-5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
                <Store className="size-5" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-bold text-primary">Criar Loja</span>
                <span className="text-xs text-muted-foreground">Configure seu CNPJ, URL, serviços e área de atendimento</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

