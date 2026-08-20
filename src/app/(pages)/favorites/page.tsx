"use client";

import { useState } from "react";
import { SectionHeader } from "./_components/section-header";
import { EmptyFavorites } from "./_components/empty-favorites";
import { FavoritesList } from "./_components/favorites-list";
import { PageTransition } from "@/components/ui/motion";
import type { FavoriteService } from "./_components/types";
// import { api } from "@/trpc/react"; // TODO: trocar pelos dados reais

// TODO: substituir por await api.favorites.listByUser()
const mockFavorites: FavoriteService[] = [
  {
    id: "1",
    name: "Limpeza de Piscina Residencial",
    imageUrl: "/images/services/piscina.jpg",
    rating: 4.0,
    reviewsCount: 128,
    servicesCount: 312,
    providerName: "Carlão Piscinas",
    providerAvatarUrl: "/images/providers/carlao-piscinas.png",
    availabilityLabel: "Amanhã, 09:00 disponível",
    startingPrice: 250,
    isFavorite: true,
  },
  {
    id: "2",
    name: "Pintura de Quarto - Tinta Acrílica",
    imageUrl: "/images/services/quarto.jpg",
    rating: 4.0,
    reviewsCount: 101,
    servicesCount: 189,
    providerName: "Neo Pinturas",
    providerAvatarUrl: "/images/providers/neo-pinturas.png",
    availabilityLabel: "Hoje, 17:00 disponível",
    startingPrice: 150,
    isFavorite: true,
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites);

  // const removeFavorite = api.favorites.remove.useMutation();

  function handleToggleFavorite(id: string) {
    setFavorites((current) => current.filter((service) => service.id !== id));
    // removeFavorite.mutate({ serviceId: id });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SectionHeader />

      <main className="flex flex-1 flex-col overflow-y-auto bg-muted">
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
      </main>
    </div>
  );
}