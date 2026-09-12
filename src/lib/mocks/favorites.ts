import type { FavoriteService } from "@/types/favorite-service";

export const mockFavorites: FavoriteService[] = [
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