"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Sparkles, Crown, ShieldCheck, ArrowLeft } from "lucide-react";
import { RescheduleDateTimePicker } from "../../reschedule/_components/reschedule-datetime-picker";

const PRIORITY_TIMES = [
  "08:00 (Prioritário)",
  "09:30 (Prioritário)",
  "11:00 (Prioritário)",
  "13:30 (Prioritário)",
  "15:00 (Prioritário)",
  "16:30 (Prioritário)",
  "18:00 (Prioritário)",
];

interface PriorityRescheduleFormProps {
  onConfirm: (date: Date, time: string, reason: string) => void;
  onBackToOptions: () => void;
  isSubmitting: boolean;
}

export function PriorityRescheduleForm({
  onConfirm,
  onBackToOptions,
  isSubmitting,
}: PriorityRescheduleFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(Date.now() + 86400000)
  );
  const [selectedTime, setSelectedTime] = useState<string>("14:00");
  const [reason, setReason] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onConfirm(selectedDate, selectedTime, reason);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border-2 border-primary/40 bg-background p-6 shadow-sm space-y-6"
    >
      {/* Banner de Prioridade no Topo */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
          <Crown className="h-5 w-5 fill-amber-500 text-amber-600" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Reagendamento com Fila Prioritária
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Devido ao imprevisto com o prestador, seu atendimento terá <strong>prioridade máxima</strong>. Todos os horários do prestador foram desbloqueados para você sem qualquer taxa adicional.
        </p>
      </div>

      {/* Seletor de Data e Horário */}
      <RescheduleDateTimePicker
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        selectedTime={selectedTime}
        onSelectTime={setSelectedTime}
        minDate={today}
      />

      {/* Observação Opcional */}
      <div className="space-y-2">
        <label
          htmlFor="priority-reason"
          className="text-xs font-semibold uppercase tracking-wider text-foreground"
        >
          Instruções ou observações para o prestador (opcional)
        </label>
        <textarea
          id="priority-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex: Por favor, me ligar 15 minutos antes de chegar..."
          className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>


      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          {isSubmitting ? "Confirmando..." : "Confirmar Reagendamento Prioritário"}
        </button>
        <button
          type="button"
          onClick={onBackToOptions}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar às Opções
        </button>
      </div>
    </form>
  );
}
