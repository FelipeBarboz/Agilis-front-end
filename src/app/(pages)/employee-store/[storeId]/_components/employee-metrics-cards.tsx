"use client";

import { Calendar, Clock } from "lucide-react";
import type { StoreAppointment } from "@/app/(pages)/store/store-scheduling/_components/store-appointment-card";

interface EmployeeMetricsCardsProps {
  appointments: StoreAppointment[];
}

export function EmployeeMetricsCards({ appointments }: EmployeeMetricsCardsProps) {
  const total = appointments.length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const pending = appointments.filter((a) => a.status === "pending").length;

  // Próximo atendimento: o confirmado de menor horário, ou o primeiro da lista
  const nextAppt =
    [...appointments]
      .filter((a) => a.status === "confirmed" || a.status === "pending")
      .sort((a, b) => a.time.localeCompare(b.time))[0] ?? null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Card 1: Atendimentos Hoje */}
      <div className="flex flex-col gap-0 rounded-[22px] border border-border bg-card p-6 shadow-sm">
        {/* Ícone */}
        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-primary/10 text-primary mb-[18px]">
          <Calendar className="size-[18px]" />
        </div>

        {/* Rótulo */}
        <span className="text-[13.5px] font-medium text-muted-foreground leading-snug">
          Atendimentos Hoje
        </span>

        {/* Valor */}
        <span className="text-[44px] font-bold text-foreground leading-none tracking-[-0.02em] mt-1">
          {total}
        </span>

        {/* Linha de apoio */}
        <span className="text-[13px] text-muted-foreground mt-1">
          {confirmed} confirmados · {pending} aguardando
        </span>
      </div>

      {/* Card 2: Próximo Atendimento */}
      <div className="flex flex-col gap-0 rounded-[22px] border border-border bg-card p-6 shadow-sm">
        {/* Ícone */}
        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-primary/10 text-primary mb-[18px]">
          <Clock className="size-[18px]" />
        </div>

        {/* Rótulo */}
        <span className="text-[13.5px] font-medium text-muted-foreground leading-snug">
          Próximo Atendimento
        </span>

        {/* Valor */}
        <span className="text-[44px] font-bold text-foreground leading-none tracking-[-0.02em] mt-1">
          {nextAppt ? nextAppt.time : "--:--"}
        </span>

        {/* Linha de apoio */}
        <span className="text-[13px] text-muted-foreground mt-1 truncate">
          {nextAppt
            ? `${nextAppt.serviceName} · ${nextAppt.clientName}`
            : "Nenhum no momento"}
        </span>
      </div>
    </div>
  );
}
