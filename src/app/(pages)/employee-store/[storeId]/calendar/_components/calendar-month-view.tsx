"use client";

import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";
import {
  toDateKey,
  isSameDay,
  formatMonthYear,
  formatLongDate,
  DOW_UPPER,
} from "@/lib/utils/date-schedule-helpers";
import type { EmployeeCalendarAppointment } from "@/lib/mocks/employee-calendar-appointments";
import { CalendarStatsCards } from "./calendar-stats-cards";
import { CalendarAppointmentCard } from "./calendar-appointment-card";

interface CalendarMonthViewProps {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  appointments: EmployeeCalendarAppointment[];
  onGoToToday: () => void;
}

export function CalendarMonthView({
  selectedDate,
  onSelectDate,
  appointments,
  onGoToToday,
}: CalendarMonthViewProps) {
  const today = new Date();
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // Mudar de mês mantendo o mesmo dia (limitado ao último dia do novo mês)
  function handleMonthChange(step: number) {
    const newMonth = month + step;
    const targetYear = new Date(year, newMonth, 1).getFullYear();
    const targetMonth = new Date(year, newMonth, 1).getMonth();
    const maxDay = new Date(targetYear, targetMonth + 1, 0).getDate();
    const day = Math.min(selectedDate.getDate(), maxDay);
    onSelectDate(new Date(targetYear, targetMonth, day));
  }

  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Dom
  const totalDays = new Date(year, month + 1, 0).getDate();

  const isCurrentMonthAndToday =
    isSameDay(selectedDate, today) &&
    today.getFullYear() === year &&
    today.getMonth() === month;

  // Filtrar atendimentos do dia selecionado
  const selectedKey = toDateKey(selectedDate);
  const dayAppointments = appointments
    .filter((a) => a.date === selectedKey)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const confirmedCount = dayAppointments.filter((a) => a.status === "confirmed").length;
  const pendingCount = dayAppointments.filter((a) => a.status === "pending").length;
  const isSelectedToday = isSameDay(selectedDate, today);

  return (
    <div className="flex flex-col gap-5">
      {/* Card da grade do mês */}
      <section className="rounded-[22px] border border-border bg-card p-6 sm:px-7 sm:py-6 shadow-sm">
        {/* Navegação */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleMonthChange(-1)}
            aria-label="Mês anterior"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-foreground transition-colors hover:bg-primary/10 cursor-pointer"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <h2 className="text-base font-bold text-foreground text-center" aria-live="polite">
              {formatMonthYear(selectedDate)}
            </h2>
            {!isCurrentMonthAndToday && (
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
            onClick={() => handleMonthChange(1)}
            aria-label="Próximo mês"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-foreground transition-colors hover:bg-primary/10 cursor-pointer"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Cabeçalho DOM - SÁB */}
        <div className="grid grid-cols-7 text-center">
          {DOW_UPPER.map((dow) => (
            <span
              key={dow}
              className="py-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
            >
              {dow}
            </span>
          ))}
        </div>

        {/* Células dos dias */}
        <div className="grid grid-cols-7">
          {/* Espaços vazios no início */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <span key={`blank-${i}`} aria-hidden="true" />
          ))}

          {/* Dias do mês */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateObj = new Date(year, month, dayNum);
            const dateKey = toDateKey(dateObj);
            const isDayToday = isSameDay(dateObj, today);
            const isSelected = isSameDay(dateObj, selectedDate);
            const hasAppt = appointments.some((a) => a.date === dateKey);

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => onSelectDate(dateObj)}
                aria-pressed={isSelected}
                aria-label={`${dayNum} de ${formatMonthYear(selectedDate)}${
                  hasAppt ? ", com atendimentos" : ""
                }`}
                className="group relative flex h-12 items-center justify-center cursor-pointer p-0"
              >
                <span
                  className={[
                    "flex h-[34px] w-[34px] items-center justify-center rounded-full text-sm font-medium transition-colors select-none",
                    isSelected
                      ? "bg-primary text-white font-semibold shadow-xs"
                      : isDayToday
                      ? "border-[1.5px] border-primary text-primary font-semibold"
                      : "text-foreground group-hover:bg-primary/10",
                  ].join(" ")}
                >
                  {dayNum}
                </span>

                {/* Pontinho de atendimentos */}
                {hasAppt && (
                  <span
                    className={[
                      "absolute left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                      isSelected ? "bg-white bottom-[7px]" : "bg-primary bottom-[3px]",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Métricas */}
      <CalendarStatsCards
        total={dayAppointments.length}
        pending={pendingCount}
        confirmed={confirmedCount}
        totalLabel={isSelectedToday ? "Total hoje" : "Total no dia"}
      />

      {/* Lista de Atendimentos do Dia */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[17px] font-bold text-foreground mt-1 flex items-baseline flex-wrap gap-2">
          Atendimentos do dia
          <small className="text-[13.5px] font-normal text-muted-foreground">
            {formatLongDate(selectedDate)}
          </small>
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
