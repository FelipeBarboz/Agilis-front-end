"use client";

import { useState } from "react";
import { X, UserPlus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPositions } from "@/lib/mocks/positions";
import type { Employee } from "@/lib/mocks/employees";

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEmployee: (newEmp: Omit<Employee, "id">) => void;
}

export function AddEmployeeModal({
  open,
  onOpenChange,
  onAddEmployee,
}: AddEmployeeModalProps) {
  const [name, setName] = useState("");
  const [roleLabel, setRoleLabel] = useState(mockPositions[0]?.title || "Provedor de Serviço");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddEmployee({
      name: name.trim(),
      roleLabel,
      permissions: ["manage_appointments"],
    });

    setName("");
    onOpenChange(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-border flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <UserPlus className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Novo Funcionário</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Cadastre um novo membro para sua equipe.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Nome completo <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João da Silva"
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Cargo inicial
            </label>
            <div className="relative">
              <select
                value={roleLabel}
                onChange={(e) => setRoleLabel(e.target.value)}
                className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                {mockPositions.map((pos) => (
                  <option key={pos.id} value={pos.title}>
                    {pos.title}
                  </option>
                ))}
              </select>
              <Briefcase className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-2">
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
              Adicionar Membro
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
