"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, CalendarDays, MessageSquare, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export type PermissionId = "manage_appointments" | "access_chats" | "access_reports" | "store_settings";

const PERMISSIONS = [
  {
    id: "manage_appointments" as PermissionId,
    label: "Gerenciar atendimentos",
    description: "Permite criar, editar e cancelar agendamentos.",
    icon: CalendarDays,
  },
  {
    id: "access_chats" as PermissionId,
    label: "Acessar chats",
    description: "Permite visualizar e responder mensagens de clientes.",
    icon: MessageSquare,
  },
  {
    id: "access_reports" as PermissionId,
    label: "Relatórios",
    description: "Visualizar métricas e relatórios financeiros da loja.",
    icon: BarChart3,
  },
  {
    id: "store_settings" as PermissionId,
    label: "Configurações da loja",
    description: "Acesso total para editar perfil e serviços da loja.",
    icon: Settings,
  },
];

interface ManageEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
  initialPermissions?: PermissionId[];
  onSave?: (permissions: PermissionId[]) => void;
}

export function ManageEmployeeModal({
  open,
  onOpenChange,
  employeeName,
  initialPermissions = ["manage_appointments"],
  onSave,
}: ManageEmployeeModalProps) {
  const [activePermissions, setActivePermissions] = useState<Set<PermissionId>>(
    new Set(initialPermissions)
  );

  useEffect(() => {
    if (open) {
      setActivePermissions(new Set(initialPermissions));
    }
  }, [open, initialPermissions]);

  const togglePermission = (id: PermissionId) => {
    setActivePermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
            style={{ maxHeight: "90vh" }}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between shrink-0">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-foreground">
                  Gerenciar Funcionário
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Permissões para <span className="font-semibold text-foreground">{employeeName}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors self-start"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Permissions List */}
            <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-2 -mr-2">
              {PERMISSIONS.map((perm) => {
                const Icon = perm.icon;
                const isActive = activePermissions.has(perm.id);

                return (
                  <div
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={cn(
                      "flex items-center justify-between gap-4 rounded-xl border p-4 cursor-pointer transition-colors select-none",
                      isActive
                        ? "border-[#00d68f]/30 bg-[#00d68f]/5"
                        : "border-input hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <Icon
                        className={cn(
                          "mt-0.5 h-5 w-5 shrink-0",
                          isActive ? "text-[#00d68f]" : "text-muted-foreground"
                        )}
                      />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-foreground">
                          {perm.label}
                        </span>
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {perm.description}
                        </span>
                      </div>
                    </div>
                    
                    {/* Custom Toggle Switch matching the second print */}
                    <div
                      className={cn(
                        "relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                        isActive ? "bg-[#00d68f]" : "bg-[#2c2c2c]"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                          isActive ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 shrink-0 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full sm:w-1/2 font-bold h-11 bg-gray-100 hover:bg-gray-200 border-none text-black"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-1/2 font-bold h-11 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white"
                onClick={() => {
                  onSave?.(Array.from(activePermissions));
                  onOpenChange(false);
                }}
              >
                Salvar alterações
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
