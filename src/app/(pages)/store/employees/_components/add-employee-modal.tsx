"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  UserPlus,
  Briefcase,
  Loader2,
  Link2,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SELECTABLE_ROLES } from "@/lib/constants/store-roles";
import {
  createStoreInvite,
  getStoreInvites,
  type InviteRole,
} from "@/lib/services/store-invites-service";

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
}

export function AddEmployeeModal({
  open,
  onOpenChange,
  storeId,
}: AddEmployeeModalProps) {
  const [role, setRole] = useState<InviteRole>("EMPLOYEE");
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<"link" | "code" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOrCreateInvite = useCallback(
    async (targetRole: InviteRole, forceNew = false) => {
      if (!storeId) return;

      setIsLoading(true);
      setErrorMessage(null);

      try {
        if (!forceNew) {
          const existing = await getStoreInvites(storeId);
          const valid = existing.find(
            (inv) => inv.valid && inv.role === targetRole
          );
          if (valid) {
            setInviteCode(valid.code);
            return;
          }
        }

        const created = await createStoreInvite(storeId, {
          role: targetRole,
          expirationDays: 7,
          maxUses: 10,
        });
        setInviteCode(created.code);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Não foi possível gerar o convite.";
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [storeId]
  );

  useEffect(() => {
    if (open && storeId) {
      setInviteCode("");
      void loadOrCreateInvite(role, false);
    }
  }, [open, storeId, role, loadOrCreateInvite]);

  if (!open) return null;

  const inviteUrl = inviteCode
    ? typeof window !== "undefined"
      ? `${window.location.origin}/invite/${inviteCode}`
      : `/invite/${inviteCode}`
    : "";

  const handleCopy = async (text: string, type: "link" | "code") => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // Fallback silencioso
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-border flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <UserPlus className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Convidar Funcionário
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Envie o link ou código de convite para o colaborador entrar na
                loja.
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

        {/* Seleção de Cargo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground">
            Cargo do convidado
          </label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as InviteRole)}
              disabled={isLoading}
              className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {SELECTABLE_ROLES.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.title}
                </option>
              ))}
            </select>
            <Briefcase className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
        </div>

        {/* Link e Código de Convite */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Link2 className="size-3.5 text-primary" />
              Link de Convite
            </span>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => void loadOrCreateInvite(role, true)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`size-3 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Gerar novo</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 py-4 text-xs text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>Gerando convite...</span>
            </div>
          ) : errorMessage ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              {errorMessage}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="flex-1 rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-xs font-mono text-foreground focus:outline-none select-all"
                />
                <Button
                  type="button"
                  onClick={() => void handleCopy(inviteUrl, "link")}
                  disabled={!inviteUrl}
                  className="gap-1.5 rounded-xl shrink-0 cursor-pointer text-xs font-semibold"
                >
                  {copiedType === "link" ? (
                    <>
                      <Check className="size-3.5" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3.5 py-2.5">
                <div className="flex flex-col">
                  <span className="text-[11px] text-muted-foreground">
                    Ou compartilhe apenas o código:
                  </span>
                  <span className="text-sm font-mono font-bold text-foreground">
                    {inviteCode}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleCopy(inviteCode, "code")}
                  disabled={!inviteCode}
                  className="gap-1.5 rounded-lg text-xs cursor-pointer"
                >
                  {copiedType === "code" ? (
                    <>
                      <Check className="size-3.5 text-emerald-500" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Código</span>
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-4 py-2 text-sm font-medium border-border hover:bg-muted cursor-pointer"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
