"use client";

import Link from "next/link";
import { Star, MapPin, ArrowLeft, ChevronRight, Info } from "lucide-react";
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
      className="overflow-hidden rounded-2xl bg-card shadow-xs ring-1 ring-foreground/10"
    >
      {/* Topo com Fundo Verde Sólido (Sem imagem de banner) */}
      <div className="relative h-28 sm:h-36 w-full bg-[#0D5C3A] flex items-start p-4">
        {/* Botão de navegação voltar */}
        <Link
          href="/services"
          aria-label="Voltar para serviços"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={18} />
        </Link>
      </div>

      {/* Conteúdo do Perfil da Loja */}
      <div className="px-6 pb-6 pt-0">
        {/* Linha do Ícone e Nome da Loja */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14 mb-5">
          {/* Ícone / Avatar da Loja Existente e Sólido */}
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full bg-[#094229] text-white shadow-md ring-4 ring-card font-extrabold text-2xl sm:text-3xl tracking-wider select-none">
            {store.initials || "SP"}
          </div>

          <div className="flex-1 pb-1">
            <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary mb-1">
              {store.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {store.name}
            </h1>
          </div>
        </div>

        {/* Linha das Informações da Loja com maior distância entre si e botão Sobre no canto */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/60 pt-4">
          {/* Métricas: Distância, Avaliação e Disponibilidade com espaçamento amplo */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-sm">
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

          {/* Botão Sobre alinhado na mesma linha no cantinho */}
          <div className="flex items-center justify-end">
            <Link
              href={`/store-page/about?id=${store.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-muted hover:bg-primary/10 text-foreground hover:text-primary border border-border px-3.5 py-1.5 text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-2xs"
            >
              <Info size={15} className="text-primary" />
              <span>Sobre</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
