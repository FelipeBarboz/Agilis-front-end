"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Briefcase, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  STORE_ROLES,
  getRoleDefinition,
  type Position,
} from "@/lib/constants/store-roles";
import type { MemberRole } from "@/lib/services/store-members-service";
import { DeleteEmployeeConfirm } from "./delete-employee-confirm";
import { EmployeeRoleSection } from "./employee-role-section";
import { EmployeePermissionsView } from "./employee-permissions-view";
import { GenerateInviteModal } from "../../store-positions/_components/generate-invite-modal";

interface ManageEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
  currentRole?: string;
  apiRole?: MemberRole;
  isDeleting?: boolean;
  deleteError?: string | null;
  onDeleteEmployee?: () => Promise<void> | void;
}

export function ManageEmployeeModal({
  open,
  onOpenChange,
  employeeName,
  currentRole = "Funcionário",
  apiRole = "EMPLOYEE",
  isDeleting = false,
  deleteError = null,
  onDeleteEmployee,
}: ManageEmployeeModalProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invitePosition, setInvitePosition] = useState<Position | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedRole(currentRole);
      setIsEditingRole(false);
      setShowDeleteConfirm(false);
    }
  }, [open, currentRole]);

  const roleDef =
    STORE_ROLES.find(
      (r) => r.title.toLowerCase() === selectedRole.toLowerCase()
    ) ?? getRoleDefinition(apiRole);

  const selectedPositionObj: Position = {
    id: roleDef.id,
    title: roleDef.title,
    description: roleDef.description,
    employeeCount: 0,
    permissions: roleDef.permissions,
  };

  const rolePermissions = roleDef.permissions;
  const isOwner = apiRole === "OWNER";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isDeleting && onOpenChange(false)}
          >
            <motion.div
              className="w-full max-w-lg rounded-3xl bg-card p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col border border-border"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {showDeleteConfirm ? (
                <div className="flex flex-col gap-3">
                  <DeleteEmployeeConfirm
                    employeeName={employeeName}
                    onCancel={() => !isDeleting && setShowDeleteConfirm(false)}
                    onConfirm={async () => {
                      await onDeleteEmployee?.();
                    }}
                  />
                  {isDeleting && (
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Removendo membro...</span>
                    </div>
                  )}
                  {deleteError && (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                      {deleteError}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Modal Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                        <Briefcase className="size-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {employeeName}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Cargo atual:{" "}
                          <strong className="text-foreground">
                            {selectedRole}
                          </strong>
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

                  {/* Modal Body */}
                  <div className="my-5 flex flex-col gap-5 overflow-y-auto max-h-[60vh] pr-1">
                    {/* Seção de Cargo e Link de Convite */}
                    <EmployeeRoleSection
                      employeeName={employeeName}
                      selectedRole={selectedRole}
                      isEditingRole={isEditingRole}
                      onToggleEditRole={() => setIsEditingRole(!isEditingRole)}
                      onSelectRole={(title) => {
                        setSelectedRole(title);
                        setIsEditingRole(false);
                      }}
                      onGenerateLink={(pos) => setInvitePosition(pos)}
                      selectedPositionObj={selectedPositionObj}
                    />

                    {/* Permissões Herdadas do Cargo */}
                    <EmployeePermissionsView
                      selectedRole={selectedRole}
                      rolePermissions={rolePermissions}
                    />

                    {/* Opção de Excluir Funcionário (ocultada para OWNER) */}
                    {!isOwner && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors text-sm font-semibold cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                          <span>Remover Membro da Loja</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Footer Buttons */}
                  <div className="mt-4 flex items-center justify-end gap-3 shrink-0 pt-4 border-t border-border">
                    <Button
                      type="button"
                      className="w-full sm:w-auto rounded-xl px-5 py-2 font-semibold bg-brand-dark hover:bg-brand-dark-2 text-white transition-colors cursor-pointer"
                      onClick={() => onOpenChange(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Convite por Cargo */}
      <GenerateInviteModal
        position={invitePosition}
        isOpen={invitePosition !== null}
        onClose={() => setInvitePosition(null)}
      />
    </>
  );
}
