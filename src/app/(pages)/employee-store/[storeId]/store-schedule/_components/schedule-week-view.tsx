"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Clock,
  Users,
  CalendarDays,
  Info,
  Search,
} from "lucide-react";
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
  onOpenEditModal?: (memberId?: string) => void;
  canEdit?: boolean;
}

export function ScheduleWeekView({
  selectedDate,
  onSelectDate,
  onJumpToDay,
  team,
  onGoToToday,
  onOpenEditModal,
  canEdit = true,
}: ScheduleWeekViewProps) {
  const [selectedRole, setSelectedRole] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  // Cálculo de estatísticas da semana
  const totalWeeklyHours = team.reduce((acc, member) => {
    let mHours = 0;
    Object.values(member.shifts).forEach((s) => {
      if (s) mHours += s[1] - s[0];
    });
    return acc + mHours;
  }, 0);

  const avgDailyStaff = (
    weekDays.reduce((acc, d) => acc + countOn(d), 0) / 7
  ).toFixed(1);

  const todayWorking = team.filter((m) => m.shifts[today.getDay()] !== null).length;
  const todayOff = team.length - todayWorking;

  // Filtragem
  const rolesSet = new Set(team.map((m) => m.role));
  const availableRoles = ["Todos", ...Array.from(rolesSet)];

  const filteredTeam = team.filter((member) => {
    const matchesRole =
      selectedRole === "Todos" || member.role.toLowerCase() === selectedRole.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === "" ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Métricas e KPIs da Semana */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col rounded-[18px] border border-border bg-card p-4 shadow-sm text-center">
          <span className="text-xs text-muted-foreground font-medium">Equipe na Escala</span>
          <strong className="text-xl sm:text-2xl font-bold text-foreground mt-1 tabular-nums">
            {team.length} pessoas
          </strong>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            100% ativos
          </span>
        </div>

        <div className="flex flex-col rounded-[18px] border border-border bg-card p-4 shadow-sm text-center">
          <span className="text-xs text-muted-foreground font-medium">Carga Semanal</span>
          <strong className="text-xl sm:text-2xl font-bold text-foreground mt-1 tabular-nums">
            {totalWeeklyHours}h
          </strong>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            Soma dos turnos
          </span>
        </div>

        <div className="flex flex-col rounded-[18px] border border-border bg-card p-4 shadow-sm text-center">
          <span className="text-xs text-muted-foreground font-medium">Média por Dia</span>
          <strong className="text-xl sm:text-2xl font-bold text-foreground mt-1 tabular-nums">
            {avgDailyStaff} colab.
          </strong>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            Cobertura diária
          </span>
        </div>

        <div className="flex flex-col rounded-[18px] border border-border bg-card p-4 shadow-sm text-center">
          <span className="text-xs text-muted-foreground font-medium">Hoje na Loja</span>
          <strong className="text-xl sm:text-2xl font-bold text-primary mt-1 tabular-nums">
            {todayWorking} de {team.length}
          </strong>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            {todayOff} em folga
          </span>
        </div>
      </div>

      {/* Card Principal da Tabela Semanal */}
      <section className="rounded-[22px] border border-border bg-card p-5 sm:px-7 sm:py-6 shadow-sm">
        {/* Navegação da Semana */}
        <div className="mb-5 flex items-center justify-between gap-3">
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

        {/* Barra de Filtros, Busca e Ação de Editar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border">
          {/* Pills de Cargo */}
          <div className="flex flex-wrap items-center gap-1.5">
            {availableRoles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer border ${
                  selectedRole === r
                    ? "bg-primary border-primary text-primary-foreground shadow-2xs"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Busca e Botão Editar Escala */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-44">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar membro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card pl-8 pr-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>

            {canEdit && (
              <button
                type="button"
                onClick={() => onOpenEditModal?.()}
                className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                <Pencil className="size-3.5" />
                <span>Editar Escala</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabela da escala com rolagem horizontal */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-separate border-spacing-0">
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
                <th
                  scope="col"
                  className="py-2.5 px-2 text-center border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[75px]"
                >
                  HORAS
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTeam.map((member) => {
                const isMe = !!member.isCurrentUser;

                // Horas do membro na semana
                let memberTotalHours = 0;
                let offDaysCount = 0;
                weekDays.forEach((d) => {
                  const s = member.shifts[d.getDay()];
                  if (s) {
                    memberTotalHours += s[1] - s[0];
                  } else {
                    offDaysCount += 1;
                  }
                });

                return (
                  <tr
                    key={member.id}
                    className={isMe ? "bg-primary/[0.04]" : ""}
                  >
                    {/* Coluna da pessoa fixa à esquerda */}
                    <th
                      scope="row"
                      style={{
                        backgroundColor: isMe
                          ? "color-mix(in srgb, var(--primary) 10%, var(--card))"
                          : "var(--card)",
                      }}
                      className="sticky left-0 z-20 py-3 px-3 text-left font-normal border-b border-r border-border w-[185px] min-w-[185px] max-w-[185px]"
                    >
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Avatar circular */}
                          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#006b49] text-xs font-semibold text-white shadow-2xs select-none">
                            {member.initials}
                          </div>

                          {/* Nome e cargo */}
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

                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => onOpenEditModal?.(member.id)}
                            title={`Editar escala de ${member.name}`}
                            className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          >
                            <Pencil className="size-3" />
                          </button>
                        )}
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

                    {/* Coluna de Carga Horária Semanal */}
                    <td className="py-3 px-2 text-center border-b border-border tabular-nums min-w-[75px]">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-xs text-foreground bg-muted/70 px-2 py-0.5 rounded-md">
                          {memberTotalHours}h
                        </span>
                        <span className="text-[10.5px] text-muted-foreground mt-0.5">
                          {offDaysCount} {offDaysCount === 1 ? "folga" : "folgas"}
                        </span>
                      </div>
                    </td>
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
                <td className="py-3 px-2 text-center tabular-nums min-w-[75px]">
                  <b className="font-bold text-primary">{totalWeeklyHours}h</b> total
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legenda */}
        <ScheduleLegend />
      </section>

      {/* Card de Informações e Diretrizes Operacionais da Loja */}
      <section className="rounded-[22px] border border-border bg-card p-5 sm:p-6 shadow-sm flex flex-col gap-3.5">
        <div className="flex items-center gap-2">
          <Info className="size-4.5 text-primary" />
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Diretrizes e Cobertura da Loja
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
          <div className="flex flex-col gap-1 rounded-2xl bg-muted/40 p-3.5 border border-border/60">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" /> Atendimento Oficial
            </span>
            <span>Seg a Sex das 07h00 às 18h00 • Sábados das 08h às 14h</span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl bg-muted/40 p-3.5 border border-border/60">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Users className="size-3.5 text-primary" /> Horário de Pico
            </span>
            <span>10h00 às 16h00 com cobertura simultânea de técnicos</span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl bg-muted/40 p-3.5 border border-border/60">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-primary" /> Troca de Escala
            </span>
            <span>Notifique com 24h de antecedência à gerência da loja</span>
          </div>
        </div>
      </section>
    </div>
  );
}
