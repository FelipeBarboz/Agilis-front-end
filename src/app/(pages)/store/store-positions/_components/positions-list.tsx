"use client";

import { useState } from "react";
import { Plus, Briefcase, Users, Pencil, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPositions, type Position } from "@/lib/mocks/positions";
import { AddPositionModal } from "./add-position-modal";
import { EditPositionModal } from "./edit-position-modal";
import { DeletePositionModal } from "./delete-position-modal";

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
          className="gap-2 rounded-xl bg-brand-dark text-white hover:bg-brand-dark-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Adicionar Cargo</span>
        </Button>
      </div>

      {/* Positions List */}
      <div className="flex flex-col gap-3.5">
        {positions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-muted/20">
            <Briefcase className="size-10 text-muted-foreground mb-3" />
            <h3 className="font-bold text-foreground">Nenhum cargo cadastrado</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Adicione o primeiro cargo para começar a estruturar as funções da sua loja.
            </p>
            <Button
              onClick={() => setAddModalOpen(true)}
              className="mt-4 gap-2 rounded-xl bg-brand-dark text-white hover:bg-brand-dark-2"
            >
              <Plus className="size-4" />
              Adicionar Cargo
            </Button>
          </div>
        ) : (
          positions.map((pos) => (
            <div
              key={pos.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-white shadow-xs hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <Briefcase className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-foreground text-base">
                      {pos.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      <Users className="size-3" />
                      {pos.employeeCount} {pos.employeeCount === 1 ? "funcionário" : "funcionários"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mt-0.5">
                    {pos.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {pos.permissions && pos.permissions.length > 0 ? (
                      pos.permissions.map((permId) => {
                        const permDef = {
                          manage_appointments: "Atendimentos",
                          access_chats: "Chats",
                          access_reports: "Relatórios",
                          store_settings: "Configurações",
                        }[permId] || permId;

                        return (
                          <span
                            key={permId}
                            className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary"
                          >
                            <Shield className="size-3" />
                            {permDef}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Nenhuma permissão especial
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(pos)}
                  className="gap-1.5 rounded-xl border-border hover:bg-muted text-foreground h-9"
                  title="Editar cargo"
                >
                  <Pencil className="size-3.5" />
                  <span className="text-xs font-semibold">Editar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDelete(pos)}
                  className="gap-1.5 rounded-xl border-border hover:border-destructive/30 hover:bg-destructive/10 text-muted-foreground hover:text-destructive h-9"
                  title="Excluir cargo"
                >
                  <Trash2 className="size-3.5" />
                  <span className="text-xs font-semibold">Excluir</span>
                </Button>
              </div>
            </div>
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
