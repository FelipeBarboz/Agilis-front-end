"use client";

import Link from "next/link";
import { UserCheck, Clock, CheckCircle, ArrowRight, ShieldCheck, MailCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserStoreAssociation } from "@/lib/mocks/invites";

interface StoreCardItemProps {
  association: UserStoreAssociation;
  onApprovePending?: (id: string) => void;
}

export function StoreCardItem({ association, onApprovePending }: StoreCardItemProps) {
  const isOwner = association.role === "owner";
  const isActive = association.status === "active";
  const isPending = association.status === "pending";

  return (
    <div className="flex flex-col justify-between gap-5 rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs hover:border-primary/30 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Logo / Iniciais e dados */}
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-xs">
            {association.storeInitials}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">
                {association.storeName}
              </h3>
              {isOwner ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <ShieldCheck className="size-3.5" />
                  Proprietário
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                  <UserCheck className="size-3.5 text-primary" />
                  {association.positionTitle}
                </span>
              )}

              {/* Status Badge */}
              {isPending && (
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                  <Clock className="size-3" />
                  Aguardando verificação por e-mail
                </span>
              )}
              {isActive && !isOwner && (
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="size-3" />
                  Verificado e Ativo
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-0.5">
              Categoria: {association.storeCategory}
            </p>

            {/* Permissões do cargo */}
            {!isOwner && association.permissions.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground mr-1">Permissões:</span>
                {association.permissions.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    <Shield className="size-3 text-primary/70" />
                    {p === "manage_appointments" && "Atendimentos"}
                    {p === "access_chats" && "Chats"}
                    {p === "access_reports" && "Relatórios"}
                    {p === "store_settings" && "Configurações"}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mensagem informativa quando pendente */}
        {isPending && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3 sm:max-w-xs text-xs text-amber-900 dark:text-amber-200">
            <p className="font-semibold flex items-center gap-1.5 mb-1">
              <MailCheck className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
              Confirmação pendente
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              O provedor recebeu um e-mail para validar sua contratação como {association.positionTitle}.
            </p>
            {onApprovePending && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onApprovePending(association.id)}
                className="mt-2.5 w-full text-xs font-medium border-amber-500/30 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300 h-8 cursor-pointer"
              >
                Aprovar agora (simular e-mail)
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
        {isOwner && (
          <Link href="/store/store-profile">
            <Button className="gap-2 rounded-xl text-xs font-semibold cursor-pointer">
              <span>Acessar Painel da Loja</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        )}

        {!isOwner && isActive && (
          <Link href={`/employee-store/${association.storeId}?positionTitle=${encodeURIComponent(association.positionTitle)}`}>
            <Button className="gap-2 rounded-xl text-xs font-semibold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
              <span>Acessar Área do Funcionário</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        )}

        {!isOwner && isPending && (
          <Button
            disabled
            variant="outline"
            className="gap-2 rounded-xl text-xs font-medium cursor-not-allowed opacity-60"
          >
            <Clock className="size-3.5" />
            <span>Aguardando autorização</span>
          </Button>
        )}
      </div>
    </div>
  );
}
