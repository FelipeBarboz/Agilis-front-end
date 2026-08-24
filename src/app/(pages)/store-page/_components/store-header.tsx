"use client";

import Link from "next/link";
import { Star, MapPin, ArrowLeft, Info } from "lucide-react";
import { type Store } from "@/lib/mocks/stores";
import { motion } from "motion/react";

interface StoreHeaderProps {
  store: Store;
}

export function StoreHeader({ store }: StoreHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-card p-6 sm:p-8 shadow-xs ring-1 ring-foreground/10"
    >
      {/* Botão de navegação voltar */}
      <div className="absolute left-4 top-4 sm:left-6 sm:top-6 z-10">
        <Link
          href="/services"
          aria-label="Voltar para serviços"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/80 hover:bg-muted text-foreground ring-1 ring-border shadow-2xs transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={18} />
        </Link>
      </div>

      {/* Topo Centralizado: Avatar e Nome da Loja */}
      <div className="flex flex-col items-center text-center pt-2 sm:pt-0">
        {/* Ícone / Avatar da Loja */}
        <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full bg-[#094229] text-white shadow-md font-extrabold text-2xl sm:text-3xl tracking-wider select-none mb-3.5">
          {store.initials || "SP"}
        </div>

        {/* Nome da Loja */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {store.name}
        </h1>
      </div>

      {/* Linha das Informações da Loja e botão Sobre */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/60 pt-4">
        {/* Métricas: Distância, Avaliação e Disponibilidade */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8 text-sm">
          {/* Distância */}
          <div className="flex items-center gap-2 font-medium text-foreground">
            <MapPin size={17} className="text-primary shrink-0" />
            <span>{store.distance}</span>
            <span className="text-xs text-muted-foreground font-normal hidden md:inline">
              da sua casa
            </span>
          </div>

          {/* Avaliação Média */}
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Star size={17} className="fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-semibold">{store.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground font-normal">
              ({store.reviewCount})
            </span>
          </div>

          {/* Disponibilidade */}
          <div className="flex items-center gap-2">
            {store.isAvailable ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Disponível
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Indisponível
              </span>
            )}
          </div>
        </div>

        {/* Botão Sobre */}
        <div className="flex items-center justify-center sm:justify-end">
          <Link
            href={`/store-page/about?id=${store.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-muted hover:bg-primary/10 text-foreground hover:text-primary border border-border px-3.5 py-1.5 text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-2xs"
          >
            <Info size={15} className="text-primary" />
            <span>Sobre</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
