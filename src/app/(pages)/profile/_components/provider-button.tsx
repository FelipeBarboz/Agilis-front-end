"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  CalendarDays,
  Store,
} from "lucide-react";

/**
 * Seção de Ações do Provedor exibida no perfil.
 * - Só é exibida se o CNPJ estiver cadastrado no localStorage (is_provider === "true" ou provider_cnpj).
 * - Quando não tem loja criada: exibe o botão "Criar Loja".
 * - Quando a loja é criada (has_active_store === "true"): o botão vira "Sua Loja" (leva para /store)
 *   e os botões de "Chat" e "Agenda" aparecem ao lado.
 */
export function ProviderButton() {
  const [mounted, setMounted] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [hasActiveStore, setHasActiveStore] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkState = () => {
      const storedCnpj = localStorage.getItem("provider_cnpj");
      const providerFlag = localStorage.getItem("is_provider");
      const storeFlag = localStorage.getItem("has_active_store");

      setIsProvider(Boolean(storedCnpj || providerFlag === "true"));
      setHasActiveStore(storeFlag === "true");
    };

    checkState();

    // Ouve alterações no storage caso o usuário mude em outra aba/ação
    window.addEventListener("storage", checkState);
    return () => {
      window.removeEventListener("storage", checkState);
    };
  }, []);

  if (!mounted || !isProvider) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground px-1 mb-2">
          Área do Prestador
        </h2>

        {hasActiveStore ? (
          // Loja já criada: 3 botões (Chat, Agenda, Sua Loja)
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
              href="/create-store"
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

