"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Briefcase,
  Settings,
  CalendarDays,
  Clock,
  Tag,
  Plus,
  User,
  ArrowRight,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { mockProfileServices } from "@/lib/mocks/profile-services";
import { mockProfileAppointments } from "@/lib/mocks/profile-appointments";

export default function StoreProfilePage() {
  const router = useRouter();

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      
      {/* Seta de voltar flutuante — padrão auth, serviço, provider e perfil */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Perfil da Loja</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Gerencie sua loja, agendamentos, serviços e equipe
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

          {/* Action Buttons: Funcionários, Cargos, Configurações */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 mt-2">
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

            <Link
              href="/store/store-settings"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card/50 p-4 transition-all hover:bg-muted hover:border-primary/40 group"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <Settings className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Configurações</span>
                <span className="text-xs text-muted-foreground">Perfil da empresa</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Card 2: Serviços da Loja */}
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">Serviços da Loja</h2>
              <p className="text-sm text-muted-foreground">Gerencie os serviços oferecidos e seus valores</p>
            </div>
            
            <Link
              href="/provider/add-service"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/20"
            >
              <Plus className="size-4" />
              Novo serviço
            </Link>
          </div>

          <div className="mt-2 divide-y divide-border border-t border-border">
            {mockProfileServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-foreground">{service.name}</span>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                      <Tag className="size-3.5" />
                      {service.price}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {service.duration}
                    </span>
                  </div>
                </div>
                <Link
                  href="/provider/add-service"
                  className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
                >
                  Editar
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Agendamentos */}
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Agendamentos</h2>
              <p className="text-sm text-muted-foreground">Atendimentos marcados para sua loja</p>
            </div>
            <Link
              href="/store/store-scheduling"
              className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
            >
              Ver agenda
              <ArrowRight className="size-3.5" />
            </Link>
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

        {/* Card 4: Gestão e Sair */}
        <div className="flex flex-col gap-3">
          <Link
            href="/store/store-scheduling"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted hover:border-primary/40 group sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <CalendarDays className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-bold text-foreground">Agenda da Loja</span>
              <span className="text-xs text-muted-foreground">Visualize e gerencie a grade de horários da empresa</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>

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

          <Link
            href="/login"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted hover:border-destructive/40 group sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive group-hover:scale-105 transition-transform">
              <LogOut className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-bold text-destructive">Sair</span>
              <span className="text-xs text-muted-foreground">Encerrar sessão da loja</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </main>
    </div>
  );
}
