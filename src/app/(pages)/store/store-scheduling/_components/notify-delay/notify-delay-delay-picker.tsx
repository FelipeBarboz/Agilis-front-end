"use client";

import { DELAY_PRESETS } from "./notify-delay-constants";

interface NotifyDelayDelayPickerProps {
  selectedDelayMinutes: number;
  isCustomDelay: boolean;
  customMinutes: string;
  onSelectPreset: (minutes: number) => void;
  onToggleCustomDelay: () => void;
  onCustomMinutesChange: (val: string) => void;
}

export function NotifyDelayDelayPicker({
  selectedDelayMinutes,
  isCustomDelay,
  customMinutes,
  onSelectPreset,
  onToggleCustomDelay,
  onCustomMinutesChange,
}: NotifyDelayDelayPickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
          2. Tempo Estimado de Atraso
        </label>
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
          {isCustomDelay ? `${customMinutes || 0} min` : `${selectedDelayMinutes} min`}
        </span>
      </div>

      {/* Botões de presets rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {DELAY_PRESETS.map((t) => (
          <button
            key={t.minutes}
            type="button"
            onClick={() => onSelectPreset(t.minutes)}
            className={`rounded-xl border py-2 px-1 text-xs font-semibold transition-colors cursor-pointer text-center ${
              !isCustomDelay && selectedDelayMinutes === t.minutes
                ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold shadow-xs"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Opção para digitar tempo personalizado */}
      <div className="pt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleCustomDelay}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            isCustomDelay
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground hover:bg-muted"
          }`}
        >
          Digitar outro tempo
        </button>
        {isCustomDelay && (
          <div className="flex items-center gap-1.5 flex-1">
            <input
              type="number"
              min="5"
              max="600"
              step="5"
              placeholder="Ex: 50"
              value={customMinutes}
              onChange={(e) => onCustomMinutesChange(e.target.value)}
              className="w-24 rounded-lg border border-input bg-background px-3 py-1 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground">minutos</span>
          </div>
        )}
      </div>
    </div>
  );
}
