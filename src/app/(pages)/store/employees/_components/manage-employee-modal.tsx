"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Briefcase, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { mockPositions } from "@/lib/mocks/positions";
import { DeleteEmployeeConfirm } from "./delete-employee-confirm";
import { EmployeeRoleSection } from "./employee-role-section";
import { EmployeePermissionsView } from "./employee-permissions-view";

interface ManageEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
  currentRole?: string;
  onSave?: (newRole: string) => void;
  onDeleteEmployee?: () => void;
}

export function ManageEmployeeModal({
  open,
  onOpenChange,
  employeeName,
  currentRole = "Provedor de Serviço",
  onSave,
  onDeleteEmployee,
}: ManageEmployeeModalProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedRole(currentRole);
      setIsEditingRole(false);
      setShowDeleteConfirm(false);
    }
  }, [open, currentRole]);

  // Find the selected position object to show its inherited permissions
  const selectedPositionObj = mockPositions.find(
    (p) => p.title.toLowerCase() === selectedRole.toLowerCase()
  ) ?? mockPositions[1];

  const rolePermissions = selectedPositionObj?.permissions ?? ["manage_appointments"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            className="w-full max-w-lg rounded-3xl bg-card p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col border border-border"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
            style={{ maxHeight: "90vh" }}
          >
            {/* Confirmation Delete View */}
            {showDeleteConfirm ? (
              <DeleteEmployeeConfirm
                employeeName={employeeName}
                onCancel={() => setShowDeleteConfirm(false)}
                onConfirm={() => {
                  onDeleteEmployee?.();
                  onOpenChange(false);
                }}
              />
            ) : (
              <>
                {/* Header */}
                <div className="mb-6 flex items-start justify-between shrink-0">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-lg shrink-0">
                      {employeeName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold text-foreground">
                        {employeeName}
                      </h2>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-0.5">
                        <Briefcase className="size-3.5" />
                        {selectedRole}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content Container */}
                <div className="flex flex-col gap-5 overflow-y-auto pr-1 pb-2">
                  {/* Seção: Atribuir Cargo / Editar Cargo */}
                  <EmployeeRoleSection
                    employeeName={employeeName}
                    selectedRole={selectedRole}
                    isEditingRole={isEditingRole}
                    onToggleEditRole={() => setIsEditingRole(!isEditingRole)}
                    onSelectRole={(title) => {
                      setSelectedRole(title);
                      setIsEditingRole(false);
                    }}
                    selectedPositionObj={selectedPositionObj}
                  />

                  {/* Permissões Herdadas do Cargo */}
                  <EmployeePermissionsView
                    selectedRole={selectedRole}
                    rolePermissions={rolePermissions}
                  />

                  {/* Opção de Excluir Funcionário */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors text-sm font-semibold cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                      <span>Excluir Funcionário da Loja</span>
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto rounded-xl px-4 py-2 font-medium border-border hover:bg-muted cursor-pointer"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    className="w-full sm:w-auto rounded-xl px-5 py-2 font-semibold bg-brand-dark hover:bg-brand-dark-2 text-white transition-colors cursor-pointer"
                    onClick={() => {
                      onSave?.(selectedRole);
                      onOpenChange(false);
                    }}
                  >
                    Salvar alterações
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
