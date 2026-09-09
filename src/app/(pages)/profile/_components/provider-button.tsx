"use client";

import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";

/**
 * Botão do Provedor exibido no perfil.
 * Simulado como mock: sempre mostra o botão de "Painel do Provedor".
 * Em produção, verificaria se o usuário já é provedor via API/cookie.
 */
export function ProviderButton() {
  return (
    <Link
      href="/provider"
      className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-primary/40 group sm:p-5"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
        <Building2 className="size-5" />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-bold text-foreground">Painel do Provedor</span>
        <span className="text-xs text-muted-foreground">Gerencie seus serviços e agendamentos</span>
      </div>
      <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
