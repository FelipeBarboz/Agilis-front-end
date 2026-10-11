"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  isSameDay,
  addDays,
  getMondayWeekStart,
  formatWeekRangeTitle,
  DOW_SHORT,
  pad2,
} from "@/lib/utils/date-schedule-helpers";
import type { StoreTeamMember } from "@/lib/mocks/store-roster";
import { ScheduleLegend } from "./schedule-legend";

interface ScheduleWeekViewProps {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  onJumpToDay: (d: Date) => void;
  team: StoreTeamMember[];
  onGoToToday: () => void;
}

export function ScheduleWeekView({
  selectedDate,
  onSelectDate,
  onJumpToDay,
  team,
  onGoToToday,
}: ScheduleWeekViewProps) {
  const today = new Date();
  const weekStart = getMondayWeekStart(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = addDays(weekStart, 6);

  const currentWeekStart = getMondayWeekStart(today);
  const isCurrentWeek = isSameDay(weekStart, currentWeekStart);

  function handleWeekNav(dir: number) {
    onSelectDate(addDays(selectedDate, dir * 7));
  }

  // Helper para formatar o chip de horário (ex: 08h–18h)
  function formatChip(shift: [number, number] | null | undefined) {
    if (!shift) return null;
    return `${pad2(shift[0])}h–${pad2(shift[1])}h`;
  }

  // Contagem de pessoas escaladas no dia
  function countOn(d: Date) {
    const dayOfWeek = d.getDay();
    return team.filter((member) => member.shifts[dayOfWeek] !== null).length;
  }

  return (
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

      {/* Tabela da escala com rolagem horizontal */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-30 bg-card py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-r border-border w-[185px] min-w-[185px] max-w-[185px]"
              >
                EQUIPE
              </th>
              {weekDays.map((d) => {
                const isDayToday = isSameDay(d, today);
                return (
                  <th
                    key={d.toISOString()}
                    scope="col"
                    className={[
                      "py-2 px-1 text-center border-b border-border font-normal min-w-[65px]",
                      isDayToday ? "bg-primary/5" : "",
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      onClick={() => onJumpToDay(d)}
                      aria-label={`Ver escala de ${DOW_SHORT[d.getDay()]}, ${d.getDate()}`}
                      className="group flex flex-col items-center gap-0.5 w-full cursor-pointer p-0"
                    >
                      <small
                        className={[
                          "text-[11px] font-semibold tracking-wider uppercase transition-colors",
                          isDayToday ? "text-primary" : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {DOW_SHORT[d.getDay()]}
                      </small>
                      <b
                        className={[
                          "flex h-[30px] w-[30px] items-center justify-center rounded-full text-[15px] font-bold leading-none transition-colors select-none",
                          isDayToday
                            ? "bg-primary text-white"
                            : "text-foreground group-hover:bg-primary/10",
                        ].join(" ")}
                      >
                        {d.getDate()}
                      </b>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {team.map((member) => {
              const isMe = !!member.isCurrentUser;

              return (
                <tr
                  key={member.id}
                  className={isMe ? "bg-primary/[0.04]" : ""}
                >
                  {/* Coluna da pessoa fixa à esquerda com fundo 100% opaco e divisor à direita */}
                  <th
                    scope="row"
                    style={{
                      backgroundColor: isMe
                        ? "color-mix(in srgb, var(--primary) 10%, var(--card))"
                        : "var(--card)",
                    }}
                    className="sticky left-0 z-20 py-3 px-3 text-left font-normal border-b border-r border-border w-[185px] min-w-[185px] max-w-[185px]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Avatar circular */}
                      <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#006b49] text-xs font-semibold text-white shadow-2xs select-none">
                        {member.initials}
                      </div>

                      {/* Nome e cargo com truncamento seguro */}
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
                  </th>

                  {/* Células de cada dia da semana */}
                  {weekDays.map((d) => {
                    const isDayToday = isSameDay(d, today);
                    const shift = member.shifts[d.getDay()];
                    const chipText = formatChip(shift);

                    return (
                      <td
                        key={d.toISOString()}
                        className={[
                          "py-3 px-1 text-center border-b border-border tabular-nums min-w-[65px]",
                          isDayToday ? (isMe ? "bg-primary/[0.08]" : "bg-primary/5") : "",
                        ].join(" ")}
                      >
                        {chipText ? (
                          <span
                            className={[
                              "inline-block px-2 py-1 rounded-[9px] text-xs font-semibold whitespace-nowrap",
                              isMe
                                ? "bg-primary text-primary-foreground shadow-2xs"
                                : "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20",
                            ].join(" ")}
                          >
                            {chipText}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Folga
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Linha de rodapé: Na escala */}
            <tr className="text-muted-foreground text-[12.5px] font-medium">
              <th
                scope="row"
                className="sticky left-0 z-20 bg-card py-3 px-3 text-left font-medium border-r border-border w-[185px] min-w-[185px] max-w-[185px]"
              >
                Na escala
              </th>
              {weekDays.map((d) => {
                const isDayToday = isSameDay(d, today);
                return (
                  <td
                    key={d.toISOString()}
                    className={[
                      "py-3 px-1 text-center tabular-nums min-w-[65px]",
                      isDayToday ? "bg-primary/5" : "",
                    ].join(" ")}
                  >
                    <b className="font-bold text-foreground">{countOn(d)}</b> de {team.length}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legenda */}
      <ScheduleLegend />
    </section>
  );
}
