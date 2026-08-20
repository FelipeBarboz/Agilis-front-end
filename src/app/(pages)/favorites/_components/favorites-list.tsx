import { FavoriteServiceCard } from "./favorite-service-card";
import type { FavoriteService } from "./types";

interface FavoritesListProps {
  services: FavoriteService[];
  onToggleFavorite: (id: string) => void;
}

export function FavoritesList({ services, onToggleFavorite }: FavoritesListProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
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