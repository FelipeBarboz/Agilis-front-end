"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Mail,
  User,
  Phone,
  Pencil,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { mockUser } from "@/lib/mocks/user";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
      {/* Seta de voltar flutuante — padrão auth e serviço */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">
        
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Meu Perfil de Usuário</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Gerencie suas informações pessoais, endereços e preferências da sua conta
          </p>
        </div>

        {/* Card 1: Perfil do Usuário */}
        <div className="flex flex-col gap-6 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#006b49] text-4xl font-light text-white sm:h-28 sm:w-28 sm:text-5xl">
              {mockUser.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex flex-col items-center gap-2 pt-2 sm:items-start">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">{mockUser.name}</h2>
                <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Cliente Ativo
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="size-4 text-primary" />
                <span>São Paulo, SP</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 text-primary" />
                <span>{mockUser.email}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Chat e Endereços */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 mt-2">
            <Link
              href="/chats"
              className="flex items-center gap-3 rounded-2xl border p-4 transition-all hover:bg-muted/50 hover:border-primary/40 group"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <MessageSquare className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Chat</span>
                <span className="text-xs text-muted-foreground">Fale com prestadores</span>
              </div>
            </Link>
            
            <Link
              href="/addresses"
              className="flex items-center gap-3 rounded-2xl border p-4 transition-all hover:bg-muted/50 hover:border-primary/40 group"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <MapPin className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Endereços</span>
                <span className="text-xs text-muted-foreground">Locais de entrega</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Card 2: Informações pessoais */}
        <div className="flex flex-col gap-4 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Informações pessoais</h2>
              <p className="text-sm text-muted-foreground">Seus dados de contato e identificação</p>
            </div>
            <Link
              href="/profile/edit"
              className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
            >
              <Pencil className="size-3.5" />
              Editar
            </Link>
          </div>

          <div className="mt-2 divide-y border-t">
            <div className="flex items-center gap-3 py-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Nome</span>
                <span className="text-sm font-medium text-foreground">{mockUser.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">E-mail</span>
                <span className="text-sm font-medium text-foreground">{mockUser.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Telefone</span>
                <span className="text-sm font-medium text-foreground">{mockUser.phone ?? "Não informado"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Notificações, Configurações e Sair */}
        <div className="flex flex-col gap-3">
          <Link
            href="/notifications"
            className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-primary/40 group sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <Bell className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-bold text-foreground">Notificações</span>
              <span className="text-xs text-muted-foreground">Gerencie suas preferências de notificação</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/profile/settings"
            className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-primary/40 group sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <Settings className="size-5" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-bold text-foreground">Configurações</span>
              <span className="text-xs text-muted-foreground">Privacidade, segurança e preferências</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-destructive/40 group sm:p-5"
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