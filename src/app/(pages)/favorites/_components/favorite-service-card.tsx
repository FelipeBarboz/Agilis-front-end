"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, CalendarClock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FavoriteService } from "./types";

interface FavoriteServiceCardProps {
  service: FavoriteService;
  onToggleFavorite: (id: string) => void;
}

export function FavoriteServiceCard({
  service,
  onToggleFavorite,
}: FavoriteServiceCardProps) {
  return (
    <div className="group h-full">
      <Card className="overflow-hidden h-full flex flex-col justify-between rounded-2xl border border-border bg-card transition-all duration-200 group-hover:shadow-md group-hover:border-primary/40">
        <div>
          {/* Imagem com botão de favorito flutuante */}
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            {service.imageUrl && service.imageUrl.trim() !== "" ? (
              <Image
                src={service.imageUrl}
                alt={service.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-bold text-primary">
                {service.name.charAt(0)}
              </div>
            )}

            {/* Seta/Botão de Favorito no topo direito da imagem */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(service.id);
              }}
              aria-label="Remover dos favoritos"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 shadow-xs cursor-pointer"
            >
              <Heart
                className="h-4 w-4 fill-destructive text-destructive"
              />
            </button>
          </div>

          {/* Conteúdo do Card */}
          <div className="flex flex-col gap-3 p-4">
            {/* Título e Avaliação */}
            <div className="flex items-start justify-between gap-2">
              <Link href={`/services/${service.id}`} className="hover:underline">
                <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {service.name}
                </h3>
              </Link>
              <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{service.rating.toFixed(1)}</span>
                <span className="text-muted-foreground font-normal">
                  ({service.reviewsCount})
                </span>
              </div>
            </div>

            {/* Prestador */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {service.providerAvatarUrl && service.providerAvatarUrl.trim() !== "" ? (
                <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={service.providerAvatarUrl}
                    alt={service.providerName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {service.providerName.charAt(0)}
                </div>
              )}
              <span className="truncate font-medium text-foreground">
                {service.providerName}
              </span>
              <span className="text-muted-foreground">· {service.servicesCount} serviços</span>
            </div>

            {/* Disponibilidade */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <CalendarClock className="h-3.5 w-3.5 shrink-0" />
              <span>{service.availabilityLabel}</span>
            </div>
          </div>
        </div>

        {/* Rodapé: Preço e Botão de Agendar */}
        <div className="border-t border-border/60 p-4 pt-3 flex items-center justify-between gap-3 bg-muted/20">
          <div>
            <span className="text-[11px] text-muted-foreground block leading-none">
              A partir de
            </span>
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(service.startingPrice)}
            </span>
          </div>

          <Button asChild size="sm" className="rounded-xl font-medium text-xs gap-1.5 cursor-pointer">
            <Link href={`/services/${service.id}`}>
              Contratar
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}