"use client";

import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";
import {
  toDateKey,
  isSameDay,
  addDays,
  getSundayWeekStart,
  formatWeekRangeTitle,
  formatLongDate,
  DOW_UPPER,
} from "@/lib/utils/date-schedule-helpers";
import type { EmployeeCalendarAppointment } from "@/lib/mocks/employee-calendar-appointments";
import { CalendarStatsCards } from "./calendar-stats-cards";
import { CalendarAppointmentCard } from "./calendar-appointment-card";

interface CalendarWeekViewProps {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  appointments: EmployeeCalendarAppointment[];
  onGoToToday: () => void;
}

export function CalendarWeekView({
  selectedDate,
  onSelectDate,
  appointments,
  onGoToToday,
}: CalendarWeekViewProps) {
  const today = new Date();
  const weekStart = getSundayWeekStart(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = addDays(weekStart, 6);

  const currentWeekStart = getSundayWeekStart(today);
  const isCurrentWeek = isSameDay(weekStart, currentWeekStart);

  function handleWeekNav(dir: number) {
    onSelectDate(addDays(selectedDate, dir * 7));
  }

  function handleSelectDayAndScroll(day: Date) {
    onSelectDate(day);
    const element = document.getElementById(`week-group-${toDateKey(day)}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Agrupar atendimentos da semana
  const weekKeys = new Set(weekDays.map(toDateKey));
  const weekAppointments = appointments
    .filter((a) => weekKeys.has(a.date))
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  const confirmedCount = weekAppointments.filter((a) => a.status === "confirmed").length;
  const pendingCount = weekAppointments.filter((a) => a.status === "pending").length;

  return (
    <div className="flex flex-col gap-5">
      {/* Card da semana + faixa de 7 dias */}
      <section className="rounded-[22px] border border-border bg-card p-6 sm:px-7 sm:py-6 shadow-sm">
        {/* Navegação */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleWeekNav(-1)}
            aria-label="Semana anterior"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-foreground transition-colors hover:bg-primary/10 cursor-pointer"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <h2 className="text-base font-bold text-foreground text-center" aria-live="polite">
              {formatWeekRangeTitle(weekStart, weekEnd)}
            </h2>
            {!isCurrentWeek && (
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
            onClick={() => handleWeekNav(1)}
            aria-label="Próxima semana"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] text-foreground transition-colors hover:bg-primary/10 cursor-pointer"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Faixa de 7 dias */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((d, idx) => {
            const dateKey = toDateKey(d);
            const isDayToday = isSameDay(d, today);
            const isSelected = isSameDay(d, selectedDate);
            const dayAppts = appointments.filter((a) => a.date === dateKey);
            const countText =
              dayAppts.length > 0
                ? `${dayAppts.length} atend.`
                : "—";

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => handleSelectDayAndScroll(d)}
                aria-pressed={isSelected}
                aria-label={`${d.getDate()} de ${formatLongDate(d)}, ${countText}`}
                className={[
                  "flex flex-col items-center gap-0.5 rounded-[14px] border p-2 sm:py-2.5 sm:px-1 transition-colors cursor-pointer text-center",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted/50",
                ].join(" ")}
              >
                <small className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {DOW_UPPER[idx]}
                </small>
                <b
                  className={[
                    "text-[18px] font-bold leading-tight tabular-nums",
                    isDayToday ? "text-primary" : "text-foreground",
                  ].join(" ")}
                >
                  {d.getDate()}
                </b>
                <span className="text-[11.5px] text-muted-foreground hidden sm:block whitespace-nowrap">
                  {countText}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Métricas da semana */}
      <CalendarStatsCards
        total={weekAppointments.length}
        pending={pendingCount}
        confirmed={confirmedCount}
        totalLabel="Total na semana"
      />

      {/* Título e Grupos de Atendimentos */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[17px] font-bold text-foreground mt-1">
          Atendimentos da semana
        </h3>

        {weekAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed border-border bg-card p-7 text-center text-muted-foreground shadow-xs">
            <CalendarCheck className="size-7 text-primary" />
            <b className="font-semibold text-foreground text-sm">
              Nenhum atendimento nesta semana
            </b>
            <span className="text-xs sm:text-[13px] max-w-sm">
              Quando houver agendamentos atribuídos a você, eles aparecem aqui.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {weekDays.map((d) => {
              const dateKey = toDateKey(d);
              const dayAppts = appointments
                .filter((a) => a.date === dateKey)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              if (dayAppts.length === 0) return null;

              return (
                <section
                  key={dateKey}
                  id={`week-group-${dateKey}`}
                  className="flex flex-col gap-2.5 scroll-mt-20"
                >
                  <h4 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {formatLongDate(d).toUpperCase()}
                  </h4>
                  <div className="flex flex-col gap-3">
                    {dayAppts.map((appt) => (
                      <CalendarAppointmentCard key={appt.id} appointment={appt} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
