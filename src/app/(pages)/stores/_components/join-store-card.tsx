"use client";

import { useState } from "react";
import {
  Link2,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  extractInviteCode,
  getPublicStoreInvite,
  acceptStoreInvite,
  type PublicStoreInviteDTO,
} from "@/lib/services/store-invites-service";
import { getRoleDefinition } from "@/lib/constants/store-roles";

interface JoinStoreCardProps {
  onStoreJoined?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function JoinStoreCard({ onStoreJoined }: JoinStoreCardProps) {
  const [inviteInput, setInviteInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validatedInvite, setValidatedInvite] =
    useState<PublicStoreInviteDTO | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    storeName: string;
    position: string;
  } | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);

    const code = extractInviteCode(inviteInput);
    if (!code) {
      setError("Por favor, cole um link ou código de convite.");
      return;
    }

    setIsValidating(true);
    try {
      const invite = await getPublicStoreInvite(code);
      setValidatedInvite(invite);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Link ou código de convite inválido ou expirado. Verifique com o proprietário da loja.";
      setError(msg);
      setValidatedInvite(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirmJoin = async () => {
    if (!validatedInvite) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const accepted = await acceptStoreInvite(validatedInvite.code);
      const roleDef = getRoleDefinition(accepted.role || validatedInvite.role);

      setSuccessInfo({
        storeName: validatedInvite.storeName,
        position: roleDef.title,
      });
      setValidatedInvite(null);
      setInviteInput("");
      onStoreJoined?.();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível aceitar o convite.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleDef = validatedInvite
    ? getRoleDefinition(validatedInvite.role)
    : null;

  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <Link2 className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            Entrar como Funcionário
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Tem um link ou código de convite fornecido pelo proprietário da loja?
            Cole-o abaixo.
          </p>
        </div>
      </div>

      {/* Input de link */}
      <form
        onSubmit={handleValidate}
        className="mt-4 flex flex-col gap-2 sm:flex-row"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inviteInput}
            onChange={(e) => {
              setInviteInput(e.target.value);
              setError(null);
            }}
            disabled={isValidating || isSubmitting}
            placeholder="Ex: https://agilis.com.br/invite/CODIGO ou CODIGO"
            className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none transition-all"
          />
        </div>
        <Button
          type="submit"
          disabled={isValidating || isSubmitting}
          className="gap-2 rounded-2xl px-6 py-3 text-sm font-semibold cursor-pointer shrink-0"
        >
          {isValidating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Validando...</span>
            </>
          ) : (
            <>
              <span>Validar Link</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Card de validação do convite */}
      {validatedInvite && roleDef && (
        <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-sm shrink-0">
                {getInitials(validatedInvite.storeName)}
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Convite Localizado
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {validatedInvite.storeName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Cargo a ser atribuído:{" "}
                  <strong className="text-foreground">{roleDef.title}</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setValidatedInvite(null)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-3 border-t border-primary/20 pt-3">
            <p className="text-xs text-muted-foreground">
              Permissões incluídas neste cargo:
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {roleDef.permissions.map((perm) => (
                <span
                  key={perm}
                  className="inline-flex items-center gap-1 rounded-md bg-card/80 border border-primary/20 px-2 py-0.5 text-xs text-foreground font-medium"
                >
                  <Shield className="size-3 text-primary" />
                  {perm === "manage_appointments" && "Gerenciar Atendimentos"}
                  {perm === "access_chats" && "Chats e Mensagens"}
                  {perm === "access_reports" && "Relatórios"}
                  {perm === "store_settings" && "Configurações"}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-primary/20">
            <p className="text-[11px] text-muted-foreground max-w-sm">
              Ao confirmar, você será vinculado à equipe desta loja
              imediatamente.
            </p>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmJoin}
              className="gap-2 rounded-xl text-xs font-semibold cursor-pointer shrink-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <UserPlus className="size-3.5" />
                  <span>Aceitar Convite</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Alerta de Sucesso */}
      {successInfo && (
        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 text-xs">
              <span className="font-bold text-sm">
                Vínculo confirmado com sucesso!
              </span>
              <p>
                Você entrou na equipe da <strong>{successInfo.storeName}</strong>{" "}
                como <strong>{successInfo.position}</strong>. A loja já está
                disponível na sua lista acima.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
