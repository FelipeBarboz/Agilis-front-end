"use client";

import { useState, useEffect } from "react";
import { X, Clock, Check, Loader2, Trash2, CalendarDays } from "lucide-react";
import {
  saveEmployeeWeeklySchedule,
  removeEmployeeFromSchedule,
  type WeeklyScheduleDaySlotPayload,
  type WeeklyScheduleEmployee,
} from "@/lib/services/employee-schedules-service";
import { getMyStores } from "@/lib/services/stores-service";

interface ManageScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  employees: WeeklyScheduleEmployee[];
  initialEmployeeId?: string | null;
  onSuccess: () => Promise<void>;
}

export const DAYS_OF_WEEK = [
  { id: 1, label: "Segunda-feira", short: "Seg" },
  { id: 2, label: "Terça-feira", short: "Ter" },
  { id: 3, label: "Quarta-feira", short: "Qua" },
  { id: 4, label: "Quinta-feira", short: "Qui" },
  { id: 5, label: "Sexta-feira", short: "Sex" },
  { id: 6, label: "Sábado", short: "Sáb" },
  { id: 0, label: "Domingo", short: "Dom" },
];

interface DayConfig {
  dayOfWeek: number;
  isDayOff: boolean;
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
}

function parseTimeString(timeStr?: string | null, defaultVal = "09:00"): string {
  if (!timeStr) return defaultVal;
  const parts = timeStr.split(":");
  const h = String(parts[0] || "09").padStart(2, "0");
  const m = String(parts[1] || "00").padStart(2, "0");
  return `${h}:${m}`;
}

export function ManageScheduleModal({
  isOpen,
  onClose,
  storeId,
  employees,
  initialEmployeeId,
  onSuccess,
}: ManageScheduleModalProps) {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [customEmployeeId, setCustomEmployeeId] = useState<string>("");
  const [days, setDays] = useState<DayConfig[]>(() =>
    DAYS_OF_WEEK.map((d) => ({
      dayOfWeek: d.id,
      isDayOff: d.id === 6 || d.id === 0, // Fim de semana folga por padrão
      startTime: "09:00",
      endTime: "18:00",
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage(null);

    const targetId = initialEmployeeId ?? employees[0]?.employeeId ?? "";
    setEmployeeId(targetId);

    // Se encontramos os dias do funcionário na escala existente, pré-carrega
    const existing = employees.find((e) => e.employeeId === targetId);
    if (existing && existing.days.length > 0) {
      setDays(
        DAYS_OF_WEEK.map((d) => {
          const dayData = existing.days.find((item) => item.dayOfWeek === d.id);
          if (dayData) {
            return {
              dayOfWeek: d.id,
              isDayOff: dayData.isDayOff,
              startTime: parseTimeString(dayData.startTime, "09:00"),
              endTime: parseTimeString(dayData.endTime, "18:00"),
            };
          }
          return {
            dayOfWeek: d.id,
            isDayOff: d.id === 6 || d.id === 0,
            startTime: "09:00",
            endTime: "18:00",
          };
        })
      );
    } else {
      // Padrão Seg-Sex 09-18h
      setDays(
        DAYS_OF_WEEK.map((d) => ({
          dayOfWeek: d.id,
          isDayOff: d.id === 6 || d.id === 0,
          startTime: "09:00",
          endTime: "18:00",
        }))
      );
    }
  }, [isOpen, initialEmployeeId, employees]);

  function handleToggleDayOff(dayOfWeek: number) {
    setDays((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, isDayOff: !d.isDayOff } : d))
    );
  }

  function handleTimeChange(
    dayOfWeek: number,
    field: "startTime" | "endTime",
    val: string
  ) {
    setDays((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, [field]: val } : d))
    );
  }

  function handleApplyStandardHours() {
    setDays((prev) =>
      prev.map((d) => ({
        ...d,
        isDayOff: d.dayOfWeek === 6 || d.dayOfWeek === 0,
        startTime: "09:00",
        endTime: "18:00",
      }))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const effectiveId = employeeId === "custom" ? customEmployeeId.trim() : employeeId;
    if (!effectiveId) {
      setErrorMessage("Por favor, selecione ou informe o identificador do funcionário.");
      return;
    }

    // Validação: para cada dia útil, endTime deve ser maior que startTime
    for (const d of days) {
      if (!d.isDayOff) {
        if (!d.startTime || !d.endTime) {
          const dayName = DAYS_OF_WEEK.find((item) => item.id === d.dayOfWeek)?.label || "Dia";
          setErrorMessage(`Por favor, preencha o horário de entrada e saída na ${dayName}.`);
          return;
        }
        if (d.endTime <= d.startTime) {
          const dayName = DAYS_OF_WEEK.find((item) => item.id === d.dayOfWeek)?.label || "Dia";
          setErrorMessage(
            `Na ${dayName}, o horário de saída (${d.endTime}) deve ser posterior ao horário de entrada (${d.startTime}).`
          );
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      let effectiveStoreId = storeId;
      if (!effectiveStoreId) {
        const myStores = await getMyStores();
        if (myStores.length > 0 && myStores[0]?.storeId) {
          effectiveStoreId = myStores[0].storeId;
        }
      }

      if (!effectiveStoreId) {
        setErrorMessage("Identificador da loja não encontrado.");
        setIsSubmitting(false);
        return;
      }

      // Payload estrito conforme o guia:
      // Array com os 7 dias da semana (0 a 6)
      // Quando !isDayOff: startTime e endTime no formato "HH:mm:ss"
      // Quando isDayOff: startTime: null, endTime: null
      const payload: WeeklyScheduleDaySlotPayload[] = days.map((d) => ({
        dayOfWeek: d.dayOfWeek,
        isDayOff: d.isDayOff,
        startTime: d.isDayOff ? null : `${d.startTime}:00`,
        endTime: d.isDayOff ? null : `${d.endTime}:00`,
      }));

      // PUT /api/v1/stores/{storeId}/schedules/employees/{employeeId}/weekly
      await saveEmployeeWeeklySchedule(effectiveStoreId, effectiveId, payload);

      await onSuccess();
      onClose();
    } catch (err) {
      console.error("[ManageScheduleModal] Erro ao salvar escala:", err);
      const msg = err instanceof Error ? err.message : "Erro ao salvar a escala no servidor.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    const effectiveId = employeeId === "custom" ? customEmployeeId.trim() : employeeId;
    if (!effectiveId) return;

    if (!window.confirm("Deseja realmente remover este funcionário da escala?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await removeEmployeeFromSchedule(storeId, effectiveId);
      await onSuccess();
      onClose();
    } catch (err) {
      console.warn("[ManageScheduleModal] Erro ao remover escala:", err);
      const msg = err instanceof Error ? err.message : "Erro ao remover a escala no servidor.";
      setErrorMessage(msg);
    } finally {
      setIsDeleting(false);
    }
  }

  if (!isOpen) return null;

  const isExistingEmployee = employees.some((e) => e.employeeId === employeeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isExistingEmployee ? "Editar Escala do Funcionário" : "Configurar Escala de Funcionário"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Defina os turnos semanais e folgas (segunda a domingo)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Seleção do Funcionário */}
          <div className="space-y-1.5">
            <label htmlFor="select-employee" className="text-xs font-bold text-foreground uppercase tracking-wider">
              Funcionário <span className="text-primary">*</span>
            </label>
            <select
              id="select-employee"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.name} ({emp.positionTitle || "Funcionário"})
                </option>
              ))}
              <option value="custom">+ Outro funcionário (digitar ID)</option>
            </select>

            {employeeId === "custom" && (
              <input
                type="text"
                value={customEmployeeId}
                onChange={(e) => setCustomEmployeeId(e.target.value)}
                placeholder="Informe o ID do funcionário (ex: UUID)"
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary mt-2"
              />
            )}
          </div>

          {/* Atalho para padrão Seg-Sex */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Grade Semanal de Turnos
            </span>
            <button
              type="button"
              onClick={handleApplyStandardHours}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Padrão Seg–Sex (09:00 às 18:00)
            </button>
          </div>

          {/* Lista dos 7 dias */}
          <div className="space-y-2">
            {DAYS_OF_WEEK.map((d) => {
              const config = days.find((item) => item.dayOfWeek === d.id)!;
              return (
                <div
                  key={d.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
                    config.isDayOff
                      ? "bg-muted/20 border-border/60 text-muted-foreground"
                      : "bg-card border-border text-foreground shadow-2xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleDayOff(d.id)}
                      className={`flex h-8 px-2.5 items-center gap-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        !config.isDayOff
                          ? "bg-primary border-primary text-primary-foreground shadow-2xs"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {!config.isDayOff ? (
                        <>
                          <Check className="size-3.5" />
                          <span>Trabalho</span>
                        </>
                      ) : (
                        <span>Folga</span>
                      )}
                    </button>
                    <div>
                      <p className="text-xs font-bold leading-tight">{d.label}</p>
                      <span className="text-[11px] text-muted-foreground">
                        {config.isDayOff ? "Dia de folga" : "Turno ativo"}
                      </span>
                    </div>
                  </div>

                  {!config.isDayOff && (
                    <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary" />
                        <input
                          type="time"
                          value={config.startTime}
                          onChange={(e) => handleTimeChange(d.id, "startTime", e.target.value)}
                          className="h-9 rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                        />
                      </div>

                      <span className="text-muted-foreground text-xs">até</span>

                      <input
                        type="time"
                        value={config.endTime}
                        onChange={(e) => handleTimeChange(d.id, "endTime", e.target.value)}
                        className="h-9 rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              {errorMessage}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            {isExistingEmployee ? (
              <button
                type="button"
                disabled={isDeleting || isSubmitting}
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                <span>Remover da escala</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <span>Salvar Escala</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
