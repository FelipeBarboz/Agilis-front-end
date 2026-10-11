"use client";

import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";
import {
  toDateKey,
  isSameDay,
  addDays,
  formatLongDate,
} from "@/lib/utils/date-schedule-helpers";
import type { EmployeeCalendarAppointment } from "@/lib/mocks/employee-calendar-appointments";
import { CalendarStatsCards } from "./calendar-stats-cards";
import { CalendarAppointmentCard } from "./calendar-appointment-card";

interface CalendarDayViewProps {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  appointments: EmployeeCalendarAppointment[];
  onGoToToday: () => void;
}

export function CalendarDayView({
  selectedDate,
  onSelectDate,
  appointments,
  onGoToToday,
}: CalendarDayViewProps) {
  const today = new Date();
  const isSelectedToday = isSameDay(selectedDate, today);

  function handleDayNav(dir: number) {
    onSelectDate(addDays(selectedDate, dir));
  }

  const selectedKey = toDateKey(selectedDate);
  const dayAppointments = appointments
    .filter((a) => a.date === selectedKey)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const confirmedCount = dayAppointments.filter((a) => a.status === "confirmed").length;
  const pendingCount = dayAppointments.filter((a) => a.status === "pending").length;

  return (
    <div className="flex flex-col gap-5">
      {/* Card com navegação do dia */}
      <section className="rounded-[22px] border border-border bg-card p-6 sm:px-7 sm:py-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleDayNav(-1)}
            aria-label="Dia anterior"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-foreground transition-colors hover:bg-primary/10 cursor-pointer"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <h2 className="text-base font-bold text-foreground text-center" aria-live="polite">
              {formatLongDate(selectedDate, true)}
            </h2>
            {!isSelectedToday && (
              <button
                type="button"
                onClick={onGoToToday}
                className="rounded-full border border-border bg-card px-3.5 py-1 text-[12.5px] font-semibold text-primary transition-colors hover:bg-primary/10 cursor-pointer shadow-xs"
              >
                Voltar para hoje
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleDayNav(1)}
            aria-label="Próximo dia"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-foreground transition-colors hover:bg-primary/10 cursor-pointer"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </section>

      {/* Métricas */}
      <CalendarStatsCards
        total={dayAppointments.length}
        pending={pendingCount}
        confirmed={confirmedCount}
        totalLabel={isSelectedToday ? "Total hoje" : "Total no dia"}
      />

      {/* Título e Lista de Agendamentos */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[17px] font-bold text-foreground mt-1">
          Agendamentos do dia
        </h3>

        {dayAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed border-border bg-card p-7 text-center text-muted-foreground shadow-xs">
            <CalendarCheck className="size-7 text-primary" />
            <b className="font-semibold text-foreground text-sm">
              Nenhum atendimento neste dia
            </b>
            <span className="text-xs sm:text-[13px] max-w-sm">
              Quando houver agendamentos atribuídos a você, eles aparecem aqui.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {dayAppointments.map((appt) => (
              <CalendarAppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
