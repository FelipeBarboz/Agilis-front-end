"use client";

import { Briefcase, Users, Pencil, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Position } from "@/lib/mocks/positions";

const PERMISSION_LABELS: Record<string, string> = {
  manage_appointments: "Atendimentos",
  access_chats: "Chats",
  access_reports: "Relatórios",
  store_settings: "Configurações",
};

interface PositionCardProps {
  position: Position;
  onEdit: (position: Position) => void;
  onDelete: (position: Position) => void;
}

export function PositionCard({ position, onEdit, onDelete }: PositionCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-card shadow-xs hover:border-primary/30 transition-all group">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 group-hover:scale-105 transition-transform">
          <Briefcase className="size-5" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-foreground text-base">
              {position.title}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <Users className="size-3" />
              {position.employeeCount} {position.employeeCount === 1 ? "funcionário" : "funcionários"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mt-0.5">
            {position.description}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {position.permissions && position.permissions.length > 0 ? (
              position.permissions.map((permId) => (
                <span
                  key={permId}
                  className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary"
                >
                  <Shield className="size-3" />
                  {PERMISSION_LABELS[permId] || permId}
                </span>
              ))
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
          onClick={() => onEdit(position)}
          className="gap-1.5 rounded-xl border-border hover:bg-muted text-foreground h-9 cursor-pointer"
          title="Editar cargo"
        >
          <Pencil className="size-3.5" />
          <span className="text-xs font-semibold">Editar</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(position)}
          className="gap-1.5 rounded-xl border-border hover:border-destructive/30 hover:bg-destructive/10 text-muted-foreground hover:text-destructive h-9 cursor-pointer"
          title="Excluir cargo"
        >
          <Trash2 className="size-3.5" />
          <span className="text-xs font-semibold">Excluir</span>
        </Button>
      </div>
    </div>
  );
}
