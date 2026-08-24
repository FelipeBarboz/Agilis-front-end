"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, CalendarClock, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { type Service } from "@/lib/mocks/services";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={`/services/${service.id}?storeId=${service.storeId}`}
        className="group block focus-visible:outline-none h-full"
      >
        <Card className="overflow-hidden h-full flex flex-col justify-between transition-all group-hover:shadow-md group-hover:border-primary/40 group-focus-visible:ring-2 group-focus-visible:ring-primary">
          <div>
            {/* Imagem */}
            <div className="relative h-44 w-full bg-muted">
              {service.images[0] && (
                <Image
                  src={service.images[0].url}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <button
                type="button"
                aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                onClick={(e) => {
                  e.preventDefault();
                  setLiked((prev) => !prev);
                }}
                className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white shadow-2xs"
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
                  {service.rating} ({service.reviewCount})
                </div>
              </div>

              {/* Prestador / Empresa e Localização (Cidade e Estado) */}
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {service.company[0]}
                  </span>
                  <span className="truncate">{service.company}</span>
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
                  R$ {service.price.inicial}
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