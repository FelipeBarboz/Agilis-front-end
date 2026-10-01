"use client";

import { Calendar, Clock, CheckCircle2, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import type { StoreAppointment } from "@/app/(pages)/store/store-scheduling/_components/store-appointment-card";

interface EmployeeStatsCardsProps {
  appointments: StoreAppointment[];
}

export function EmployeeStatsCards({ appointments }: EmployeeStatsCardsProps) {
  const total = appointments.length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const nextAppt = appointments.find((a) => a.status === "confirmed") || appointments[0];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {/* Card 1: Total */}
      <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Atendimentos
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Calendar className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {total}
          </span>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Atribuídos para sua escala
          </p>
        </div>
      </div>

      {/* Card 2: Confirmados / Em Andamento */}
      <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Confirmados
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 tracking-tight">
            {confirmed}
          </span>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Prontos para atendimento
          </p>
        </div>
      </div>

      {/* Card 3: Pendentes */}
      <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs hover:border-amber-500/40 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Pendentes
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertCircle className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-300 tracking-tight">
            {pending}
          </span>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Aguardando sua confirmação
          </p>
        </div>
      </div>

      {/* Card 4: Próximo Horário */}
      <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Próximo Serviço
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Clock className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            {nextAppt ? `${nextAppt.time}` : "--:--"}
          </span>
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
            {nextAppt ? nextAppt.clientName : "Nenhum no momento"}
          </p>
        </div>
      </div>
    </div>
  );
}
