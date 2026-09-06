import { FavoriteServiceCard } from "./favorite-service-card";
import type { FavoriteService } from "./types";

interface FavoritesListProps {
  services: FavoriteService[];
  onToggleFavorite: (id: string) => void;
}

export function FavoritesList({ services, onToggleFavorite }: FavoritesListProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <FavoriteServiceCard
          key={service.id}
          service={service}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}