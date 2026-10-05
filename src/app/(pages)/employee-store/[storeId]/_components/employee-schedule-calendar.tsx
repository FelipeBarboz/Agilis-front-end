"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  Hourglass,
  XCircle,
  CalendarCheck2,
  Store,
} from "lucide-react";
import { StoreCalendar } from "@/app/(pages)/store/store-scheduling/_components/store-calendar";
import { MOCK_STORE_APPOINTMENTS } from "@/lib/mocks/store-appointments";
import type { StoreAppointment } from "@/app/(pages)/store/store-scheduling/_components/store-appointment-card";
import { today } from "@/app/(pages)/store/store-scheduling/_components/date-helper";

interface EmployeeScheduleCalendarProps {
  employeeName: string;
  storeId?: string;
}

type TabView = "mine" | "store";

const STATUS_STYLE = {
  confirmed: {
    label: "Confirmado",
    barClass: "bg-emerald-500",
    badgeClass:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    Icon: CheckCircle2,
  },
  pending: {
    label: "Pendente",
    barClass: "bg-amber-500",
    badgeClass:
      "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
    Icon: Hourglass,
  },
  cancelled: {
    label: "Cancelado",
    barClass: "bg-destructive",
    badgeClass: "bg-destructive/10 border-destructive/20 text-destructive",
    Icon: XCircle,
  },
  done: {
    label: "Concluido",
    barClass: "bg-muted-foreground",
    badgeClass: "bg-muted border-border text-muted-foreground",
    Icon: CheckCircle2,
  },
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year!, month! - 1, day!);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function AppointmentRow({
  appt,
  showEmployee,
}: {
  appt: StoreAppointment;
  showEmployee?: boolean;
}) {
  const cfg = STATUS_STYLE[appt.status];
  const Icon = cfg.Icon;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-xs flex gap-3">
      {/* barra de status lateral */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${cfg.barClass}`} />

      <div className="flex flex-col gap-1.5 flex-1 pl-1 min-w-0">
        {/* servico + badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-foreground">
            {appt.serviceName}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cfg.badgeClass}`}
          >
            <Icon className="size-3" />
            {cfg.label}
          </span>
        </div>

        {/* cliente */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="size-3.5 text-primary shrink-0" />
          <span className="font-medium text-foreground">{appt.clientName}</span>
        </div>

        {/* funcionario (somente na aba loja) */}
        {showEmployee && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Store className="size-3.5 text-primary shrink-0" />
            <span>Resp.: {appt.employeeName}</span>
          </div>
        )}

        {/* horario */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5 shrink-0" />
          <span>
            <strong className="text-foreground">{appt.time}</strong> &middot;{" "}
            {appt.duration} min
          </span>
        </div>

        {/* endereco */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{appt.address}</span>
        </div>
      </div>
    </div>
  );
}

export function EmployeeScheduleCalendar({
  employeeName,
}: EmployeeScheduleCalendarProps) {
  const [activeTab, setActiveTab] = useState<TabView>("mine");
  const [selectedDate, setSelectedDate] = useState<string>(today);

  // Escala do funcionario especifico
  const matched = MOCK_STORE_APPOINTMENTS.filter(
    (a) =>
      a.employeeName.toLowerCase().includes(employeeName.toLowerCase()) ||
      employeeName.toLowerCase().includes(a.employeeName.toLowerCase())
  );
  const myAppointments: StoreAppointment[] =
    matched.length > 0
      ? matched
      : MOCK_STORE_APPOINTMENTS.slice(0, 3).map((a) => ({ ...a, employeeName }));

  // Todos os agendamentos da loja
  const storeAppointments: StoreAppointment[] = MOCK_STORE_APPOINTMENTS;

  const source = activeTab === "mine" ? myAppointments : storeAppointments;

  const bookedDates = [...new Set(source.map((a) => a.date))];
  const dayAppointments = source
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const total = dayAppointments.length;
  const confirmed = dayAppointments.filter((a) => a.status === "confirmed").length;
  const pending = dayAppointments.filter((a) => a.status === "pending").length;

  return (
    <div className="flex flex-col gap-5">
      {/* Cabecalho da secao */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="size-5 text-primary" strokeWidth={1.5} />
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Calendario de Escala
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {activeTab === "mine"
              ? "Seus atendimentos agendados pela loja."
              : "Todos os atendimentos da loja no periodo."}
          </p>
        </div>

        {/* Abas: Minha Escala / Loja Geral */}
        <div className="flex items-center rounded-2xl border border-border bg-card p-1 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("mine")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "mine"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Minha Escala
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("store")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "store"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Loja Geral
          </button>
        </div>
      </div>

      {/* Calendario */}
      <StoreCalendar
        bookedDates={bookedDates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Stats do dia */}
      {total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 shadow-sm text-center">
            <CalendarCheck2 className="size-5 text-primary" strokeWidth={1.5} />
            <span className="text-lg font-bold text-foreground leading-none">
              {total}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              Total no dia
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 shadow-sm text-center">
            <Hourglass className="size-5 text-amber-500" strokeWidth={1.5} />
            <span className="text-lg font-bold text-foreground leading-none">
              {pending}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              Pendentes
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 shadow-sm text-center">
            <CheckCircle2 className="size-5 text-emerald-500" strokeWidth={1.5} />
            <span className="text-lg font-bold text-foreground leading-none">
              {confirmed}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              Confirmados
            </span>
          </div>
        </div>
      )}

      {/* Lista de agendamentos do dia */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground capitalize">
          {formatDate(selectedDate)}
        </h3>

        {dayAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card p-10 text-center shadow-2xs">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
              <Calendar className="size-5" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              Nenhum agendamento neste dia
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTab === "mine"
                ? "Voce nao tem atendimentos agendados para esta data."
                : "A loja nao possui atendimentos registrados para esta data."}
            </p>
          </div>
        ) : (
          dayAppointments.map((appt) => (
            <AppointmentRow
              key={appt.id}
              appt={appt}
              showEmployee={activeTab === "store"}
            />
          ))
        )}
      </div>
    </div>
  );
}
