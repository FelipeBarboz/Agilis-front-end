"use client";

import { useState, useEffect } from "react";
import { X, Clock, Plus, Trash2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StoreTeamMember } from "@/lib/mocks/store-roster";
import { DOW_SHORT, pad2 } from "@/lib/utils/date-schedule-helpers";

interface ManageScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: StoreTeamMember[];
  onSaveTeam: (updatedTeam: StoreTeamMember[]) => void;
  initialMemberId?: string | null;
}

const DAYS_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Seg a Dom
const DAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);

export function ManageScheduleModal({
  isOpen,
  onClose,
  team,
  onSaveTeam,
  initialMemberId,
}: ManageScheduleModalProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("new");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Atendente Operacional");
  const [shifts, setShifts] = useState<Record<number, [number, number] | null>>({
    0: null,
    1: [8, 18],
    2: [8, 18],
    3: [8, 18],
    4: [8, 18],
    5: [8, 18],
    6: null,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (initialMemberId && team.some((m) => m.id === initialMemberId)) {
      const member = team.find((m) => m.id === initialMemberId)!;
      setSelectedMemberId(member.id);
      setName(member.name);
      setRole(member.role);
      setShifts({ ...member.shifts });
    } else if (team.length > 0 && team[0]) {
      const first = team[0];
      setSelectedMemberId(first.id);
      setName(first.name);
      setRole(first.role);
      setShifts({ ...first.shifts });
    } else {
      setSelectedMemberId("new");
      setName("");
      setRole("Atendente Operacional");
      setShifts({
        0: null,
        1: [8, 18],
        2: [8, 18],
        3: [8, 18],
        4: [8, 18],
        5: [8, 18],
        6: null,
      });
    }
  }, [isOpen, initialMemberId, team]);

  function handleSelectMember(id: string) {
    setSelectedMemberId(id);
    if (id === "new") {
      setName("");
      setRole("Atendente Operacional");
      setShifts({
        0: null,
        1: [8, 18],
        2: [8, 18],
        3: [8, 18],
        4: [8, 18],
        5: [8, 18],
        6: null,
      });
    } else {
      const member = team.find((m) => m.id === id);
      if (member) {
        setName(member.name);
        setRole(member.role);
        setShifts({ ...member.shifts });
      }
    }
  }

  function handleToggleDay(day: number) {
    setShifts((prev) => {
      const current = prev[day];
      if (current) {
        return { ...prev, [day]: null };
      } else {
        return { ...prev, [day]: [8, 18] };
      }
    });
  }

  function handleShiftHourChange(day: number, isStart: boolean, hour: number) {
    setShifts((prev) => {
      const current = prev[day] ?? [8, 18];
      const newShift: [number, number] = isStart
        ? [hour, Math.max(hour + 1, current[1])]
        : [Math.min(current[0], hour - 1), hour];
      return { ...prev, [day]: newShift };
    });
  }

  function applyPresetToAllWeekdays(start: number, end: number) {
    setShifts((prev) => {
      const next = { ...prev };
      [1, 2, 3, 4, 5].forEach((d) => {
        next[d] = [start, end];
      });
      return next;
    });
  }

  function copyMondayToWeekdays() {
    const mondayShift = shifts[1];
    setShifts((prev) => {
      const next = { ...prev };
      [2, 3, 4, 5].forEach((d) => {
        next[d] = mondayShift ? [...mondayShift] : null;
      });
      return next;
    });
  }

  // Carga horária semanal total
  const totalWeeklyHours = Object.values(shifts).reduce((acc, curr) => {
    if (!curr) return acc;
    return acc + Math.max(0, curr[1] - curr[0]);
  }, 0);

  function handleSave() {
    if (!name.trim()) return;

    let initials = "AG";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      initials = `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    } else if (parts.length === 1 && parts[0] && parts[0].length >= 2) {
      initials = parts[0].slice(0, 2).toUpperCase();
    }

    if (selectedMemberId === "new") {
      const newMember: StoreTeamMember = {
        id: `emp-${Date.now()}`,
        name: name.trim(),
        initials,
        role: role.trim() || "Colaborador",
        isCurrentUser: false,
        shifts,
      };
      onSaveTeam([...team, newMember]);
    } else {
      const updated = team.map((m) =>
        m.id === selectedMemberId
          ? {
              ...m,
              name: name.trim(),
              initials,
              role: role.trim() || m.role,
              shifts,
            }
          : m
      );
      onSaveTeam(updated);
    }

    onClose();
  }

  function handleDeleteMember() {
    if (selectedMemberId === "new") return;
    const filtered = team.filter((m) => m.id !== selectedMemberId);
    onSaveTeam(filtered);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative flex flex-col w-full max-w-xl max-h-[90vh] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">
                {selectedMemberId === "new" ? "Criar Nova Escala" : "Editar Escala da Loja"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Defina os horários de trabalho e folgas do colaborador
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Corpo com Scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Seletor de Colaborador */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-foreground">
              Colaborador da Escala
            </label>
            <div className="flex flex-wrap gap-2">
              {team.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMember(m.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer border ${
                    selectedMemberId === m.id
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border bg-card hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/15 text-[10px] font-bold">
                    {m.initials}
                  </span>
                  <span>{m.name}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleSelectMember("new")}
                className={`flex items-center gap-1.5 rounded-xl border border-dashed px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  selectedMemberId === "new"
                    ? "border-primary bg-primary text-primary-foreground shadow-xs"
                    : "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
                }`}
              >
                <Plus className="size-3.5" />
                <span>+ Novo Membro</span>
              </button>
            </div>
          </div>

          {/* Dados do Colaborador */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-name" className="text-xs font-bold text-foreground">
                Nome completo <span className="text-primary">*</span>
              </label>
              <Input
                id="member-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Jefferson Riper"
                className="h-10 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-role" className="text-xs font-bold text-foreground">
                Cargo / Função
              </label>
              <Input
                id="member-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex: Atendente Operacional"
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          {/* Ações Rápidas de Presets */}
          <div className="rounded-2xl border border-border bg-muted/40 p-3 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Preenchimento Rápido (Segunda a Sexta)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applyPresetToAllWeekdays(8, 18)}
                className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Comercial (08h–18h)
              </button>
              <button
                type="button"
                onClick={() => applyPresetToAllWeekdays(7, 16)}
                className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Manhã (07h–16h)
              </button>
              <button
                type="button"
                onClick={() => applyPresetToAllWeekdays(9, 18)}
                className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Integral (09h–18h)
              </button>
              <button
                type="button"
                onClick={copyMondayToWeekdays}
                className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <Copy className="size-3" />
                Copiar Segunda para Ter–Sex
              </button>
            </div>
          </div>

          {/* Grade de Dias da Semana */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Turnos por dia da semana
              </label>
              <span className="text-xs font-semibold text-primary">
                Total: {totalWeeklyHours}h semanais
              </span>
            </div>

            <div className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
              {DAYS_ORDER.map((day) => {
                const shift = shifts[day];
                const isWorking = shift !== null;

                return (
                  <div
                    key={day}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2.5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                          isWorking
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border bg-card text-transparent"
                        }`}
                        aria-label={`Alternar dia ${DAY_NAMES[day]}`}
                      >
                        <Check className="size-3.5 stroke-[3]" />
                      </button>

                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">
                          {DAY_NAMES[day]}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {shift && isWorking
                            ? `${pad2(shift[0])}h às ${pad2(shift[1])}h (${shift[1] - shift[0]}h)`
                            : "Folga programada"}
                        </span>
                      </div>
                    </div>

                    {shift && isWorking ? (
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-muted-foreground">De:</span>
                          <select
                            value={shift[0]}
                            onChange={(e) =>
                              handleShiftHourChange(day, true, Number(e.target.value))
                            }
                            className="rounded-lg border border-border bg-card px-2 py-1 text-xs font-bold text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
                          >
                            {HOUR_OPTIONS.map((h) => (
                              <option key={h} value={h}>
                                {pad2(h)}:00
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-muted-foreground">Até:</span>
                          <select
                            value={shift[1]}
                            onChange={(e) =>
                              handleShiftHourChange(day, false, Number(e.target.value))
                            }
                            className="rounded-lg border border-border bg-card px-2 py-1 text-xs font-bold text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
                          >
                            {HOUR_OPTIONS.map((h) => (
                              <option key={h} value={h}>
                                {pad2(h)}:00
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <span className="rounded-lg border border-dashed border-border px-2.5 py-1 text-xs font-medium text-muted-foreground self-end sm:self-center">
                        Dia de Folga
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/20">
          {selectedMemberId !== "new" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDeleteMember}
              className="text-destructive hover:bg-destructive/10 border-destructive/30 gap-1.5 cursor-pointer rounded-xl"
            >
              <Trash2 className="size-4" />
              <span>Remover da escala</span>
            </Button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl cursor-pointer"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!name.trim()}
              onClick={handleSave}
              className="rounded-xl cursor-pointer"
            >
              Salvar Escala
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
