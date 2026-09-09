"use client";

import Link from "next/link";
import { MapPin, Star, ChevronRight, ShieldCheck, Store as StoreIcon } from "lucide-react";
import { getStoreById, mockStores } from "@/lib/mocks/stores";

interface ServiceStoreCardProps {
  storeId?: string;
  companyName?: string;
}

export function ServiceStoreCard({ storeId, companyName }: ServiceStoreCardProps) {
  // Procura a loja pelo storeId ou pelo nome da empresa
  const store =
    (storeId ? (mockStores.find((s) => s.id === storeId || s.slug === storeId) ?? null) : null) ??
    (companyName ? (mockStores.find((s) => s.name.toLowerCase() === companyName.toLowerCase()) ?? null) : null) ??
    getStoreById(storeId ?? "store-super-pinturas");

  const displayName = companyName ?? store.name;
  const initials = store.initials || displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-xs ring-1 ring-foreground/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <StoreIcon size={16} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Oferecido por</h2>
            <p className="text-xs text-muted-foreground">Prestador credenciado</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="size-3.5" />
          Verificado
        </span>
      </div>

      <Link
        href={`/store-page?id=${store.id}`}
        className="flex items-center gap-4 rounded-xl border border-border/80 bg-muted/20 p-4 transition-all hover:bg-muted/50 hover:border-primary/40 group"
      >
        {/* Avatar da Loja com Padrão Agilis */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#094229] text-white text-lg font-extrabold shadow-sm tracking-wider select-none group-hover:scale-105 transition-transform">
          {initials}
        </div>

        {/* Informações da Loja */}
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-foreground text-sm sm:text-base truncate group-hover:text-primary transition-colors">
              {displayName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span className="font-semibold text-foreground">{store.rating.toFixed(1)}</span>
              <span>({store.reviewCount})</span>
            </div>

            <span>•</span>

            <div className="flex items-center gap-1">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span className="truncate">{store.distance || "3,2km da sua casa"}</span>
            </div>
          </div>
        </div>

        {/* Botão Ver Loja */}
        <div className="flex items-center gap-1 text-xs font-semibold text-primary shrink-0 pl-1">
          <span className="hidden sm:inline">Ver loja</span>
          <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>
    </div>
  );
}

