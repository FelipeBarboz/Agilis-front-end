"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchFavorites,
  removeFavorite,
  FAVORITES_CHANGED,
} from "@/lib/services/favorites-service";
import type { FavoriteService } from "@/types/favorite-service";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteService[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mantém referência da lista atual para rollback em caso de falha no DELETE
  const favoritesRef = useRef<FavoriteService[]>([]);
  favoritesRef.current = favorites;

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      console.warn(`[Favorites] Aviso ao carregar favoritos da API: ${msg}`);
      setError(`Não foi possível carregar seus favoritos (${msg}). Tente novamente mais tarde.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const handleToggleFavorite = useCallback(
    async (serviceId: string) => {
      const idToRemove = serviceId.trim();
      if (!idToRemove) return;

      const previousFavorites = favoritesRef.current;
      setError(null);

      // Remoção otimista da UI
      setFavorites((current) =>
        current.filter(
          (service) =>
            service.id !== idToRemove &&
            (service.serviceId ? service.serviceId !== idToRemove : true)
        )
      );

      try {
        // Envia requisição HTTP DELETE /api/v1/favorites/{serviceId}
        await removeFavorite(idToRemove);
      } catch (err) {
        // Se a requisição DELETE falhar, restaura o estado anterior e notifica o usuário
        setFavorites(previousFavorites);
        const msg = err instanceof Error ? err.message : "Erro ao remover favorito";
        console.error(`[Favorites] Erro ao desfavoritar serviço ${idToRemove}:`, err);
        setError(`Não foi possível remover o serviço dos favoritos (${msg}).`);
      }
    },
    []
  );

  return {
    favorites,
    isLoading,
    error,
    clearError: () => setError(null),
    refetch: loadFavorites,
    onToggleFavorite: handleToggleFavorite,
  };
}
