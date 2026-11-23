"use client";

import { useState, useEffect } from "react";
import { X, Clock, Check, Loader2, Trash2 } from "lucide-react";
import {
  saveEmployeeWeeklySchedule,
  createEmployeeSchedule,
  removeEmployeeFromSchedule,
  type WeeklyScheduleDaySlotPayload,
  type WeeklyScheduleEmployee,
} from "@/lib/services/employee-schedules-service";
import { getAuthenticatedUserId, getMyStores } from "@/lib/services/stores-service";

interface ManageScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  employees: WeeklyScheduleEmployee[];
  initialEmployeeId?: string | null;
  onSuccess: () => Promise<void>;
}

const DAYS_OF_WEEK = [
  { id: 1, label: "Segunda-feira", short: "Seg" },
  { id: 2, label: "Terça-feira", short: "Ter" },
  { id: 3, label: "Quarta-feira", short: "Qua" },
  { id: 4, label: "Quinta-feira", short: "Qui" },
  { id: 5, label: "Sexta-feira", short: "Sex" },
  { id: 6, label: "Sábado", short: "Sáb" },
  { id: 7, label: "Domingo", short: "Dom" },
];

interface DayConfig {
  dayOfWeek: number;
  isDayOff: boolean;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
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
      isDayOff: d.id === 6 || d.id === 7, // Fim de semana folga por padrão
      startHour: 8,
      startMinute: 0,
      endHour: 18,
      endMinute: 0,
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
          const dayData = existing.days.find(
            (item) => item.dayOfWeek === d.id || (d.id === 7 && item.dayOfWeek === 0)
          );
          if (dayData) {
            return {
              dayOfWeek: d.id,
              isDayOff: dayData.isDayOff,
              startHour: dayData.startTime?.hour ?? 8,
              startMinute: dayData.startTime?.minute ?? 0,
              endHour: dayData.endTime?.hour ?? 18,
              endMinute: dayData.endTime?.minute ?? 0,
            };
          }
          return {
            dayOfWeek: d.id,
            isDayOff: d.id === 6 || d.id === 7,
            startHour: 8,
            startMinute: 0,
            endHour: 18,
            endMinute: 0,
          };
        })
      );
    } else {
      // Padrão Seg-Sex 08-18h
      setDays(
        DAYS_OF_WEEK.map((d) => ({
          dayOfWeek: d.id,
          isDayOff: d.id === 6 || d.id === 7,
          startHour: 8,
          startMinute: 0,
          endHour: 18,
          endMinute: 0,
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
    field: "startHour" | "endHour",
    val: number
  ) {
    setDays((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, [field]: val } : d))
    );
  }

  function handleApplyStandardHours() {
    setDays((prev) =>
      prev.map((d) => ({
        ...d,
        isDayOff: d.dayOfWeek === 6 || d.dayOfWeek === 7,
        startHour: 8,
        startMinute: 0,
        endHour: 18,
        endMinute: 0,
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

    setIsSubmitting(true);
    try {
      // Garante storeId válido
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

      // Payload conforme spec da API: zeros para dias de folga (nunca null)
      const buildPayload = (sundayValue: 7 | 0): WeeklyScheduleDaySlotPayload[] =>
        days.map((d) => ({
          dayOfWeek: d.dayOfWeek === 7 || d.dayOfWeek === 0 ? sundayValue : d.dayOfWeek,
          isDayOff: d.isDayOff,
          startTime: { hour: d.isDayOff ? 0 : d.startHour, minute: d.isDayOff ? 0 : d.startMinute, second: 0, nano: 0 },
          endTime:   { hour: d.isDayOff ? 0 : d.endHour,   minute: d.isDayOff ? 0 : d.endMinute,   second: 0, nano: 0 },
        }));

      console.info("[Schedule] storeId:", effectiveStoreId, "| employeeId:", effectiveId);
      console.info("[Schedule] payload:", JSON.stringify(buildPayload(7), null, 2));

      // ETAPA 1 — Garantir escala-pai (POST /schedules). Ignora erros (pode já existir).
      const requesterId = await getAuthenticatedUserId();
      try {
        await createEmployeeSchedule(effectiveStoreId, {
          requesterId: requesterId || undefined,
          storeId: effectiveStoreId,
          employeeId: effectiveId,
          scheduleType: "WEEKLY",
          monthlyHoursQuota: 160,
          monthlyDaysQuota: 22,
        });
        console.info("[Schedule] Escala-pai criada.");
      } catch (createErr: unknown) {
        console.info("[Schedule] POST /schedules ignorado (pode já existir):", createErr);
      }

      // ETAPA 2 — Salvar turnos semanais com fallback de domingo
      let saved = false;
      let lastError: unknown = null;

      for (const sundayVal of [7, 0] as const) {
        try {
          await saveEmployeeWeeklySchedule(effectiveStoreId, effectiveId, buildPayload(sundayVal));
          saved = true;
          break;
        } catch (err: unknown) {
          lastError = err;
          console.warn(`[Schedule] PUT /weekly com domingo=${sundayVal} falhou:`, err);
        }
      }

      if (!saved) {
        throw lastError;
      }
      await onSuccess();
      onClose();
    } catch (err) {
      console.error("[Schedule] Falha definitiva ao salvar escala:", err);
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
          <div>
            <h2 className="text-base font-bold text-foreground">
              {isExistingEmployee ? "Editar Escala do Funcionário" : "Configurar Escala de Funcionário"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Defina os dias de trabalho, folgas e horários da semana
            </p>
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
          <div className="space-y-2">
            <label htmlFor="select-employee" className="text-xs font-bold text-foreground uppercase tracking-wider">
              Funcionário
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
              Dias da Semana
            </span>
            <button
              type="button"
              onClick={handleApplyStandardHours}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Padrão Seg–Sex (08h às 18h)
            </button>
          </div>

          {/* Lista dos 7 dias */}
          <div className="space-y-2">
            {DAYS_OF_WEEK.map((d) => {
              const config = days.find((item) => item.dayOfWeek === d.id)!;
              return (
                <div
                  key={d.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    config.isDayOff
                      ? "bg-muted/20 border-border/60 text-muted-foreground"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleDayOff(d.id)}
                      className={`flex size-6 items-center justify-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        !config.isDayOff
                          ? "bg-primary border-primary text-primary-foreground shadow-xs"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      {!config.isDayOff && <Check className="size-3.5" />}
                    </button>
                    <div>
                      <p className="text-xs font-bold leading-tight">{d.label}</p>
                      <span className="text-[11px] text-muted-foreground">
                        {config.isDayOff ? "Folga programada" : "Dia de trabalho"}
                      </span>
                    </div>
                  </div>

                  {!config.isDayOff && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3 text-primary" />
                        <select
                          value={config.startHour}
                          onChange={(e) =>
                            handleTimeChange(d.id, "startHour", Number(e.target.value))
                          }
                          className="rounded-lg border border-input bg-background p-1 text-xs"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                              {String(i).padStart(2, "0")}:00
                            </option>
                          ))}
                        </select>
                      </div>

                      <span className="text-muted-foreground">até</span>

                      <select
                        value={config.endHour}
                        onChange={(e) =>
                          handleTimeChange(d.id, "endHour", Number(e.target.value))
                        }
                        className="rounded-lg border border-input bg-background p-1 text-xs"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>
                            {String(i).padStart(2, "0")}:00
                          </option>
                        ))}
                      </select>
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
