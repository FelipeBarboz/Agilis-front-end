"use client";

import { useState, useEffect } from "react";
import {
  X,
  Clock,
  Check,
  AlertCircle,
  Loader2,
  Users,
  Building,
} from "lucide-react";
import {
  getStoreBusinessHours,
  updateStoreBusinessHour,
  updateStoreEmployeeSelection,
  type StoreBusinessHour,
} from "@/lib/services/employee-schedules-service";

interface BusinessHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  onSuccess?: () => void;
}

interface DayBusinessHourState {
  dayOfWeek: number;
  isOpen: boolean;
  opensAt: string; // "HH:mm"
  closesAt: string; // "HH:mm"
  id?: string;
}

const DAYS_CONFIG = [
  { dayOfWeek: 1, name: "Segunda-feira", short: "Seg", defaultOpen: true },
  { dayOfWeek: 2, name: "Terça-feira", short: "Ter", defaultOpen: true },
  { dayOfWeek: 3, name: "Quarta-feira", short: "Qua", defaultOpen: true },
  { dayOfWeek: 4, name: "Quinta-feira", short: "Qui", defaultOpen: true },
  { dayOfWeek: 5, name: "Sexta-feira", short: "Sex", defaultOpen: true },
  { dayOfWeek: 6, name: "Sábado", short: "Sáb", defaultOpen: true },
  { dayOfWeek: 0, name: "Domingo", short: "Dom", defaultOpen: false },
];

function formatTimeForInput(timeStr?: string | null): string {
  if (!timeStr) return "09:00";
  // Pode vir como "09:00:00" ou "09:00"
  return timeStr.slice(0, 5);
}

export function BusinessHoursModal({
  isOpen,
  onClose,
  storeId,
  onSuccess,
}: BusinessHoursModalProps) {
  const [days, setDays] = useState<DayBusinessHourState[]>([]);
  const [allowEmployeeSelection, setAllowEmployeeSelection] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !storeId) return;

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    getStoreBusinessHours(storeId)
      .then((existingHours: StoreBusinessHour[]) => {
        if (!isMounted) return;

        const hoursMap = new Map<number, StoreBusinessHour>();
        existingHours.forEach((h) => hoursMap.set(h.dayOfWeek, h));

        const initialDays: DayBusinessHourState[] = DAYS_CONFIG.map((cfg) => {
          const found = hoursMap.get(cfg.dayOfWeek);
          if (found) {
            return {
              dayOfWeek: cfg.dayOfWeek,
              isOpen: true,
              opensAt: formatTimeForInput(found.opensAt),
              closesAt: formatTimeForInput(found.closesAt),
              id: found.id,
            };
          }
          return {
            dayOfWeek: cfg.dayOfWeek,
            isOpen: cfg.defaultOpen,
            opensAt: "09:00",
            closesAt: "18:00",
          };
        });

        setDays(initialDays);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        console.warn("Erro ao carregar horários de funcionamento:", err);
        // Inicializa com padrão caso dê erro ou não haja horários
        setDays(
          DAYS_CONFIG.map((cfg) => ({
            dayOfWeek: cfg.dayOfWeek,
            isOpen: cfg.defaultOpen,
            opensAt: "09:00",
            closesAt: "18:00",
          }))
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, storeId]);

  if (!isOpen) return null;

  function handleToggleOpen(dayOfWeek: number) {
    setDays((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, isOpen: !d.isOpen } : d))
    );
  }

  function handleTimeChange(
    dayOfWeek: number,
    field: "opensAt" | "closesAt",
    value: string
  ) {
    setDays((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d))
    );
  }

  async function handleSave() {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validações
    for (const d of days) {
      if (d.isOpen) {
        if (!d.opensAt || !d.closesAt) {
          const cfg = DAYS_CONFIG.find((c) => c.dayOfWeek === d.dayOfWeek);
          setErrorMessage(`Informe o horário completo de abertura e fechamento para ${cfg?.name}.`);
          return;
        }
        if (d.closesAt <= d.opensAt) {
          const cfg = DAYS_CONFIG.find((c) => c.dayOfWeek === d.dayOfWeek);
          setErrorMessage(
            `Para ${cfg?.name}, o horário de fechamento (${d.closesAt}) deve ser após a abertura (${d.opensAt}).`
          );
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      // 1. Salvar dias abertos via PUT /business-hours
      const openDays = days.filter((d) => d.isOpen);
      for (const d of openDays) {
        await updateStoreBusinessHour(storeId, {
          dayOfWeek: d.dayOfWeek,
          opensAt: `${d.opensAt}:00`,
          closesAt: `${d.closesAt}:00`,
        });
      }

      // 2. Salvar configuração de escolha de funcionário
      try {
        await updateStoreEmployeeSelection(storeId, allowEmployeeSelection);
      } catch (err) {
        console.warn("Aviso ao salvar seleção de funcionários:", err);
      }

      setSuccessMessage("Horários de funcionamento atualizados com sucesso!");
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar horários de funcionamento.";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Horário de Funcionamento da Loja
              </h2>
              <p className="text-xs text-muted-foreground">
                Defina os dias e turnos em que a loja opera para receber agendamentos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Check size={16} className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 size={24} className="animate-spin text-primary" />
              <p className="text-xs">Carregando horários da loja...</p>
            </div>
          ) : (
            <>
              {/* Tabela / Lista dos 7 dias */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Dias de Operação
                </span>
                <div className="divide-y divide-border/60 rounded-xl border border-border bg-card overflow-hidden">
                  {days.map((d) => {
                    const cfg = DAYS_CONFIG.find((c) => c.dayOfWeek === d.dayOfWeek)!;
                    return (
                      <div
                        key={d.dayOfWeek}
                        className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          d.isOpen ? "bg-card" : "bg-muted/30 opacity-75"
                        }`}
                      >
                        {/* Nome do dia e status */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleOpen(d.dayOfWeek)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              d.isOpen
                                ? "bg-primary text-primary-foreground shadow-2xs"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {d.isOpen ? "Aberto" : "Fechado"}
                          </button>
                          <span className="text-sm font-semibold text-foreground">
                            {cfg.name}
                          </span>
                        </div>

                        {/* Controles de horário */}
                        {d.isOpen ? (
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-muted-foreground font-medium">Das</span>
                              <input
                                type="time"
                                value={d.opensAt}
                                onChange={(e) =>
                                  handleTimeChange(d.dayOfWeek, "opensAt", e.target.value)
                                }
                                className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                              />
                            </div>
                            <span className="text-[11px] text-muted-foreground font-medium">às</span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="time"
                                value={d.closesAt}
                                onChange={(e) =>
                                  handleTimeChange(d.dayOfWeek, "closesAt", e.target.value)
                                }
                                className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic self-end sm:self-auto">
                            Sem expediente
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Configuração de Escolha de Funcionário */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Users size={14} className="text-primary" />
                      <span>Escolha de profissional pelo cliente</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Permite que os clientes escolham qual funcionário prestará o serviço na hora do agendamento
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={allowEmployeeSelection}
                      onChange={(e) => setAllowEmployeeSelection(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Rodapé com botões */}
        <div className="flex items-center justify-end gap-2.5 border-t border-border px-6 py-4 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Check size={14} />
                <span>Salvar Horários</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
