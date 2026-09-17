"use client";

import { ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockPositions, type Position } from "@/lib/mocks/positions";

interface EmployeeRoleSectionProps {
  employeeName: string;
  selectedRole: string;
  isEditingRole: boolean;
  onToggleEditRole: () => void;
  onSelectRole: (roleTitle: string) => void;
  selectedPositionObj?: Position;
}

export function EmployeeRoleSection({
  employeeName,
  selectedRole,
  isEditingRole,
  onToggleEditRole,
  onSelectRole,
  selectedPositionObj,
}: EmployeeRoleSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
          <ShieldCheck className="size-4 text-primary" />
          <span>Cargo e Função</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleEditRole}
          className="rounded-xl text-xs font-semibold h-8 border-border hover:bg-muted cursor-pointer"
        >
          {isEditingRole ? "Fechar Opções" : "Atribuir / Editar Cargo"}
        </Button>
      </div>

      {isEditingRole ? (
        <div className="flex flex-col gap-2 pt-2 border-t border-border animate-fade-in">
          <span className="text-xs font-medium text-muted-foreground">
            Selecione o cargo para {employeeName}:
          </span>
          <div className="grid grid-cols-1 gap-2">
            {mockPositions.map((pos) => {
              const isSelected = selectedRole === pos.title;
              return (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => onSelectRole(pos.title)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border text-left transition-all text-sm cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-border bg-card hover:bg-muted text-foreground"
                  )}
                >
                  <div className="flex flex-col">
                    <span>{pos.title}</span>
                    <span className="text-xs font-normal text-muted-foreground line-clamp-1">
                      {pos.description}
                    </span>
                  </div>
                  {isSelected && (
                    <UserCheck className="size-4 text-primary shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-card px-3.5 py-2.5 rounded-xl border border-border">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {selectedRole}
            </span>
            <span className="text-xs text-muted-foreground">
              {selectedPositionObj?.description ?? "Função na loja"}
            </span>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
            Atribuído
          </span>
        </div>
      )}
    </div>
  );
}
