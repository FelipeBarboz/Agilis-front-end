"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPositions, type Position } from "@/lib/mocks/positions";
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

export function PositionsList() {
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const getStoreId = () => {
    return (
      (typeof window !== "undefined" &&
        (localStorage.getItem("current_store_id") ||
          localStorage.getItem("active_store_id"))) ||
      "store-super-pinturas"
    );
  };

  const handleAddPosition = async (newPos: Omit<Position, "id" | "employeeCount">) => {
    const tempId = String(Date.now());
    const created: Position = {
      id: tempId,
      title: newPos.title,
      description: newPos.description,
      employeeCount: 0,
      permissions: newPos.permissions ?? ["manage_appointments"],
    };
    setPositions((prev) => [...prev, created]);

    // Integração POST /api/v1/stores/{storeId}/positions
    try {
      const storeId = getStoreId();
      const res = await createStorePosition({
        storeId,
        attendanceType: "CLIENT_LOCATION",
        radiusKm: 10,
        referenceAddress: newPos.description || newPos.title,
        cities: [],
      });
      const remotePos = Array.isArray(res) ? res[0] : res;
      if (remotePos?.id) {
        setPositions((prev) =>
          prev.map((p) => (p.id === tempId ? { ...p, id: remotePos.id } : p))
        );
      }
    } catch (err) {
      console.warn("[PositionsList] Aviso ao criar posição na API:", err);
    }
  };

  const handleEditPosition = async (updated: Position) => {
    setPositions((prev) =>
      prev.map((pos) => (pos.id === updated.id ? updated : pos))
    );

    // Integração PUT /api/v1/stores/{storeId}/positions/{positionId}
    try {
      const storeId = getStoreId();
      await updateStorePosition(storeId, updated.id, {
        storeId,
        attendanceType: "CLIENT_LOCATION",
        radiusKm: 10,
        referenceAddress: updated.description || updated.title,
        cities: [],
      });
    } catch (err) {
      console.warn("[PositionsList] Aviso ao atualizar posição na API:", err);
    }
  };

  const handleDeletePosition = async (id: string) => {
    setPositions((prev) => prev.filter((pos) => pos.id !== id));

    // Integração DELETE /api/v1/stores/{storeId}/positions/{positionId}
    try {
      const storeId = getStoreId();
      await deleteStorePosition(storeId, id);
    } catch (err) {
      console.warn("[PositionsList] Aviso ao excluir posição na API:", err);
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

      {/* Positions List */}
      <div className="flex flex-col gap-3.5">
        {positions.length === 0 ? (
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
