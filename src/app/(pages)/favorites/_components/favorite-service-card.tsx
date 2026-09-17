"use client";

import Link from "next/link";
import { Star, CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { FavoriteService } from "../../../../types/favorite-service";
import { CardImage } from "./card-image";
import { CardProvider } from "./card-provider";
import { CardFooter } from "./card-footer";

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
      <Card className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-md">
        <div>
          <CardImage
            imageUrl={service.imageUrl}
            name={service.name}
            onToggleFavorite={() => onToggleFavorite(service.id)}
          />

          {/* Conteúdo do Card */}
          <div className="flex flex-col gap-3 p-4">
            {/* Título e Avaliação */}
            <div className="flex items-start justify-between gap-2">
              <Link href={`/services/${service.id}`} className="hover:underline">
                <h3 className="line-clamp-1 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {service.name}
                </h3>
              </Link>
              <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{service.rating.toFixed(1)}</span>
                <span className="font-normal text-muted-foreground">
                  ({service.reviewsCount})
                </span>
              </div>
            </div>

            <CardProvider
              providerName={service.providerName}
              providerAvatarUrl={service.providerAvatarUrl}
              servicesCount={service.servicesCount}
            />

            {/* Disponibilidade */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <CalendarClock className="h-3.5 w-3.5 shrink-0" />
              <span>{service.availabilityLabel}</span>
            </div>
          </div>
        </div>

        <CardFooter serviceId={service.id} startingPrice={service.startingPrice} />
      </Card>
    </div>
  );
}
