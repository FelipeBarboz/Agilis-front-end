"use client";

import Link from "next/link";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { type Store } from "@/lib/mocks/stores";
import { Card } from "@/components/ui/card";

interface StoreCardProps {
  store: Store;
  index: number;
}

export function StoreCard({ store, index }: StoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={`/store-page?id=${store.id}`}
        className="group block focus-visible:outline-none h-full"
      >
        <Card className="flex flex-col justify-between h-full p-5 overflow-hidden transition-all group-hover:shadow-md group-hover:border-primary/40 group-focus-visible:ring-2 group-focus-visible:ring-primary">
          <div className="flex flex-col gap-3">
            {/* Topo do Card da Loja */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#094229] text-white font-extrabold text-lg shadow-xs">
                  {store.initials || "SP"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {store.name}
                  </h3>
                  <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {store.category}
                  </span>
                </div>
              </div>

              {/* Status de Disponibilidade */}
              {store.isAvailable ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Disponível
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Indisponível
                </span>
              )}
            </div>

            {/* Descrição curta */}
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {store.about?.description || "Loja e prestadora de serviços cadastrada na plataforma."}
            </p>
          </div>

          {/* Rodapé do Card */}
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                {store.rating.toFixed(1)}
                <span className="text-xs text-muted-foreground font-normal">
                  ({store.reviewCount})
                </span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-primary" />
                {store.about?.address?.city || store.distance}
              </span>
            </div>

            <div className="flex items-center gap-1 font-semibold text-primary text-xs group-hover:translate-x-0.5 transition-transform">
              <span>Ver perfil</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
