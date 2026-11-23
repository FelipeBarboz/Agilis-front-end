"use client";

import { useState } from "react";
import { Link2, Shield, ArrowRight, CheckCircle2, Clock, Mail, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveInviteToken, type InviteLink, type UserStoreAssociation } from "@/lib/mocks/invites";

interface JoinStoreCardProps {
  onStoreJoined: (newAssoc: UserStoreAssociation) => void;
}

export function JoinStoreCard({ onStoreJoined }: JoinStoreCardProps) {
  const [inviteInput, setInviteInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validatedInvite, setValidatedInvite] = useState<InviteLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ storeName: string; position: string } | null>(null);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = inviteInput.trim();
    if (!trimmed) {
      setError("Por favor, cole um link ou código de convite.");
      return;
    }

    const invite = resolveInviteToken(trimmed);
    if (!invite) {
      // Fallback amigável para testes com qualquer link ou token genérico apontando para loja contratante (E-Clean)
      if (trimmed.toLowerCase().includes("invite") || trimmed.length > 3) {
        setValidatedInvite({
          token: trimmed,
          storeId: "store-1",
          storeName: "E-Clean",
          storeInitials: "EC",
          storeCategory: "Tecnologia e Manutenção",
          positionId: "3",
          positionTitle: "Atendente Operacional",
          permissions: ["manage_appointments", "access_chats"],
          generatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          isUsed: false,
        });
        return;
      }
      setError("Link ou código de convite inválido ou expirado. Verifique com o proprietário da loja.");
      return;
    }

    setValidatedInvite(invite);
  };

  const handleConfirmJoin = async () => {
    if (!validatedInvite) return;
    setIsSubmitting(true);

    // Simula o tempo de envio de solicitação e envio de e-mail ao provedor
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newAssociation: UserStoreAssociation = {
      id: `assoc-emp-${Date.now()}`,
      storeId: validatedInvite.storeId,
      storeName: validatedInvite.storeName,
      storeInitials: validatedInvite.storeInitials,
      storeCategory: validatedInvite.storeCategory || "Tecnologia e Manutenção",
      role: "employee",
      positionTitle: validatedInvite.positionTitle,
      permissions: validatedInvite.permissions,
      status: "pending", // Inicialmente pendente aguardando confirmação do email do provedor
      joinedAt: new Date().toISOString(),
    };

    onStoreJoined(newAssociation);
    setSuccessInfo({
      storeName: validatedInvite.storeName,
      position: validatedInvite.positionTitle,
    });
    setValidatedInvite(null);
    setInviteInput("");
    setIsSubmitting(false);
  };

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
            Tem um link de convite fornecido pelo proprietário da loja? Cole-o abaixo.
          </p>
        </div>
      </div>

      {/* Input de link */}
      <form onSubmit={handleValidate} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            value={inviteInput}
            onChange={(e) => {
              setInviteInput(e.target.value);
              setError(null);
            }}
            placeholder="Ex: https://agilis.com.br/invite/inv-atendente-xyz789 ou inv-atendente-xyz789"
            className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none transition-all"
          />
        </div>
        <Button
          type="submit"
          className="gap-2 rounded-2xl px-6 py-3 text-sm font-semibold cursor-pointer shrink-0"
        >
          <span>Validar Link</span>
          <ArrowRight className="size-4" />
        </Button>
      </form>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Modal / Card de validação do convite */}
      {validatedInvite && (
        <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
                {validatedInvite.storeInitials}
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Convite Localizado
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {validatedInvite.storeName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Cargo a ser atribuído: <strong className="text-foreground">{validatedInvite.positionTitle}</strong>
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
              {validatedInvite.permissions.map((perm) => (
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
              Ao confirmar, um e-mail será enviado ao proprietário para verificar sua condição de funcionário.
            </p>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmJoin}
              className="gap-2 rounded-xl text-xs font-semibold cursor-pointer shrink-0"
            >
              {isSubmitting ? (
                <>
                  <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Enviando solicitação...</span>
                </>
              ) : (
                <>
                  <Mail className="size-3.5" />
                  <span>Solicitar Entrada</span>
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
              <span className="font-bold text-sm">Solicitação enviada com sucesso!</span>
              <p>
                Foi enviado um e-mail para o proprietário da <strong>{successInfo.storeName}</strong> solicitando a confirmação do seu vínculo como <strong>{successInfo.position}</strong>.
              </p>
              <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
                <Clock className="size-3.5" />
                Assim que for confirmado, a tela de funcionário ficará ativa nesta página.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
