"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SectionHeader } from "./_components/section-header";
import { EmptyFavorites } from "./_components/empty-favorites";
import { FavoritesList } from "./_components/favorites-list";
import { PageTransition } from "@/components/ui/motion";
import type { FavoriteService } from "./_components/types";

// TODO: substituir por await api.favorites.listByUser()
const mockFavorites: FavoriteService[] = [
  {
    id: "1",
    name: "Limpeza de Piscina Residencial",
    imageUrl: "",
    rating: 4.0,
    reviewsCount: 128,
    servicesCount: 312,
    providerName: "Carlão Piscinas",
    providerAvatarUrl: "",
    availabilityLabel: "Amanhã, 09:00 disponível",
    startingPrice: 250,
    isFavorite: true,
  },
  {
    id: "2",
    name: "Pintura de Quarto - Tinta Acrílica",
    imageUrl: "",
    rating: 4.0,
    reviewsCount: 101,
    servicesCount: 189,
    providerName: "Neo Pinturas",
    providerAvatarUrl: "",
    availabilityLabel: "Hoje, 17:00 disponível",
    startingPrice: 150,
    isFavorite: true,
  },
];

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(mockFavorites);

  function handleToggleFavorite(id: string) {
    setFavorites((current) => current.filter((service) => service.id !== id));
  }

  return (
    <main className="relative flex flex-1 flex-col overflow-y-auto bg-muted p-4 pt-14 sm:p-6 sm:pt-14 lg:p-8 lg:pt-8">
      {/* Seta de voltar no canto superior esquerdo — Padrão Agilis */}
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