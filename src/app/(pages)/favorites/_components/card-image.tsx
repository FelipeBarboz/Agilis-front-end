"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

interface CardImageProps {
  imageUrl?: string;
  name: string;
  onToggleFavorite: () => void | Promise<void>;
}

export function CardImage({ imageUrl, name, onToggleFavorite }: CardImageProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(imageUrl && imageUrl.trim() !== "" && !imgError);

  return (
    <div className="relative h-48 w-full overflow-hidden bg-muted">
      {showImage ? (
        <Image
          src={imageUrl!}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImgError(true)}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-bold text-primary">
          {name.charAt(0).toUpperCase()}
        </div>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite();
        }}
        aria-label="Remover dos favoritos"
        className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-xs backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
      >
        <Heart className="h-4 w-4 fill-destructive text-destructive" />
      </button>
    </div>
  );
}
