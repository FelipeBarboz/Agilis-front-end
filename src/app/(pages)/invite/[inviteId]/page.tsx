"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getPublicStoreInvite,
  acceptStoreInvite,
  type PublicStoreInviteDTO,
} from "@/lib/services/store-invites-service";
import { getRoleDefinition } from "@/lib/constants/store-roles";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Shield,
  AlertCircle,
  Loader2,
  UserPlus,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function InvitePageContent() {
  const params = useParams();
  const router = useRouter();
  const token = params?.inviteId as string;

  const [invite, setInvite] = useState<PublicStoreInviteDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    getPublicStoreInvite(token)
      .then((data) => {
        if (isMounted) setInvite(data);
      })
      .catch((err) => {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "Este link expirou ou não é válido.";
          setErrorMessage(msg);
          setInvite(null);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleAcceptInvite = async () => {
    if (!invite) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await acceptStoreInvite(invite.code);
      setSubmitted(true);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível aceitar o convite.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleDef = invite ? getRoleDefinition(invite.role) : null;

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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
            <Loader2 className="size-7 animate-spin text-primary" />
            <p className="text-sm">Validando convite...</p>
          </div>
        ) : submitted && invite ? (
          <div className="flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
              <CheckCircle2 className="size-8" />
            </div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">
              Convite Aceito!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Você agora faz parte da equipe da loja{" "}
              <strong>{invite.storeName}</strong> como{" "}
              <strong>{roleDef?.title ?? invite.role}</strong>.
            </p>

            <div className="mt-6 flex w-full flex-col gap-2.5">
              <Button
                type="button"
                onClick={() =>
                  router.push(
                    `/employee-store/${encodeURIComponent(invite.storeId)}`
                  )
                }
                className="w-full rounded-2xl py-3 text-sm font-semibold cursor-pointer"
              >
                Acessar Painel da Loja
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/stores")}
                className="w-full rounded-2xl border-border text-xs cursor-pointer"
              >
                Ir para Minhas Lojas
              </Button>
            </div>
          </div>
        ) : invite && roleDef ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-sm shrink-0">
                {getInitials(invite.storeName)}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Convite de Equipe
                </span>
                <h1 className="text-xl font-bold text-foreground">
                  {invite.storeName}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Cargo ofertado:{" "}
                  <strong className="text-foreground">{roleDef.title}</strong>
                </p>
              </div>
            </div>

            {invite.storeDescription && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {invite.storeDescription}
              </p>
            )}

            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Permissões deste cargo:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {roleDef.permissions.map((p) => (
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

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleAcceptInvite}
                className="w-full gap-2 rounded-2xl py-3 text-sm font-semibold cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Aceitando convite...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="size-4" />
                    <span>Aceitar Convite e Entrar na Equipe</span>
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
            <h2 className="text-lg font-bold text-foreground">
              Convite Inválido
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {errorMessage ?? "Este link expirou ou não é válido."}
            </p>
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
