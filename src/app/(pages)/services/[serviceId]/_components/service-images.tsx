"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceImagesProps {
  images: { id: string; serviceId: string; url: string }[];
  title: string;
}

export function ServiceImages({ images, title }: ServiceImagesProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-muted text-muted-foreground text-sm">
        Sem imagens
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
    <div className="flex flex-col gap-2">
      {/* Imagem principal */}
      <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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

        {/* Navegação — só aparece se tiver mais de 1 imagem */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ChevronRight size={16} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setCurrent(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === current ? "border-primary" : "border-transparent"
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