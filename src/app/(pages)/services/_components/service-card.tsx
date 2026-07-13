"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, CalendarClock } from "lucide-react";
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
      <Link href={`/services/${service.id}`} className="group block focus-visible:outline-none">
        <Card className="overflow-hidden transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-primary">

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
              className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
            >
              <Heart
                size={14}
                className={liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}
              />
            </button>
          </div>

          <Card.Body className="flex flex-col gap-2 p-3">

            {/* Título + avaliação */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-snug text-foreground">
                {service.title}
              </h3>
              <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                {service.rating} ({service.reviewCount})
              </div>
            </div>

            {/* Empresa */}
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {service.company[0]}
              </span>
              <span className="text-xs text-muted-foreground">{service.company}</span>
            </div>

            {/* Preço */}
            <div>
              <p className="text-xs text-muted-foreground">
                {service.priceType === "FROM" ? "A partir de" : "Por"}
              </p>
              <p className="text-xl font-bold text-foreground">
                R$ {service.price}
              </p>
            </div>

            {/* Disponibilidade */}
            <div className="flex items-center gap-1.5 text-xs text-primary">
              <CalendarClock size={12} />
              {service.availability}
            </div>

          </Card.Body>
        </Card>
      </Link>
    </motion.div>
  );
}