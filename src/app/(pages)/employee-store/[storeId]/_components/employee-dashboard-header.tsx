"use client";

import Link from "next/link";
import {
  Store,
  Shield,
  ArrowRight,
  UserCheck,
  Sparkles,
  CalendarCheck,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PermissionId } from "@/lib/mocks/positions";

interface EmployeeDashboardHeaderProps {
  storeName: string;
  storeInitials: string;
  storeCategory: string;
  storeId: string;
  employeeName: string;
  positionTitle: string;
  permissions: PermissionId[];
}

export function EmployeeDashboardHeader({
  storeName,
  storeInitials,
  storeCategory,
  storeId,
  employeeName,
  positionTitle,
  permissions,
}: EmployeeDashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      {/* Top: Identidade e Ação Principal */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Loja + Funcionário */}
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="relative flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-extrabold text-2xl sm:text-3xl shadow-sm">
            {storeInitials}
            <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-card" title="Em expediente ativo">
              <span className="size-2 rounded-full bg-white" />
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Store className="size-3.5" />
                Painel Operacional
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Turno Ativo
              </span>
            </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {storeName}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span>{storeCategory}</span>
                <span>•</span>
                <div className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <UserCheck className="size-4 text-primary" />
                  <span>{employeeName}</span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-primary">
                    {positionTitle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botão para Perfil da Loja */}
          <div className="shrink-0 self-start sm:self-center">
            <Link
              href={`/store/store-profile?asEmployee=true&storeId=${encodeURIComponent(storeId)}&positionTitle=${encodeURIComponent(positionTitle)}`}
            >
              <Button
                className="gap-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <span>Ver Perfil da Loja</span>
                <ExternalLink className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </Link>
          </div>

        </div>

        {/* Barra de Permissões com visual refinado */}
        <div className="flex flex-col gap-2.5 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            <span>Permissões habilitadas para seu perfil:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {permissions.map((perm) => (
              <span
                key={perm}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
              >
                <Shield className="size-3 text-primary" />
                {perm === "manage_appointments" && "Gerenciar Atendimentos"}
                {perm === "access_chats" && "Atendimento no Chat"}
                {perm === "access_reports" && "Visualizar Relatórios"}
                {perm === "store_settings" && "Configurações da Loja"}
              </span>
            ))}
          </div>
        </div>
    </div>
  );
}
