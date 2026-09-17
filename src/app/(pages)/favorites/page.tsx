"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SectionHeader } from "./_components/section-header";
import { EmptyFavorites } from "./_components/empty-favorites";
import { FavoritesList } from "./_components/favorites-list";
import { PageTransition } from "@/components/ui/motion";
import { mockFavorites } from "@/lib/mocks/favorites";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(mockFavorites);

  function handleToggleFavorite(id: string) {
    setFavorites((current) => current.filter((service) => service.id !== id));
  }

  return (
    <main className="relative flex flex-1 flex-col bg-muted p-4 pt-14 sm:p-6 sm:pt-14 lg:p-8 lg:pt-8">
      {/* Seta de voltar*/}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mx-auto w-full max-w-6xl space-y-6">
        <SectionHeader count={favorites.length} />

        <PageTransition className="flex flex-1 flex-col">
          {favorites.length === 0 ? (
            <EmptyFavorites />
          ) : (
            <FavoritesList
              services={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </PageTransition>
      </div>
    </main>
  );
}
