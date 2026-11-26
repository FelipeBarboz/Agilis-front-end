"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Position, type PermissionId } from "@/lib/mocks/positions";
import { AddPositionModal } from "./add-position-modal";
import { EditPositionModal } from "./edit-position-modal";
import { DeletePositionModal } from "./delete-position-modal";
import { GenerateInviteModal } from "./generate-invite-modal";
import { PositionCard } from "./position-card";
import { PositionsEmptyState } from "./positions-empty-state";
import {
  createStorePosition,
  updateStorePosition,
  deleteStorePosition,
  fetchStorePositions,
} from "@/lib/services/store-positions-service";
import { getMyStores } from "@/lib/services/stores-service";
import type { StorePosition } from "@/types/store-position";

function permissionsToFlags(permissions: PermissionId[]) {
  const set = new Set(permissions);
  return {
    canManageBookings: set.has("manage_appointments"),
    canAccessChats: set.has("access_chats"),
    canViewReports: set.has("access_reports"),
    canManageStoreSettings: set.has("store_settings"),
  };
}

function flagsToPermissions(dto: StorePosition): PermissionId[] {
  const permissions: PermissionId[] = [];
  if (dto.canManageBookings) permissions.push("manage_appointments");
  if (dto.canAccessChats) permissions.push("access_chats");
  if (dto.canViewReports) permissions.push("access_reports");
  if (dto.canManageStoreSettings) permissions.push("store_settings");
  return permissions;
}

function mapDtoToPosition(dto: StorePosition): Position {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? "",
    employeeCount: dto.employeeCount ?? 0,
    permissions: flagsToPermissions(dto),
  };
}

export function PositionsList() {
  const [storeId, setStoreId] = useState<string>("");
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const loadPositions = useCallback(async (resolvedStoreId: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const list = await fetchStorePositions(resolvedStoreId);
      setPositions(list.map(mapDtoToPosition));
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os cargos da loja.";
      setErrorMessage(msg);
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      let resolvedStoreId = "";
      try {
        const stored =
          localStorage.getItem("current_store_id") ??
          localStorage.getItem("active_store_id");
        if (stored && !stored.startsWith("store-super")) {
          resolvedStoreId = stored;
        }
      } catch {}

      if (!resolvedStoreId) {
        try {
          const myStores = await getMyStores();
          if (myStores.length > 0 && myStores[0]?.storeId) {
            resolvedStoreId = myStores[0].storeId;
          }
        } catch {}
      }

      if (!isMounted) return;

      if (!resolvedStoreId) {
        setErrorMessage("Loja não encontrada. Crie ou selecione uma loja primeiro.");
        setIsLoading(false);
        return;
      }

      setStoreId(resolvedStoreId);
      await loadPositions(resolvedStoreId);
    }

    void init();
    return () => {
      isMounted = false;
    };
  }, [loadPositions]);

  const handleAddPosition = async (newPos: Omit<Position, "id" | "employeeCount">) => {
    if (!storeId) return;
    setErrorMessage(null);

    const flags = permissionsToFlags(newPos.permissions ?? []);
    try {
      const createdDto = await createStorePosition({
        storeId,
        title: newPos.title,
        description: newPos.description,
        ...flags,
      });
      setPositions((prev) => [...prev, mapDtoToPosition(createdDto)]);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível criar o cargo.";
      setErrorMessage(msg);
    }
  };

  const handleEditPosition = async (updated: Position) => {
    if (!storeId) return;
    setErrorMessage(null);

    const flags = permissionsToFlags(updated.permissions ?? []);
    try {
      const updatedDto = await updateStorePosition(storeId, updated.id, {
        title: updated.title,
        description: updated.description,
        ...flags,
      });
      setPositions((prev) =>
        prev.map((pos) => (pos.id === updated.id ? mapDtoToPosition(updatedDto) : pos))
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível atualizar o cargo.";
      setErrorMessage(msg);
    }
  };

  const handleDeletePosition = async (id: string) => {
    if (!storeId) return;
    setErrorMessage(null);

    try {
      await deleteStorePosition(storeId, id);
      setPositions((prev) => prev.filter((pos) => pos.id !== id));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível excluir o cargo.";
      setErrorMessage(msg);
    }
  };

  const openEdit = (pos: Position) => {
    setSelectedPosition(pos);
    setEditModalOpen(true);
  };

  const openDelete = (pos: Position) => {
    setSelectedPosition(pos);
    setDeleteModalOpen(true);
  };

  const openInvite = (pos: Position) => {
    setSelectedPosition(pos);
    setInviteModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Cargos da Loja</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Defina os cargos, atribuições e permissões da sua equipe.
          </p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="gap-2 rounded-xl bg-brand-dark text-white hover:bg-brand-dark-2 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Adicionar Cargo</span>
        </Button>
      </div>

      {/* Error feedback */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Positions List */}
      <div className="flex flex-col gap-3.5">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span>Carregando cargos...</span>
          </div>
        ) : positions.length === 0 ? (
          <PositionsEmptyState onAddPosition={() => setAddModalOpen(true)} />
        ) : (
          positions.map((pos) => (
            <PositionCard
              key={pos.id}
              position={pos}
              onEdit={openEdit}
              onDelete={openDelete}
              onInvite={openInvite}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <AddPositionModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAddPosition={handleAddPosition}
      />

      <EditPositionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        position={selectedPosition}
        onSave={handleEditPosition}
      />

      <DeletePositionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        position={selectedPosition}
        onConfirmDelete={handleDeletePosition}
      />

      <GenerateInviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        position={selectedPosition}
      />
    </div>
  );
}
