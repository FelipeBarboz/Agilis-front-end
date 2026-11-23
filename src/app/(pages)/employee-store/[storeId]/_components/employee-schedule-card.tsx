"use client";

import Link from "next/link";
import { today } from "@/app/(pages)/store/store-scheduling/_components/date-helper";
import type { StoreAppointment } from "@/app/(pages)/store/store-scheduling/_components/store-appointment-card";

// ─── Tipos de status ───────────────────────────────────────────────
type AppointmentStatus = StoreAppointment["status"];

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; solidBg: string; solidText: string; outlineBorder: string; outlineText: string; solid: boolean }
> = {
  confirmed: {
    label: "Confirmado",
    solidBg: "bg-primary",
    solidText: "text-primary-foreground",
    outlineBorder: "",
    outlineText: "",
    solid: true,
  },
  pending: {
    label: "Aguardando Confirmação",
    solidBg: "bg-amber-500/10",
    solidText: "text-amber-700 dark:text-amber-300",
    outlineBorder: "border border-amber-500/30",
    outlineText: "text-amber-700 dark:text-amber-300",
    solid: false,
  },
  cancelled: {
    label: "Cancelado",
    solidBg: "bg-destructive/10",
    solidText: "text-destructive",
    outlineBorder: "border border-destructive/20",
    outlineText: "text-destructive",
    solid: false,
  },
  done: {
    label: "Concluído",
    solidBg: "bg-muted",
    solidText: "text-muted-foreground",
    outlineBorder: "border border-border",
    outlineText: "text-muted-foreground",
    solid: false,
  },
};

// ─── Escala semanal (Seg–Sex) ───────────────────────────────────────
// TODO: substituir por fonte de dados real de escala do funcionário quando disponível.
const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

interface WeekDay {
  dayName: string;
  dayNumber: number;
  dateStr: string; // YYYY-MM-DD
  shift: string | null; // null = folga
}

function buildWeekDays(): WeekDay[] {
  const now = new Date();
  const currentDow = now.getDay(); // 0=Dom
  // Segunda-feira da semana atual
  const mondayOffset = currentDow === 0 ? -6 : 1 - currentDow;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  const days: WeekDay[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    days.push({
      dayName: DAYS_PT[d.getDay()] ?? "",
      dayNumber: d.getDate(),
      dateStr: `${yyyy}-${mm}-${dd}`,
      // TODO: substituir por dados reais da escala
      shift: "08:00 – 18:00",
    });
  }
  return days;
}

// ─── Props ──────────────────────────────────────────────────────────
interface EmployeeScheduleCardProps {
  appointments: StoreAppointment[];
  storeId: string;
}

// ─── Componente principal ────────────────────────────────────────────
export function EmployeeScheduleCard({ appointments, storeId }: EmployeeScheduleCardProps) {
  const weekDays = buildWeekDays();
  const todayAppts = appointments
    .filter((a) => a.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="flex flex-col gap-6 rounded-[22px] border border-border bg-card p-8 shadow-sm">
      {/* ── Cabeçalho: Minha Escala ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-foreground leading-tight">Minha escala</h2>
          <p className="text-[14px] text-muted-foreground mt-0.5">Sua semana de trabalho</p>
        </div>
        <span className="self-start rounded-[8px] bg-muted px-3 py-1.5 text-[12.5px] font-medium text-foreground whitespace-nowrap">
          Hoje: 08:00 – 18:00
        </span>
      </div>

      {/* ── Faixa de 5 dias ── */}
      <div className="grid grid-cols-3 gap-[10px] sm:grid-cols-5">
        {weekDays.map((day) => {
          const isToday = day.dateStr === today;
          return (
            <div
              key={day.dateStr}
              className={[
                "flex flex-col items-center gap-1 rounded-[14px] border px-[14px] py-3 transition-colors",
                isToday
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground",
              ].join(" ")}
            >
              <span
                className={[
                  "text-[12px] font-medium",
                  isToday ? "text-primary" : "text-muted-foreground",
                ].join(" ")}
              >
                {day.dayName}
              </span>
              <span
                className={[
                  "text-[20px] font-bold leading-none",
                  isToday ? "text-primary" : "text-foreground",
                ].join(" ")}
              >
                {day.dayNumber}
              </span>
              <span
                className={[
                  "text-[12px] text-center leading-tight",
                  isToday ? "text-primary font-medium" : "text-muted-foreground",
                ].join(" ")}
              >
                {day.shift ?? (
                  <span className="text-muted-foreground">–</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Divisor ── */}
      <div className="border-t border-border" />

      {/* ── Agenda de Hoje ── */}
      <div>
        <div className="mb-1">
          <h2 className="text-[20px] font-bold text-foreground">Agenda de Hoje</h2>
          <p className="text-[14px] text-muted-foreground mt-0.5">
            Atendimentos atribuídos a você
          </p>
        </div>

        {todayAppts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-border/80 bg-muted/30 p-10 text-center mt-4">
            <p className="text-sm font-semibold text-foreground">Nenhum atendimento hoje</p>
            <p className="text-xs text-muted-foreground mt-1">
              Não há atendimentos atribuídos para você nesta data.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border mt-4" role="list">
            {todayAppts.map((appt, idx) => {
              const cfg = STATUS_CONFIG[appt.status];
              const isLast = idx === todayAppts.length - 1;
              const row = (
                <li
                  key={appt.id}
                  className={[
                    "flex items-center gap-4 py-4 focus-within:outline-none",
                    isLast ? "" : "",
                  ].join(" ")}
                >
                  {/* Horário */}
                  <span className="w-12 shrink-0 text-[14px] font-semibold text-foreground tabular-nums">
                    {appt.time}
                  </span>

                  {/* Serviço + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-foreground truncate">
                      {appt.serviceName}
                    </p>
                    <p className="text-[13px] text-muted-foreground truncate mt-0.5">
                      {appt.clientName} · {appt.duration} min · {appt.address}
                    </p>
                  </div>

                  {/* Status pill */}
                  <span
                    className={[
                      "shrink-0 rounded-[9px] px-4 py-1.5 text-[12.5px] font-semibold leading-none whitespace-nowrap",
                      cfg.solid
                        ? `${cfg.solidBg} ${cfg.solidText}`
                        : `${cfg.solidBg} ${cfg.outlineBorder} ${cfg.solidText}`,
                    ].join(" ")}
                  >
                    {cfg.label}
                  </span>
                </li>
              );

              // Tornar a linha clicável para a rota de detalhes (escala)
              return (
                <Link
                  key={appt.id}
                  href={`/employee-store/${storeId}/calendar`}
                  className="block hover:bg-muted/50 -mx-2 px-2 rounded-[10px] transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label={`Ver detalhes: ${appt.serviceName} às ${appt.time}`}
                >
                  {row}
                </Link>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
