"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Users,
  Clock,
  Briefcase,
  CheckCircle2,
  CalendarDays,
  Loader2,
} from "lucide-react";
import type { StoreWeeklyScheduleResponse } from "@/lib/services/employee-schedules-service";
import { getMondayWeekStart } from "@/lib/utils/date-schedule-helpers";

interface ScheduleWeekViewProps {
  data: StoreWeeklyScheduleResponse | null;
  isLoading: boolean;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenEditModal: (employeeId?: string) => void;
  onDeleteEmployee?: (employeeId: string) => Promise<void>;
  canEdit?: boolean;
}

export function ScheduleWeekView({
  data,
  isLoading,
  selectedDate,
  onSelectDate,
  onOpenEditModal,
  onDeleteEmployee,
  canEdit = true,
}: ScheduleWeekViewProps) {
  const [selectedPosition, setSelectedPosition] = useState<string>("Todos");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Helper para navegar semanas (-7 ou +7 dias), garantindo sempre a segunda-feira
  function handleNavWeek(direction: number) {
    const cur = new Date(`${selectedDate}T00:00:00`);
    cur.setDate(cur.getDate() + direction * 7);
    const monday = getMondayWeekStart(cur);
    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, "0");
    const d = String(monday.getDate()).padStart(2, "0");
    onSelectDate(`${y}-${m}-${d}`);
  }

  function handleGoToday() {
    const monday = getMondayWeekStart(new Date());
    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, "0");
    const d = String(monday.getDate()).padStart(2, "0");
    onSelectDate(`${y}-${m}-${d}`);
  }

  const employees = data?.employees ?? [];
  const metrics = data?.metrics;
  const dayHeaders = data?.dayHeaders ?? [];
  const availablePositions = ["Todos", ...(data?.availablePositions ?? [])];

  const filteredEmployees = employees.filter((emp) => {
    return (
      selectedPosition === "Todos" ||
      emp.positionTitle?.toLowerCase() === selectedPosition.toLowerCase()
    );
  });

  async function handleDelete(employeeId: string, name: string) {
    if (!onDeleteEmployee) return;
    if (!window.confirm(`Deseja remover ${name} da escala de funcionários?`)) {
      return;
    }
    setIsDeletingId(employeeId);
    try {
      await onDeleteEmployee(employeeId);
    } finally {
      setIsDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Navegação de Semana */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavWeek(-1)}
            aria-label="Semana anterior"
            className="flex size-9 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>

          <span className="text-sm font-bold text-foreground">
            {data?.weekStartDate && data?.weekEndDate
              ? `${formatDate(data.weekStartDate)} até ${formatDate(data.weekEndDate)}`
              : "Semana selecionada"}
          </span>

          <button
            type="button"
            onClick={() => handleNavWeek(1)}
            aria-label="Próxima semana"
            className="flex size-9 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>

          <button
            type="button"
            onClick={handleGoToday}
            className="ml-2 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
          >
            Hoje
          </button>
        </div>

        {/* Filtro de cargos */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Cargo:</span>
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {availablePositions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards de Métricas Principais da Semana */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Users className="size-3.5 text-primary" />
              Equipe na Escala
            </span>
            <span className="text-xl font-bold text-foreground">
              {metrics.totalMembersInSchedule} colaboradores
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              Total de Horas
            </span>
            <span className="text-xl font-bold text-foreground">
              {metrics.weeklyTotalHours}h semanais
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-primary" />
              Presentes Hoje
            </span>
            <span className="text-xl font-bold text-primary">
              {metrics.todayInStoreCount} em loja
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-primary" />
              Folgas Hoje
            </span>
            <span className="text-xl font-bold text-muted-foreground">
              {metrics.todayOffCount} colaboradores
            </span>
          </div>
        </div>
      )}

      {/* Tabela / Grid de Escala Semanal */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="size-8 animate-spin text-primary mb-3" />
            <p className="text-sm font-semibold text-foreground">Carregando escala semanal...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
              <Users className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Nenhuma escala cadastrada</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Não há funcionários com escala cadastrada para o período selecionado.
            </p>
            {canEdit && (
              <button
                type="button"
                onClick={() => onOpenEditModal()}
                className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
              >
                + Criar Escala de Funcionário
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                  <th className="py-3 px-4 min-w-[180px]">Funcionário</th>
                  {dayHeaders.map((dh) => (
                    <th key={dh.date} className="py-3 px-3 text-center min-w-[100px]">
                      <div className="font-bold text-foreground">{dh.dayLabel}</div>
                      <div className="text-[11px] font-normal text-muted-foreground">
                        {dh.dayOfMonth} ({dh.activeCount} ativos)
                      </div>
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center min-w-[70px]">Total</th>
                  {canEdit && <th className="py-3 px-3 text-center min-w-[70px]">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.employeeId} className="hover:bg-muted/30 transition-colors">
                    {/* Dados do Funcionário */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">{emp.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                            <Briefcase className="size-3" />
                            {emp.positionTitle || "Funcionário"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 7 Dias da Semana */}
                    {emp.days.map((d) => (
                      <td key={d.date} className="py-3 px-2 text-center">
                        {d.isDayOff ? (
                          <span className="inline-block rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                            Folga
                          </span>
                        ) : (
                          <span className="inline-block rounded-md bg-primary/10 border border-primary/20 px-2 py-1 text-[11px] font-semibold text-primary">
                            {d.formattedHours || (d.startTime ? `${d.startTime.slice(0, 5)}–${d.endTime?.slice(0, 5) ?? ""}` : "Turno")}
                          </span>
                        )}
                      </td>
                    ))}

                    {/* Total Horas */}
                    <td className="py-3 px-3 text-center font-bold text-foreground">
                      {emp.weeklyHours}h
                    </td>

                    {/* Ações */}
                    {canEdit && (
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(emp.employeeId)}
                            title="Editar escala"
                            className="flex size-7 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          {onDeleteEmployee && (
                            <button
                              type="button"
                              disabled={isDeletingId === emp.employeeId}
                              onClick={() => handleDelete(emp.employeeId, emp.name)}
                              title="Remover da escala"
                              className="flex size-7 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}
