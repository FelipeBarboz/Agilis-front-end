"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { resolveInviteToken, type InviteLink, saveEmployeeStoresToStorage, getEmployeeStoresFromStorage, type UserStoreAssociation } from "@/lib/mocks/invites";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Clock, Mail, Shield, AlertCircle } from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";

function InvitePageContent() {
  const params = useParams();
  const router = useRouter();
  const token = params?.inviteId as string;

  const [invite, setInvite] = useState<InviteLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (token) {
      const resolved = resolveInviteToken(token);
      if (resolved) {
        setInvite(resolved);
      } else {
        // Fallback genérico para tokens não encontrados
        setInvite({
          token,
          storeId: "store-1",
          storeName: "E-Clean",
          storeInitials: "EC",
          positionId: "3",
          positionTitle: "Atendente Operacional",
          permissions: ["manage_appointments", "access_chats"],
          generatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          isUsed: false,
        });
      }
    }
  }, [token]);

  const handleRequestJoin = async () => {
    if (!invite) return;
    setIsSubmitting(true);

    // Simula a requisição de e-mail ao proprietário da loja
    await new Promise((resolve) => setTimeout(resolve, 600));

    const currentList = getEmployeeStoresFromStorage();
    const newAssoc: UserStoreAssociation = {
      id: `assoc-emp-${Date.now()}`,
      storeId: invite.storeId,
      storeName: invite.storeName,
      storeInitials: invite.storeInitials,
      storeCategory: invite.storeCategory || "Tecnologia e Manutenção",
      role: "employee",
      positionTitle: invite.positionTitle,
      permissions: invite.permissions,
      status: "pending",
      joinedAt: new Date().toISOString(),
    };

    // Remove duplicatas se houver
    const updated = [newAssoc, ...currentList.filter((a) => a.storeId !== invite.storeId)];
    saveEmployeeStoresToStorage(updated);

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center bg-muted p-4 pb-20">
      
      {/* Botão Voltar */}
      <button
        type="button"
        onClick={() => router.push("/stores")}
        aria-label="Voltar para Lojas"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
        {submitted ? (
          <div className="flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
              <CheckCircle2 className="size-8" />
            </div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              Solicitação Enviada!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Um e-mail de confirmação foi encaminhado ao proprietário da loja <strong>{invite?.storeName}</strong> para validar sua admissão como <strong>{invite?.positionTitle}</strong>.
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-200 text-left">
              <Clock className="size-4 shrink-0 text-amber-600" />
              <span>Assim que for verificado, a tela de funcionário ficará ativa na sua lista de lojas.</span>
            </div>

            <Button
              type="button"
              onClick={() => router.push("/stores")}
              className="mt-6 w-full rounded-2xl py-3 text-sm font-semibold cursor-pointer"
            >
              Ir para Minhas Lojas
            </Button>
          </div>
        ) : invite ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-sm">
                {invite.storeInitials}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Convite de Equipe
                </span>
                <h1 className="text-xl font-bold text-foreground">
                  {invite.storeName}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Cargo ofertado: <strong className="text-foreground">{invite.positionTitle}</strong>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Permissões deste cargo:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {invite.permissions.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 rounded-md bg-card border border-border px-2 py-1 text-xs text-foreground font-medium"
                  >
                    <Shield className="size-3 text-primary" />
                    {p === "manage_appointments" && "Gerenciar Atendimentos"}
                    {p === "access_chats" && "Chats"}
                    {p === "access_reports" && "Relatórios"}
                    {p === "store_settings" && "Configurações"}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Ao confirmar a entrada, uma notificação por e-mail será enviada para o proprietário autorizar a vinculação da sua conta à equipe.
            </p>

            <div className="flex flex-col gap-2.5">
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleRequestJoin}
                className="w-full gap-2 rounded-2xl py-3 text-sm font-semibold cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Enviando solicitação...</span>
                ) : (
                  <>
                    <Mail className="size-4" />
                    <span>Confirmar e Notificar Proprietário</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/stores")}
                className="w-full rounded-2xl border-border text-xs cursor-pointer"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-4">
            <AlertCircle className="size-10 text-destructive mb-2" />
            <h2 className="text-lg font-bold text-foreground">Convite Inválido</h2>
            <p className="text-xs text-muted-foreground mt-1">Este link expirou ou não é válido.</p>
            <Button
              type="button"
              onClick={() => router.push("/stores")}
              className="mt-4 rounded-xl text-xs cursor-pointer"
            >
              Voltar para Lojas
            </Button>
          </div>
        )}
      </div>

    </div>
  );
}

export default function InvitePage() {
  return (
    <AuthGuard>
      <InvitePageContent />
    </AuthGuard>
  );
}
