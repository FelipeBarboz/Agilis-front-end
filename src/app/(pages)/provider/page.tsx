"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  MessageSquare,
  CalendarDays,
  Plus,
  Store,
  Clock,
  Tag,
  User,
  Mail,
  Phone,
  Pencil,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { mockProfileServices } from "@/lib/mocks/profile-services";

export default function ProviderDashboardPage() {
  const router = useRouter();

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
      
      {/* Seta de voltar flutuante — padrão auth e serviço */}
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
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Meu Perfil de Prestador</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Gerencie seus serviços, agendamentos e crie sua loja
          </p>
        </div>

        {/* Card 1: Provider Profile */}
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#006b49] text-4xl font-light text-white sm:h-28 sm:w-28 sm:text-5xl shadow-sm">
              C
            </div>

            {/* Info */}
            <div className="flex flex-col items-center gap-2 pt-2 sm:items-start">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">Carlos Prestador</h2>
                <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Prestador Ativo
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="size-4 text-primary" />
                <span>Guarulhos e Região • Até 15 km</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="size-4 text-amber-500 fill-amber-500" />
                <span className="font-medium text-foreground">5.0</span>
                <span>(12 avaliações)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Chat, Agenda, Criar Loja */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 mt-2">
            <Link
              href="/provider/chat-corporative"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:bg-muted hover:border-primary/40 group"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <MessageSquare className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Chat</span>
                <span className="text-xs text-muted-foreground">Fale com clientes</span>
              </div>
            </Link>
            
            <Link
              href="/provider/scheduling-provider"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:bg-muted hover:border-primary/40 group"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <CalendarDays className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Agenda</span>
                <span className="text-xs text-muted-foreground">Seus horários</span>
              </div>
            </Link>

            <Link
              href="/provider/create-store"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:bg-muted hover:border-primary/40 group"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <Store className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Criar Loja</span>
                <span className="text-xs text-muted-foreground">CNPJ, URL e perfil</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Card 2: Seus serviços */}
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">Seus serviços</h2>
              <p className="text-sm text-muted-foreground">Gerencie seus serviços prestados e cadastre novos</p>
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
                  href={`/provider/edit-service/${service.id}`}
                  className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
                >
                  Editar
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Informações pessoais */}
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Informações pessoais</h2>
              <p className="text-sm text-muted-foreground">Seus dados de contato e identificação</p>
            </div>
            <Link
              href="/provider/edit"
              className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
            >
              <Pencil className="size-3.5" />
              Editar
            </Link>
          </div>

          <div className="mt-2 divide-y divide-border border-t border-border">
            <div className="flex items-center gap-3 py-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Nome</span>
                <span className="text-sm font-medium text-foreground">Carlos Prestador</span>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">E-mail</span>
                <span className="text-sm font-medium text-foreground">carlos.prestador@email.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Telefone</span>
                <span className="text-sm font-medium text-foreground">(11) 98765-4321</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Notificações, Configurações e Sair */}
        <div className="flex flex-col gap-3">
          <Link
            href="/provider/notifications"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted hover:border-primary/40 group sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <Bell className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-bold text-foreground">Notificações</span>
              <span className="text-xs text-muted-foreground">Gerencie alertas e notificações de prestador</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/provider/settings"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:bg-muted hover:border-primary/40 group sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <Settings className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-bold text-foreground">Configurações</span>
              <span className="text-xs text-muted-foreground">Privacidade, segurança e preferências da conta</span>
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
              <span className="text-xs text-muted-foreground">Encerrar sessão atual</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </main>
    </div>
  );
}
