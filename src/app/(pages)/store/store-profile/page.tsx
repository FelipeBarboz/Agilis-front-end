"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Briefcase,
  Settings,
  Clock,
  User,
  ArrowRight,
  LogOut,
  ChevronRight,
  AlertTriangle,
  ShieldAlert,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockProfileAppointments } from "@/lib/mocks/profile-appointments";
import { ServicesList } from "./_components/services-list";
import { getEmployeeStoresFromStorage } from "@/lib/mocks/invites";
import type { PermissionId } from "@/lib/mocks/positions";

function StoreProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isEmployeeParam = searchParams.get("asEmployee") === "true";
  const storeIdParam = searchParams.get("storeId");
  const positionTitleParam = searchParams.get("positionTitle");

  const [isEmployee, setIsEmployee] = useState(isEmployeeParam);
  const [positionTitle, setPositionTitle] = useState(positionTitleParam || "Funcionário");
  const [permissions, setPermissions] = useState<PermissionId[]>(["manage_appointments"]);

  useEffect(() => {
    if (isEmployeeParam) {
      setIsEmployee(true);
      if (positionTitleParam) setPositionTitle(positionTitleParam);

      // Busca permissões no storage se disponível
      const list = getEmployeeStoresFromStorage();
      const assoc = list.find((a) => a.storeId === storeIdParam);
      if (assoc) {
        setPermissions(assoc.permissions);
        setPositionTitle(assoc.positionTitle);
      }
    }
  }, [isEmployeeParam, storeIdParam, positionTitleParam]);

  const canManageSettings = !isEmployee || permissions.includes("store_settings");
  const canManageAppointments = !isEmployee || permissions.includes("manage_appointments");

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      
      {/* Seta de voltar flutuante */}
      <button
        type="button"
        onClick={() => {
          if (isEmployee && storeIdParam) {
            router.push(`/employee-store/${storeIdParam}`);
          } else {
            router.back();
          }
        }}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        
        {/* Banner de Restrição do Modo Funcionário */}
        {isEmployee && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
                <ShieldAlert className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    Modo Funcionário ({positionTitle})
                  </span>
                  <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-200">
                    Acesso Restrito
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Você está visualizando o perfil da loja com permissões limitadas ao cargo de {positionTitle}.
                </p>
              </div>
            </div>

            {storeIdParam && (
              <Link href={`/employee-store/${storeIdParam}`} className="shrink-0 self-end sm:self-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-amber-500/40 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 text-xs font-semibold cursor-pointer"
                >
                  Voltar ao Painel
                </Button>
              </Link>
            )}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Perfil da Loja</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {isEmployee
              ? "Informações e serviços da loja em que você atua"
              : "Gerencie sua loja, agendamentos, serviços e equipe"}
          </p>
        </div>

        {/* Card 1: Perfil da Loja */}
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#006b49] text-4xl font-light text-white sm:h-28 sm:w-28 sm:text-5xl shadow-sm">
              CP
            </div>

            {/* Info */}
            <div className="flex flex-col items-center gap-2 pt-2 sm:items-start">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">Carlão Piscinas</h2>
                <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Loja Ativa
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="size-4 text-primary" />
                <span>Guarulhos e Região • CNPJ 12.345.678/0001-90</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="size-4 text-amber-500 fill-amber-500" />
                <span className="font-medium text-foreground">4.9</span>
                <span>(28 avaliações)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Funcionários, Cargos */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 mt-2">
            {canManageSettings ? (
              <Link
                href="/store/employees"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 p-4 transition-all hover:bg-muted hover:border-primary/40 group"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <Users className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">Funcionários</span>
                  <span className="text-xs text-muted-foreground">Gerencie sua equipe</span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/40 p-4 opacity-75 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Users className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">Funcionários</span>
                    <span className="text-[11px] text-muted-foreground">Restrito ao proprietário</span>
                  </div>
                </div>
                <Lock className="size-4 text-muted-foreground" />
              </div>
            )}
            
            {canManageSettings ? (
              <Link
                href="/store/store-positions"
                className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 p-4 transition-all hover:bg-muted hover:border-primary/40 group"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <Briefcase className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">Cargos</span>
                  <span className="text-xs text-muted-foreground">Funções e permissões</span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/40 p-4 opacity-75 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Briefcase className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-muted-foreground">Cargos</span>
                    <span className="text-[11px] text-muted-foreground">Restrito ao proprietário</span>
                  </div>
                </div>
                <Lock className="size-4 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Serviços da Loja (Restrito a somente leitura se for funcionário sem store_settings) */}
        <ServicesList isRestricted={!canManageSettings} />

        {/* Card 3: Agendamentos */}
        {canManageAppointments ? (
          <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Agendamentos</h2>
                <p className="text-sm text-muted-foreground">Atendimentos marcados para sua loja</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/store/store-scheduling?delay=true"
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors hover:bg-amber-500/20"
                >
                  <AlertTriangle className="size-3.5" />
                  Avisar Atraso
                </Link>
                <Link
                  href="/store/store-scheduling"
                  className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
                >
                  Ver agenda
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            <div className="mt-2 divide-y divide-border border-t border-border">
              {mockProfileAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-foreground flex items-center gap-2">
                      <User className="size-3.5 text-primary" />
                      {appt.client}
                    </span>
                    <span className="text-xs text-muted-foreground">{appt.service}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2 py-0.5">
                      {appt.date}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3.5" />
                      {appt.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Lock className="size-5 text-muted-foreground" />
              <div>
                <h2 className="text-base font-bold text-foreground">Agendamentos Gerais</h2>
                <p className="text-xs text-muted-foreground">Seu cargo não possui permissão para gerenciar a agenda geral da loja.</p>
              </div>
            </div>
          </div>
        )}

        {/* Card 4: Gestão e Sair */}
        <div className="flex flex-col gap-3">
          {canManageSettings ? (
            <Link
              href="/store/store-settings"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted hover:border-primary/40 group sm:p-5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <Settings className="size-5" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-bold text-foreground">Configurações da Loja</span>
                <span className="text-xs text-muted-foreground">CNPJ, horário de funcionamento e dados da empresa</span>
              </div>
              <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/40 p-4 opacity-75 cursor-not-allowed sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Settings className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-muted-foreground">Configurações da Loja</span>
                  <span className="text-xs text-muted-foreground">Requer permissão de administrador</span>
                </div>
              </div>
              <Lock className="size-5 text-muted-foreground" />
            </div>
          )}

          <Link
            href="/stores"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted group sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <ArrowLeft className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-bold text-foreground">Trocar de Loja</span>
              <span className="text-xs text-muted-foreground">Voltar para a lista de todas as lojas</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted hover:border-destructive/40 group sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive group-hover:scale-105 transition-transform">
              <LogOut className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-bold text-destructive">Sair</span>
              <span className="text-xs text-muted-foreground">Encerrar sessão</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </main>
    </div>
  );
}

export default function StoreProfilePage() {
  return (
    <Suspense fallback={null}>
      <StoreProfileContent />
    </Suspense>
  );
}
