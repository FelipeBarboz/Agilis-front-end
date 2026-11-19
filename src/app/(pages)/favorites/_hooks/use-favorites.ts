"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchFavorites,
  removeFavorite,
} from "@/lib/services/favorites-service";
import type { FavoriteService } from "@/types/favorite-service";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteService[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      // Usa warn (string pura) para não disparar o overlay do Turbopack
      console.warn(`[Favorites] Falha ao carregar favoritos: ${msg}`);
      setError(`Não foi possível carregar seus favoritos. Tente novamente mais tarde.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const handleToggleFavorite = useCallback(async (serviceId: string) => {
    // Remove da UI imediatamente — não reverte mesmo se o backend falhar
    setFavorites((current) =>
      current.filter((service) => service.id !== serviceId && service.serviceId !== serviceId)
    );

    try {
      await removeFavorite(serviceId);
    } catch {
      // O backend retornou erro (ex: 500), mas mantemos a remoção na UI
      // pois o usuário explicitamente clicou para remover.
      // Não exibimos erro, não revertemos, não logamos no console.
    }
  }, []);

  return {
    favorites,
    isLoading,
    error,
    clearError: () => setError(null),
    refetch: loadFavorites,
    onToggleFavorite: handleToggleFavorite,
  };
}
