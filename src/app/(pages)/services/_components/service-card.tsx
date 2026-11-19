"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, CalendarClock, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { type Service } from "@/lib/mocks/services";
import { Card } from "@/components/ui/card";
import { getFallbackImagesForCategory } from "@/lib/services/services-service";
import {
  addFavorite,
  removeFavorite,
  isServiceFavorite,
  FAVORITES_CHANGED,
} from "@/lib/services/favorites-service";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const [liked, setLiked] = useState(() => isServiceFavorite(service.id));

  // Sincroniza quando outro card ou a página de favoritos alterar o cache
  useEffect(() => {
    function onFavoritesChanged() {
      setLiked(isServiceFavorite(service.id));
    }
    window.addEventListener(FAVORITES_CHANGED, onFavoritesChanged);
    return () => window.removeEventListener(FAVORITES_CHANGED, onFavoritesChanged);
  }, [service.id]);
  const fallbackUrl =
    getFallbackImagesForCategory(service.category, service.id)[0]?.url ??
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800";
  const [imgUrl, setImgUrl] = useState(
    service.images[0]?.url && service.images[0].url.trim().length > 0
      ? service.images[0].url
      : fallbackUrl
  );

  const companyName = service.company || "Prestador Agilis";
  const initial = companyName[0] ? companyName[0].toUpperCase() : "A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="h-full"
    >
      <Link
        href={`/services/${service.id}?storeId=${service.storeId}${companyName ? `&company=${encodeURIComponent(companyName)}` : ""}`}
        className="group block focus-visible:outline-none h-full"
      >
        <Card className="overflow-hidden h-full flex flex-col justify-between transition-all group-hover:shadow-md group-hover:border-primary/40 group-focus-visible:ring-2 group-focus-visible:ring-primary">
          <div>
            {/* Imagem */}
            <div className="relative h-44 w-full bg-muted">
              {imgUrl && (
                <Image
                  src={imgUrl}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onError={() => setImgUrl(fallbackUrl)}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <button
                type="button"
                aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const wasLiked = liked;
                  setLiked(!wasLiked);
                  try {
                    if (wasLiked) {
                      await removeFavorite(service.id);
                    } else {
                      await addFavorite(service.id);
                    }
                  } catch {
                    // Reverte apenas se não conseguiu confirmar no servidor
                    setLiked(wasLiked);
                  }
                }}
                className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white shadow-2xs cursor-pointer"
              >
                <Heart
                  size={14}
                  className={liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}
                />
              </button>
            </div>

            <div className="flex flex-col gap-2 p-3.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground font-medium">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {typeof service.rating === "number" ? service.rating.toFixed(1) : "5.0"} ({service.reviewCount})
                </div>
              </div>

              {/* Prestador / Empresa e Localização (Cidade e Estado) */}
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {initial}
                  </span>
                  <span className="truncate">{companyName}</span>
                </div>

                {service.city && (
                  <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
                    <MapPin size={11} className="text-primary shrink-0" />
                    <span>
                      {service.city}, {service.state}
                    </span>
                  </div>
                )}
              </div>

              {/* Preço */}
              <div className="pt-1">
                <p className="text-[11px] text-muted-foreground">
                  {service.priceType === "FROM" ? "A partir de" : "Por"}
                </p>
                <p className="text-xl font-bold text-foreground">
                  R$ {service.price.inicial.toFixed(2).replace(".", ",")}
                </p>
              </div>

              {/* Disponibilidade */}
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <CalendarClock size={12} />
                {service.availability}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
