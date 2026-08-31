"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Position } from "@/lib/mocks/positions";

interface DeletePositionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: Position | null;
  onConfirmDelete: (id: string) => void;
}

export function DeletePositionModal({
  open,
  onOpenChange,
  position,
  onConfirmDelete,
}: DeletePositionModalProps) {
  if (!open || !position) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="w-full max-w-md rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-border flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Excluir Cargo</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Esta ação não poderá ser desfeita.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-foreground">
            Tem certeza que deseja excluir o cargo <strong className="text-foreground">{position.title}</strong>?
          </p>
          {position.employeeCount > 0 && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-600 dark:text-amber-400">
              Atenção: Há <strong>{position.employeeCount} funcionário(s)</strong> atualmente associado(s) a este cargo.
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-4 py-2 text-sm font-medium border-border hover:bg-muted"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirmDelete(position.id);
              onOpenChange(false);
            }}
            className="rounded-xl px-5 py-2 text-sm font-semibold bg-destructive text-white hover:bg-destructive/90 transition-colors"
          >
            Excluir Cargo
          </Button>
        </div>
      </div>
    </div>
  );
}
