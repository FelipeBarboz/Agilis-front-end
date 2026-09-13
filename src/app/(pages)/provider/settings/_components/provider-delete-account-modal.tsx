"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProviderDeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ProviderDeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
}: ProviderDeleteAccountModalProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setDeleteConfirmation("");
    onClose();
  };

  const handleConfirm = () => {
    if (deleteConfirmation === "EXCLUIR") {
      setDeleteConfirmation("");
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-destructive">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h4 className="text-base font-bold">Tem certeza que deseja excluir?</h4>
            <p className="text-xs text-muted-foreground">Esta ação é irreversível.</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Para confirmar a exclusão da sua conta profissional, digite{" "}
          <strong className="text-foreground">EXCLUIR</strong> no campo abaixo:
        </p>

        <input
          type="text"
          value={deleteConfirmation}
          onChange={(e) => setDeleteConfirmation(e.target.value)}
          placeholder="Digite EXCLUIR"
          className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-destructive/20 font-bold"
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="rounded-xl text-xs font-medium cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteConfirmation !== "EXCLUIR"}
            onClick={handleConfirm}
            className="rounded-xl text-xs font-bold cursor-pointer disabled:opacity-40"
          >
            Confirmar Exclusão
          </Button>
        </div>
      </div>
    </div>
  );
}
