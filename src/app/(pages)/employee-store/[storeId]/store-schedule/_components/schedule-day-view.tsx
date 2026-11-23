"use client";

import {
  Users,
  Moon,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { StoreDailyScheduleResponse } from "@/lib/services/employee-schedules-service";

interface ScheduleDayViewProps {
  data: StoreDailyScheduleResponse | null;
  isLoading: boolean;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function ScheduleDayView({
  data,
  isLoading,
  selectedDate,
  onSelectDate,
}: ScheduleDayViewProps) {
  function handleNavDay(offsetDays: number) {
    const cur = new Date(`${selectedDate}T00:00:00`);
    cur.setDate(cur.getDate() + offsetDays);
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, "0");
    const d = String(cur.getDate()).padStart(2, "0");
    onSelectDate(`${y}-${m}-${d}`);
  }

  const weekStrip = data?.weekStrip ?? [];
  const employees = data?.employees ?? [];
  const hourlyCoverage = data?.hourlyCoverage ?? [];

  const workingEmployees = employees.filter((e) => !e.isDayOff);
  const offEmployees = employees.filter((e) => e.isDayOff);

  return (
    <div className="space-y-6">
      {/* Navegador e Week Strip dos 7 dias */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleNavDay(-1)}
            aria-label="Dia anterior"
            className="flex size-8 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>

          <span className="text-sm font-bold text-foreground">
            {formatDateFull(selectedDate)}
          </span>

          <button
            type="button"
            onClick={() => handleNavDay(1)}
            aria-label="Próximo dia"
            className="flex size-8 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* 7-Day Strip */}
        {weekStrip.length > 0 && (
          <div className="grid grid-cols-7 gap-1.5 pt-1 border-t border-border/60">
            {weekStrip.map((item) => {
              const isSelected = item.date === selectedDate || item.isSelected;
              return (
                <button
                  key={item.date}
                  type="button"
                  onClick={() => onSelectDate(item.date)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "hover:bg-muted/60 text-muted-foreground"
                  }`}
                >
                  <span className="text-[11px] font-medium uppercase tracking-wider">
                    {item.dayLabel}
                  </span>
                  <span className={`text-base font-extrabold ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
                    {item.dayOfMonth}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${isSelected ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                    {item.scheduledCount} trab.
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Cards de Métricas do Dia */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
          <Users className="size-5 text-primary" />
          <strong className="text-2xl font-bold text-foreground tabular-nums">
            {data?.scheduledCount ?? workingEmployees.length}
          </strong>
          <span className="text-xs text-muted-foreground font-medium">Escalados</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
          <Moon className="size-5 text-primary" />
          <strong className="text-2xl font-bold text-foreground tabular-nums">
            {data?.daysOffCount ?? offEmployees.length}
          </strong>
          <span className="text-xs text-muted-foreground font-medium">Folgas</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
          <Clock className="size-5 text-primary" />
          <strong className="text-base font-bold text-foreground whitespace-nowrap">
            {data?.coverageInterval ?? "—"}
          </strong>
          <span className="text-xs text-muted-foreground font-medium">Cobertura</span>
        </div>
      </div>

      {/* Cobertura por Hora (se fornecida pela API) */}
      {hourlyCoverage.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary" />
            Cobertura por Horário
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {hourlyCoverage.map((hc) => (
              <div
                key={hc.hour}
                className={`flex flex-col items-center p-2 rounded-xl border text-center ${
                  hc.workingCount > 0
                    ? "bg-primary/5 border-primary/20 text-foreground"
                    : "bg-muted/30 border-border text-muted-foreground opacity-60"
                }`}
              >
                <span className="text-[11px] font-semibold">{hc.hourLabel || `${hc.hour}h`}</span>
                <span className={`text-xs font-bold ${hc.workingCount > 0 ? "text-primary" : "text-muted-foreground"}`}>
                  {hc.workingCount} {hc.workingCount === 1 ? "colab." : "colabs."}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Colaboradores do Dia */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground border-b border-border pb-2.5">
          Equipe no Dia ({employees.length})
        </h3>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="size-6 animate-spin text-primary mb-2" />
            <p className="text-xs text-muted-foreground">Carregando escala do dia...</p>
          </div>
        ) : employees.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            Nenhum colaborador registrado na escala deste dia.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Trabalhando */}
            {workingEmployees.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Trabalhando ({workingEmployees.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {workingEmployees.map((emp) => (
                    <div
                      key={emp.employeeId}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{emp.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                            <Briefcase className="size-3" />
                            {emp.positionTitle || "Funcionário"}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-lg bg-primary/10 border border-primary/20 px-2 py-0.5 text-xs font-semibold text-primary shrink-0">
                        {emp.formattedHours || `${emp.startTime?.hour ?? 8}h - ${emp.endTime?.hour ?? 18}h`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Folgas */}
            {offEmployees.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Folgas ({offEmployees.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {offEmployees.map((emp) => (
                    <div
                      key={emp.employeeId}
                      className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/10 opacity-75"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-xs">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{emp.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {emp.positionTitle || "Funcionário"}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground shrink-0">
                        Folga
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDateFull(iso: string): string {
  const [y, m, d] = iso.split("-");
  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
  return dateObj.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
