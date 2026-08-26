"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ChevronRight, CalendarClock, Heart } from "lucide-react";
import { mockServices } from "@/lib/mocks/services";
import { superPinturasServices } from "@/lib/mocks/stores";
import { useState } from "react";

interface ServiceRelatedProps {
  currentServiceId: string;
  category: string;
}

export function ServiceRelated({ currentServiceId, category }: ServiceRelatedProps) {
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  function toggleLike(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // Combina todos os serviços para buscar recomendações relevantes
  const allServices = [...mockServices, ...superPinturasServices];
  
  // Remove duplicados de ID caso existam
  const uniqueServices = Array.from(
    new Map(allServices.map((s) => [s.id, s])).values()
  );

  // Pega serviços da mesma categoria primeiro, depois outros como recomendação
  const relatedServices = uniqueServices
    .filter((s) => s.id !== currentServiceId)
    .sort((a, b) => {
      if (a.category === category && b.category !== category) return -1;
      if (b.category === category && a.category !== category) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 4);

  if (relatedServices.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:p-8 shadow-xs ring-1 ring-foreground/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Serviços recomendados e próximos
          </h2>
          <p className="text-xs text-muted-foreground">
            Outras opções populares e bem avaliadas na sua região
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group self-start sm:self-auto"
        >
          <span>Ver todos os serviços</span>
          <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid Horizontal de Serviços Recomendados no PADRÃO AGILIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {relatedServices.map((svc) => {
          const imgUrl = svc.images[0]?.url ?? "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800";
          const isLiked = likedIds[svc.id] ?? false;

          return (
            <Link
              key={svc.id}
              href={`/services/${svc.id}?storeId=${svc.storeId}`}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-muted/20 transition-all hover:bg-muted/40 hover:border-primary/50 hover:shadow-sm"
            >
              <div>
                {/* Imagem do Serviço */}
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={imgUrl}
                    alt={svc.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span>{svc.rating.toFixed(1)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleLike(svc.id, e)}
                    aria-label={isLiked ? "Remover dos favoritos" : "Salvar nos favoritos"}
                    className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <Heart
                      size={13}
                      className={isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}
                    />
                  </button>
                </div>

                {/* Conteúdo */}
                <div className="flex flex-col gap-2 p-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {svc.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {svc.title}
                  </h3>

                  <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                        {svc.company[0]}
                      </span>
                      <span className="truncate text-xs">{svc.company}</span>
                    </div>

                    {svc.city && (
                      <div className="flex items-center gap-1 shrink-0 text-muted-foreground text-[11px]">
                        <MapPin size={11} className="text-primary shrink-0" />
                        <span>{svc.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rodapé do Card com Preço e Disponibilidade */}
              <div className="flex items-center justify-between border-t border-border/60 p-3.5 text-xs bg-muted/10">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-medium">A partir de</span>
                  <span className="font-extrabold text-foreground text-sm">
                    R$ {svc.price.inicial.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-primary font-medium">
                  <CalendarClock size={12} />
                  <span>{svc.durationMinutes}min</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

