"use client";

import { Clock } from "lucide-react";
import { QUICK_TIMES } from "./notify-delay-constants";

interface NotifyDelaySchedulePickerProps {
  suggestedDate: string;
  suggestedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function NotifyDelaySchedulePicker({
  suggestedDate,
  suggestedTime,
  onDateChange,
  onTimeChange,
}: NotifyDelaySchedulePickerProps) {
  return (
    <div className="space-y-2.5 rounded-2xl border border-primary/25 bg-primary/5 p-4">
      <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
        <Clock className="h-4 w-4 text-primary" />
        3. Novo Horário Sugerido ao Cliente
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium">
            Nova Data:
          </span>
          <input
            type="date"
            value={suggestedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium">
            Novo Horário:
          </span>
          <input
            type="time"
            value={suggestedTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Atalhos rápidos de horários sugeridos */}
      <div className="pt-1">
        <span className="text-[11px] text-muted-foreground block mb-1.5">
          Ou selecione um horário rápido:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TIMES.map((qt) => (
            <button
              key={qt}
              type="button"
              onClick={() => onTimeChange(qt)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                suggestedTime === qt
                  ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {qt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
