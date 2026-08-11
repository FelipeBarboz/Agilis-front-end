"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <div className="flex gap-3 rounded-xl bg-background p-3 shadow-sm">
      <Link
        href={`/services/${service.id}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg"
      >
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/services/${service.id}`}>
              <h3 className="text-sm font-semibold leading-tight text-foreground">
                {service.name}
              </h3>
            </Link>
            <button
              type="button"
              onClick={() => onToggleFavorite(service.id)}
              aria-label="Remover dos favoritos"
              className="shrink-0"
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  service.isFavorite
                    ? "fill-destructive text-destructive"
                    : "text-muted-foreground",
                )}
              />
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>
              {service.rating.toFixed(1)} ({service.reviewsCount})
            </span>
            <span>· {service.servicesCount} serviços</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full">
              <Image
                src={service.providerAvatarUrl}
                alt={service.providerName}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {service.providerName}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between pt-2">
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            <Calendar className="h-3.5 w-3.5" />
            {service.availabilityLabel}
          </span>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-muted-foreground">
              A partir de
            </span>
            <span className="text-base font-bold text-foreground">
              {formatCurrency(service.startingPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}