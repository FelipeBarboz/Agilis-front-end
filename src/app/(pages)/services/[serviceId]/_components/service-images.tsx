"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

interface ServiceImagesProps {
  images: { id: string; serviceId: string; url: string }[];
  title: string;
}

export function ServiceImages({ images, title }: ServiceImagesProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-72 sm:h-80 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card text-muted-foreground text-sm">
        <ImageIcon className="size-8 text-muted-foreground/40 mb-2" />
        <span>Nenhuma imagem disponível</span>
      </div>
    );
  }

  function prev() {
    setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function next() {
    setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Imagem principal com display horizontal amplo */}
      <div className="relative h-64 sm:h-80 md:h-[360px] w-full overflow-hidden rounded-2xl bg-muted/60 border border-border/80 shadow-xs">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Image
              src={images[current]!.url}
              alt={`${title} — imagem ${current + 1}`}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradiente inferior sutil */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

        {/* Contador de fotos */}
        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
          {current + 1} / {images.length}
        </div>

        {/* Navegação — só aparece se tiver mais de 1 imagem */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ver foto ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === current ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails horizontais */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setCurrent(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                i === current
                  ? "border-primary shadow-xs ring-1 ring-primary/40 scale-102"
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-border"
              }`}
            >
              <Image
                src={img.url}
                alt={`Miniatura ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}