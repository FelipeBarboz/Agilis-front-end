"use client";

import { AnimatePresence, motion } from "framer-motion";
import { 
  X, 
  CalendarDays, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Briefcase, 
  Trash2, 
  UserCheck, 
  AlertTriangle,
  ShieldCheck,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { 
  STORE_PERMISSIONS, 
  mockPositions, 
  type PermissionId 
} from "@/lib/mocks/positions";

const PERMISSION_ICONS: Record<PermissionId, React.ComponentType<{ className?: string }>> = {
  manage_appointments: CalendarDays,
  access_chats: MessageSquare,
  access_reports: BarChart3,
  store_settings: Settings,
};

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
  ) || mockPositions[1];

  const rolePermissions = selectedPositionObj?.permissions || ["manage_appointments"];

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
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3 text-destructive">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
                    <AlertTriangle className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Excluir Funcionário</h2>
                    <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita.</p>
                  </div>
                </div>

                <p className="text-sm text-foreground leading-relaxed">
                  Tem certeza que deseja remover <strong className="text-foreground">{employeeName}</strong> da equipe da loja? O funcionário perderá todos os acessos imediatamente.
                </p>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-xl px-4 py-2 text-sm font-medium border-border hover:bg-muted"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                    onDeleteEmployee?.();
                    onOpenChange(false);
                  }}
                    className="rounded-xl px-5 py-2 text-sm font-semibold bg-destructive text-white hover:bg-destructive/90 transition-colors"
                  >
                    Confirmar Exclusão
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-6 flex items-start justify-between shrink-0">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-lg shrink-0">
                      {employeeName.split(" ").map(n => n[0]).slice(0, 2).join("")}
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
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content Container */}
                <div className="flex flex-col gap-5 overflow-y-auto pr-1 pb-2">
                  
                  {/* Seção: Atribuir Cargo / Editar Cargo */}
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
                        onClick={() => setIsEditingRole(!isEditingRole)}
                        className="rounded-xl text-xs font-semibold h-8 border-border hover:bg-muted"
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
                                onClick={() => {
                                  setSelectedRole(pos.title);
                                  setIsEditingRole(false);
                                }}
                                className={cn(
                                  "flex items-center justify-between p-3 rounded-xl border text-left transition-all text-sm",
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
                                {isSelected && <UserCheck className="size-4 text-primary shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-card px-3.5 py-2.5 rounded-xl border border-border">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">{selectedRole}</span>
                          <span className="text-xs text-muted-foreground">
                            {selectedPositionObj?.description || "Função na loja"}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                          Atribuído
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Permissões Herdadas do Cargo */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">Permissões do Cargo</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Acessos herdados automaticamente do cargo <strong className="text-foreground">{selectedRole}</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {STORE_PERMISSIONS.map((perm) => {
                        const Icon = PERMISSION_ICONS[perm.id] || ShieldCheck;
                        const isGranted = rolePermissions.includes(perm.id);

                        return (
                          <div
                            key={perm.id}
                            className={cn(
                              "flex items-center justify-between gap-3 rounded-2xl border p-3 transition-all select-none",
                              isGranted
                                ? "border-primary/30 bg-primary/5"
                                : "border-border bg-muted/10 opacity-60"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <Icon
                                className={cn(
                                  "mt-0.5 h-4 w-4 shrink-0",
                                  isGranted ? "text-primary" : "text-muted-foreground"
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

                            <span className={cn(
                              "text-xs font-semibold px-2 py-0.5 rounded-md shrink-0",
                              isGranted 
                                ? "bg-primary/10 text-primary" 
                                : "bg-muted text-muted-foreground"
                            )}>
                              {isGranted ? "Concedido" : "Não incluso"}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground border border-border mt-1">
                      <Info className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        Para alterar as permissões deste cargo, acesse a aba <strong>Cargos</strong> no perfil da loja.
                      </span>
                    </div>
                  </div>

                  {/* Opção de Excluir Funcionário */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors text-sm font-semibold"
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
                    className="w-full sm:w-auto rounded-xl px-4 py-2 font-medium border-border hover:bg-muted"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    className="w-full sm:w-auto rounded-xl px-5 py-2 font-semibold bg-brand-dark hover:bg-brand-dark-2 text-white transition-colors"
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


