"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPositions, type Position } from "@/lib/mocks/positions";
import { AddPositionModal } from "./add-position-modal";
import { EditPositionModal } from "./edit-position-modal";
import { DeletePositionModal } from "./delete-position-modal";
import { PositionCard } from "./position-card";
import { PositionsEmptyState } from "./positions-empty-state";

export function PositionsList() {
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const handleAddPosition = (newPos: Omit<Position, "id" | "employeeCount">) => {
    const created: Position = {
      id: String(Date.now()),
      title: newPos.title,
      description: newPos.description,
      employeeCount: 0,
      permissions: newPos.permissions ?? ["manage_appointments"],
    };
    setPositions((prev) => [...prev, created]);
  };

  const handleEditPosition = (updated: Position) => {
    setPositions((prev) =>
      prev.map((pos) => (pos.id === updated.id ? updated : pos))
    );
  };

  const handleDeletePosition = (id: string) => {
    setPositions((prev) => prev.filter((pos) => pos.id !== id));
  };

  const openEdit = (pos: Position) => {
    setSelectedPosition(pos);
    setEditModalOpen(true);
  };

  const openDelete = (pos: Position) => {
    setSelectedPosition(pos);
    setDeleteModalOpen(true);
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
    </div>
  );
}
