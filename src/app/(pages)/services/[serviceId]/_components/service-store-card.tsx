"use client";

import Link from "next/link";
import { Store as StoreIcon, MapPin, Star, ChevronRight, ShieldCheck } from "lucide-react";
import { getStoreById, mockStores } from "@/lib/mocks/stores";

interface ServiceStoreCardProps {
  storeId?: string;
  companyName?: string;
}

export function ServiceStoreCard({ storeId, companyName }: ServiceStoreCardProps) {
  // Procura a loja pelo storeId ou pelo nome da empresa
  const store =
    (storeId ? mockStores.find((s) => s.id === storeId || s.slug === storeId) : null) ??
    (companyName ? mockStores.find((s) => s.name.toLowerCase() === companyName.toLowerCase()) : null) ??
    getStoreById("store-super-pinturas");

  const displayName = companyName || store.name;
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4 rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Oferecido por</h2>
        <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <ShieldCheck className="size-3.5" />
          Prestador Verificado
        </span>
      </div>

      <Link
        href={`/store-page?id=${store.id}`}
        className="flex items-center gap-4 rounded-2xl border p-4 transition-all hover:bg-muted/40 hover:border-primary/40 group"
      >
        {/* Avatar da Loja */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-dark text-white text-xl font-bold shadow-xs group-hover:scale-105 transition-transform">
          {initials}
        </div>

        {/* Informações da Loja */}
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-base truncate group-hover:text-primary transition-colors">
              {displayName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{store.rating}</span>
              <span>({store.reviewCount} avaliações)</span>
            </div>

            <span>•</span>

            <div className="flex items-center gap-1">
              <MapPin className="size-3.5 text-primary" />
              <span>{store.distance || "Guarulhos e Região"}</span>
            </div>
          </div>
        </div>

        {/* Botão Ver Loja */}
        <div className="flex items-center gap-1 text-xs font-semibold text-primary shrink-0">
          <span className="hidden sm:inline">Ver loja</span>
          <ChevronRight className="size-5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>
    </div>
  );
}
