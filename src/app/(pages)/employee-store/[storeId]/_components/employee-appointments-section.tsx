"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Check,
  ChevronRight,
  Sparkles,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_STORE_APPOINTMENTS } from "@/lib/mocks/store-appointments";
import type { StoreAppointment } from "@/app/(pages)/store/store-scheduling/_components/store-appointment-card";
import { EmployeeStatsCards } from "./employee-stats-cards";

interface EmployeeAppointmentsSectionProps {
  employeeName: string;
}

export function EmployeeAppointmentsSection({ employeeName }: EmployeeAppointmentsSectionProps) {
  const [appointments, setAppointments] = useState<StoreAppointment[]>(() => {
    const assigned = MOCK_STORE_APPOINTMENTS.filter(
      (a) =>
        a.employeeName.toLowerCase().includes(employeeName.toLowerCase()) ||
        employeeName.toLowerCase().includes(a.employeeName.toLowerCase())
    );
    if (assigned.length > 0) return assigned;
    return MOCK_STORE_APPOINTMENTS.slice(0, 5).map((a) => ({
      ...a,
      employeeName,
    }));
  });

  const [activeTab, setActiveTab] = useState<"all" | "confirmed" | "pending">("all");
  const [justUpdatedId, setJustUpdatedId] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, newStatus: StoreAppointment["status"]) => {
    setAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setJustUpdatedId(id);
    setTimeout(() => setJustUpdatedId(null), 2000);
  };

  const filtered = appointments.filter((item) => {
    if (activeTab === "all") return true;
    return item.status === activeTab;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. KPIs no topo da seção de atendimentos */}
      <EmployeeStatsCards appointments={appointments} />

      {/* 2. Cabeçalho da Lista + Filtros Estilizados */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Serviços Agendados da Loja
            </h2>
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {filtered.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Atendimentos direcionados a você pela administração da loja.
          </p>
        </div>

        {/* Abas modernas tipo segmented control */}
        <div className="flex items-center rounded-2xl border border-border bg-card p-1 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos ({appointments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("confirmed")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "confirmed"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Confirmados
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "pending"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pendentes
          </button>
        </div>
      </div>

      {/* 3. Lista de Cards de Atendimentos */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card p-12 text-center shadow-2xs">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
              <Calendar className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Não há atendimentos correspondentes ao filtro de status selecionado.
            </p>
          </div>
        ) : (
          filtered.map((appt) => {
            const isConfirmed = appt.status === "confirmed";
            const isPending = appt.status === "pending";
            const isJustUpdated = justUpdatedId === appt.id;

            return (
              <div
                key={appt.id}
                className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
              >
                {/* Linha de status na borda esquerda */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                    isConfirmed ? "bg-emerald-500" : isPending ? "bg-amber-500" : "bg-muted"
                  }`}
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pl-2">
                  
                  {/* Informações do Atendimento */}
                  <div className="flex items-start gap-4">
                    {/* Iniciais do Cliente */}
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/80 text-foreground font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                      {appt.clientName.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {appt.serviceName}
                        </h3>

                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3" />
                            Confirmado
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                            <AlertCircle className="size-3" />
                            Aguardando Confirmação
                          </span>
                        )}
                        {isJustUpdated && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary animate-in fade-in">
                            <Check className="size-3" />
                            Atualizado!
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <User className="size-3.5 text-primary" />
                          {appt.clientName}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-muted-foreground" />
                          <strong className="text-foreground">{appt.time}</strong> ({appt.duration} min)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-muted-foreground" />
                          {appt.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-md">{appt.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ações do Funcionário */}
                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/80 w-full sm:w-auto justify-end pl-2">
                    {isPending ? (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(appt.id, "confirmed")}
                        className="gap-2 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-4 py-2.5 shadow-sm cursor-pointer"
                      >
                        <CheckCircle2 className="size-4" />
                        <span>Confirmar Atendimento</span>
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(appt.id, "confirmed")}
                          className="gap-1.5 rounded-2xl border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-3.5 py-2 cursor-pointer"
                        >
                          <PlayCircle className="size-3.5" />
                          <span>Em Execução</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(appt.id, "confirmed")}
                          className="gap-1.5 rounded-2xl border-border hover:bg-muted text-muted-foreground text-xs font-medium px-3 py-2 cursor-pointer"
                        >
                          <span>Concluir</span>
                        </Button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
