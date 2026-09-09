"use client";

import Link from "next/link";
import { Building2, ChevronRight, Plus } from "lucide-react";

/**
 * Mostra um campo/botão "Adicionar CNPJ" no perfil.
 * Ao clicar, redireciona para /register/provider onde o usuário informará o CNPJ
 * e um pop-up de confirmação vai registrá-lo como provedor.
 */
export function CnpjProviderCard() {
  return (
    <Link
      href="/register/provider"
      id="btn-add-cnpj"
      className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-primary group sm:p-5"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
        <Building2 className="size-5" />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="text-sm font-bold text-foreground">CNPJ</span>
        <span className="text-xs text-muted-foreground">Torne-se um prestador de serviços</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors group-hover:bg-primary/20">
        <Plus className="size-3.5" />
        Adicionar
      </div>
      <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
