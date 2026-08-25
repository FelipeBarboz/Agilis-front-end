"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Tag, Sparkles, MapPin, ChevronRight } from "lucide-react";
import { mockServices, type Service } from "@/lib/mocks/services";

interface ServiceRelatedProps {
  currentServiceId: string;
  category: string;
}

export function ServiceRelated({ currentServiceId, category }: ServiceRelatedProps) {
  // Pega serviços da mesma categoria primeiro, depois outros como recomendação
  const relatedServices = mockServices
    .filter((s) => s.id !== currentServiceId)
    .sort((a, b) => {
      if (a.category === category && b.category !== category) return -1;
      if (b.category === category && a.category !== category) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 4);

  if (relatedServices.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 rounded-3xl border bg-white p-5 shadow-sm sm:p-8 mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Serviços recomendados e próximos</h2>
            <p className="text-xs text-muted-foreground">Outras opções populares na sua região que você pode gostar</p>
          </div>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline group self-start sm:self-auto"
        >
          <span>Ver todos os serviços</span>
          <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid de Serviços Recomendados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedServices.map((svc) => {
          const imgUrl = svc.images[0]?.url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800";

          return (
            <Link
              key={svc.id}
              href={`/services/${svc.id}`}
              className="flex flex-col rounded-2xl border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-md group"
            >
              {/* Imagem do Serviço */}
              <div className="relative h-36 w-full overflow-hidden bg-muted">
                <Image
                  src={imgUrl}
                  alt={svc.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span>{svc.rating}</span>
                </div>
              </div>

              {/* Informações */}
              <div className="flex flex-1 flex-col justify-between p-4 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {svc.category}
                  </span>
                  <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {svc.title}
                  </h3>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {svc.company}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t pt-3 text-xs">
                  <div className="flex items-center gap-1 font-bold text-foreground">
                    <Tag className="size-3.5 text-primary" />
                    <span>A partir de R$ {svc.price.inicial}</span>
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{svc.durationMinutes}min</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
