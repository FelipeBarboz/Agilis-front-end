"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Briefcase, 
  ShieldCheck, 
  CalendarDays, 
  MessageSquare, 
  BarChart3, 
  Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  STORE_PERMISSIONS, 
  type Position, 
  type PermissionId 
} from "@/lib/mocks/positions";

const PERMISSION_ICONS: Record<PermissionId, React.ComponentType<{ className?: string }>> = {
  manage_appointments: CalendarDays,
  access_chats: MessageSquare,
  access_reports: BarChart3,
  store_settings: Settings,
};

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
            className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Título do cargo <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Descrição das responsabilidades
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Permissões do Cargo */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Permissões de Acesso do Cargo</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Atualize os acessos concedidos a quem ocupa este cargo.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              {STORE_PERMISSIONS.map((perm) => {
                const Icon = PERMISSION_ICONS[perm.id] || ShieldCheck;
                const isActive = selectedPermissions.has(perm.id);

                return (
                  <div
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-2xl border p-3 cursor-pointer transition-all select-none",
                      isActive
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">
                          {perm.label}
                        </span>
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {perm.description}
                        </span>
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <div
                      className={cn(
                        "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                        isActive ? "bg-primary" : "bg-muted-foreground/30"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                          isActive ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium border-border hover:bg-muted"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl px-5 py-2 text-sm font-semibold bg-brand-dark text-white hover:bg-brand-dark-2 transition-colors"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

