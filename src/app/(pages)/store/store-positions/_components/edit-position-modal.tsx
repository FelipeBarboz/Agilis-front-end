"use client";

import { useState, useEffect } from "react";
import { X, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Position, type PermissionId } from "@/lib/mocks/positions";
import { PositionFormFields } from "./position-form-fields";
import { PermissionChecklist } from "./permission-checklist";

interface EditPositionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: Position | null;
  onSave: (updated: Position) => void;
}

export function EditPositionModal({
  open,
  onOpenChange,
  position,
  onSave,
}: EditPositionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<PermissionId>>(
    new Set(["manage_appointments"])
  );

  useEffect(() => {
    if (position) {
      setTitle(position.title);
      setDescription(position.description);
      setSelectedPermissions(new Set(position.permissions || ["manage_appointments"]));
    }
  }, [position]);

  if (!open || !position) return null;

  const togglePermission = (id: PermissionId) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...position,
      title: title.trim(),
      description: description.trim(),
      permissions: Array.from(selectedPermissions),
    });

    onOpenChange(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="w-full max-w-lg rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-border flex flex-col gap-6 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <Briefcase className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Editar Cargo</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Atualize o título, atribuições e permissões deste cargo.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 overflow-y-auto pr-1">
          <PositionFormFields
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
          />

          <PermissionChecklist
            selectedPermissions={selectedPermissions}
            onTogglePermission={togglePermission}
          />

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium border-border hover:bg-muted cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl px-5 py-2 text-sm font-semibold bg-brand-dark text-white hover:bg-brand-dark-2 transition-colors cursor-pointer"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
