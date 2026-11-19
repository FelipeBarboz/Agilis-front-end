"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  StorePosition,
  CreateStorePositionPayload,
  UpdateStorePositionPayload,
} from "@/types/store-position";
import {
  getStorePosition,
  fetchStorePositions,
  createStorePosition as createPositionApi,
  updateStorePosition as updatePositionApi,
  deleteStorePosition as deletePositionApi,
  updateMemberPosition as updateMemberPositionApi,
} from "@/lib/services/store-positions-service";

interface UseStorePositionsOptions {
  storeId?: string;
  positionId?: string;
  autoFetch?: boolean;
}

export function useStorePositions(options: UseStorePositionsOptions = {}) {
  const { storeId, positionId, autoFetch = true } = options;

  const [positions, setPositions] = useState<StorePosition[]>([]);
  const [currentPosition, setCurrentPosition] = useState<StorePosition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPositions = useCallback(async () => {
    if (!storeId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStorePositions(storeId, positionId);
      setPositions(data);
      if (data[0]) {
        setCurrentPosition(data[0]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      console.warn(`[StorePositions] Falha ao carregar posições: ${msg}`);
      setError("Não foi possível carregar as posições da loja.");
    } finally {
      setIsLoading(false);
    }
  }, [storeId, positionId]);

  useEffect(() => {
    if (autoFetch && storeId) {
      void loadPositions();
    }
  }, [autoFetch, storeId, loadPositions]);

  const loadSinglePosition = useCallback(
    async (sId: string, pId: string): Promise<StorePosition | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const list = await getStorePosition(sId, pId);
        const pos = list[0] ?? null;
        setCurrentPosition(pos);
        return pos;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro desconhecido";
        console.warn(`[StorePositions] Falha ao carregar posição: ${msg}`);
        setError("Não foi possível carregar a posição solicitada.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createPosition = useCallback(
    async (payload: CreateStorePositionPayload): Promise<StorePosition> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await createPositionApi(payload);
        const item = Array.isArray(res) ? res[0] : res;
        if (!item) {
          throw new Error("Resposta inválida da criação da posição");
        }
        const created: StorePosition = item;
        setPositions((prev) => [created, ...prev]);
        setCurrentPosition(created);
        return created;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao criar posição";
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updatePosition = useCallback(
    async (
      sId: string,
      pId: string,
      payload: UpdateStorePositionPayload
    ): Promise<StorePosition> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await updatePositionApi(sId, pId, payload);
        const item = Array.isArray(res) ? res[0] : res;
        if (!item) {
          throw new Error("Resposta inválida da atualização da posição");
        }
        const updated: StorePosition = item;
        setPositions((prev) =>
          prev.map((p) => (p.id === pId ? updated : p))
        );
        setCurrentPosition(updated);
        return updated;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao atualizar posição";
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deletePosition = useCallback(
    async (sId: string, pId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      // Otimista
      setPositions((prev) => prev.filter((p) => p.id !== pId));
      if (currentPosition?.id === pId) {
        setCurrentPosition(null);
      }
      try {
        await deletePositionApi(sId, pId);
      } catch (err) {
        // Recarrega caso falhe
        void loadPositions();
        const msg = err instanceof Error ? err.message : "Erro ao excluir posição";
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentPosition, loadPositions]
  );

  const assignMember = useCallback(
    async (sId: string, memberId: string, pId: string): Promise<unknown> => {
      setIsLoading(true);
      setError(null);
      try {
        return await updateMemberPositionApi(sId, memberId, pId);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao atribuir cargo ao membro";
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    positions,
    currentPosition,
    isLoading,
    error,
    refetch: loadPositions,
    fetchPosition: loadSinglePosition,
    createPosition,
    updatePosition,
    deletePosition,
    assignMember,
  };
}
