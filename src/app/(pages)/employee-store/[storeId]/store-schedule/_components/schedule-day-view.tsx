"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  isSameDay,
  addDays,
  getMondayWeekStart,
  formatLongDate,
  DOW_SHORT,
  pad2,
} from "@/lib/utils/date-schedule-helpers";
import type { StoreTeamMember } from "@/lib/mocks/store-roster";
import { ScheduleStatsCards } from "./schedule-stats-cards";
import { ScheduleLegend } from "./schedule-legend";

interface ScheduleDayViewProps {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  team: StoreTeamMember[];
  onGoToToday: () => void;
}

export function ScheduleDayView({
  selectedDate,
  onSelectDate,
  team,
  onGoToToday,
}: ScheduleDayViewProps) {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Atualizar relógio a cada minuto para o marcador "Agora"
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  const isSelectedToday = isSameDay(selectedDate, today);

  const weekStart = getMondayWeekStart(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  function handleDayNav(dir: number) {
    onSelectDate(addDays(selectedDate, dir));
  }

  const dayOfWeek = selectedDate.getDay();

  // Membros trabalhando no dia selecionado
  const workingMembers = team.filter((m) => m.shifts[dayOfWeek] !== null);
  const offCount = team.length - workingMembers.length;

  // Calcular cobertura de horário
  const coverageText = (() => {
    if (workingMembers.length === 0) return "—";
    const startHours = workingMembers.map((m) => m.shifts[dayOfWeek]![0]);
    const endHours = workingMembers.map((m) => m.shifts[dayOfWeek]![1]);
    const minStart = Math.min(...startHours);
    const maxEnd = Math.max(...endHours);
    return `${pad2(minStart)}:00 – ${pad2(maxEnd)}:00`;
  })();

  // Faixa de horas dinâmica (padrão 06h a 20h, expande se necessário)
  const baseStart = 6;
  const baseEnd = 20;
  let axisStart = baseStart;
  let axisEnd = baseEnd;

  workingMembers.forEach((m) => {
    const shift = m.shifts[dayOfWeek]!;
    if (shift[0] < axisStart) axisStart = Math.floor(shift[0]);
    if (shift[1] > axisEnd) axisEnd = Math.ceil(shift[1]);
  });

  const totalSlots = axisEnd - axisStart;
  const hourSlots = Array.from({ length: totalSlots }, (_, i) => axisStart + i);

  // Helper para porcentagem no eixo
  function pct(h: number) {
    return ((h - axisStart) / totalSlots) * 100;
  }

  // Marcador "Agora"
  const currentFractionalHour = currentTime.getHours() + currentTime.getMinutes() / 60;
  const isLive =
    isSelectedToday &&
    currentFractionalHour >= axisStart &&
    currentFractionalHour <= axisEnd;

  return (
    <div className="flex flex-col gap-5">
      {/* Card 1: Navegação do dia + faixa dos 7 dias */}
      <section className="rounded-[22px] border border-border bg-card p-6 sm:px-7 sm:py-6 shadow-sm">
        {/* Navegação */}
        <div className="mb-4 flex items-center justify-between gap-3">
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
              {formatLongDate(selectedDate)}
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

        {/* Faixa dos 7 dias */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((d, idx) => {
            const isDayToday = isSameDay(d, today);
            const isSelected = isSameDay(d, selectedDate);
            const dayShiftCount = team.filter((m) => m.shifts[d.getDay()] !== null).length;

            return (
              <button
                key={d.toISOString()}
                type="button"
                onClick={() => onSelectDate(d)}
                aria-pressed={isSelected}
                aria-label={`${d.getDate()} de ${formatLongDate(d)}, ${dayShiftCount} na escala`}
                className={[
                  "flex flex-col items-center gap-0.5 rounded-[14px] border p-2 sm:py-2.5 sm:px-1 transition-colors cursor-pointer text-center",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted/50",
                ].join(" ")}
              >
                <small className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {DOW_SHORT[d.getDay()]}
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
                  {dayShiftCount} na escala
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Métricas do dia */}
      <ScheduleStatsCards
        scheduledCount={workingMembers.length}
        offCount={offCount}
        coverageText={coverageText}
      />

      {/* Card 2: Equipe do dia com Timeline Gantt */}
      <section className="rounded-[22px] border border-border bg-card p-6 sm:px-7 sm:py-6 shadow-sm flex flex-col gap-1">
        <div>
          <h3 className="text-xl font-bold text-foreground">Equipe do dia</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quem trabalha em cada horário
          </p>
        </div>

        {/* Linha do tempo com scroll horizontal */}
        <div className="overflow-x-auto pt-7 pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
          <div className="relative min-w-[800px]">
            {/* Cabeçalho de Horas */}
            <div className="grid grid-cols-[185px_1fr] border-b border-border">
              <div className="sticky left-0 z-30 bg-card py-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center border-r border-border w-[185px]">
                Equipe
              </div>
              <div
                className="grid text-[11.5px] text-muted-foreground py-2 tabular-nums"
                style={{ gridTemplateColumns: `repeat(${totalSlots}, minmax(0, 1fr))` }}
              >
                {hourSlots.map((h) => (
                  <span key={h} className="pl-1 text-left font-medium">
                    {pad2(h)}h
                  </span>
                ))}
              </div>
            </div>

            {/* Linha "Na loja" */}
            <div className="grid grid-cols-[185px_1fr] border-b border-border">
              <div className="sticky left-0 z-30 bg-card py-2 px-3 text-[12.5px] text-muted-foreground flex items-center font-medium border-r border-border w-[185px]">
                Na loja
              </div>
              <div
                className="grid text-[12.5px] font-bold tabular-nums"
                style={{ gridTemplateColumns: `repeat(${totalSlots}, minmax(0, 1fr))` }}
              >
                {hourSlots.map((h) => {
                  const countPresent = team.filter((m) => {
                    const shift = m.shifts[dayOfWeek];
                    return shift && shift[0] <= h && shift[1] > h;
                  }).length;
                  const intensityPct = Math.round((countPresent / team.length) * 38);

                  return (
                    <span
                      key={h}
                      className="flex items-center justify-center py-2 text-center transition-colors"
                      style={{
                        backgroundColor:
                          countPresent > 0
                            ? `color-mix(in srgb, var(--primary) ${intensityPct}%, transparent)`
                            : "transparent",
                      }}
                    >
                      {countPresent}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Linhas das pessoas */}
            {team.map((member) => {
              const isMe = !!member.isCurrentUser;
              const shift = member.shifts[dayOfWeek];

              return (
                <div
                  key={member.id}
                  className={[
                    "grid grid-cols-[185px_1fr] border-b border-border last:border-b-0",
                    isMe ? "bg-primary/[0.03]" : "",
                  ].join(" ")}
                >
                  {/* Coluna da pessoa fixa à esquerda com fundo 100% opaco e divisor à direita */}
                  <div
                    style={{
                      backgroundColor: isMe
                        ? "color-mix(in srgb, var(--primary) 10%, var(--card))"
                        : "var(--card)",
                    }}
                    className="sticky left-0 z-20 py-2.5 px-3 flex items-center min-w-0 border-r border-border w-[185px]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#006b49] text-xs font-semibold text-white shadow-2xs select-none">
                        {member.initials}
                      </div>
                      <div className="flex flex-col min-w-0 overflow-hidden">
                        <b className="flex items-center gap-1.5 text-[13.5px] font-semibold text-foreground whitespace-nowrap leading-tight truncate">
                          <span className="truncate">{member.name}</span>
                          {isMe && (
                            <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0.5 text-[10.5px] font-semibold text-emerald-800 dark:text-emerald-300 leading-none">
                              Você
                            </span>
                          )}
                        </b>
                        <span className="text-xs text-muted-foreground whitespace-nowrap truncate">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pista com turno ou folga */}
                  <div
                    className={[
                      "relative min-h-[56px]",
                      isMe ? "bg-primary/[0.03]" : "",
                    ].join(" ")}
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, var(--border) 1px, transparent 1px)",
                      backgroundSize: `calc(100% / ${totalSlots}) 100%`,
                    }}
                  >
                    {shift ? (
                      <div
                        className={[
                          "absolute top-[9px] bottom-[9px] flex items-center px-3 rounded-[11px] text-[12.5px] font-semibold whitespace-nowrap overflow-hidden tabular-nums shadow-2xs",
                          isMe
                            ? "bg-primary text-primary-foreground border border-primary"
                            : "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20",
                        ].join(" ")}
                        style={{
                          left: `${pct(shift[0])}%`,
                          width: `${pct(shift[1]) - pct(shift[0])}%`,
                        }}
                      >
                        {pad2(shift[0])}:00 – {pad2(shift[1])}:00
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="rounded-full border border-dashed border-border px-3.5 py-1 text-xs text-muted-foreground font-medium bg-card/60">
                          Folga
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Marcador "Agora" */}
            {isLive && (
              <div
                className="absolute top-0 bottom-0 left-[185px] right-0 pointer-events-none z-10"
                aria-hidden="true"
              >
                <div
                  className="absolute top-0 bottom-0 w-[2px] -ml-[1px] bg-destructive rounded-[2px]"
                  style={{ left: `${pct(currentFractionalHour)}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-destructive text-white text-[11px] font-semibold px-2 py-0.5 whitespace-nowrap tabular-nums shadow-xs">
                    Agora {pad2(currentTime.getHours())}:{pad2(currentTime.getMinutes())}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legenda no rodapé do card */}
        <ScheduleLegend showNow={isLive} />
      </section>
    </div>
  );
}
