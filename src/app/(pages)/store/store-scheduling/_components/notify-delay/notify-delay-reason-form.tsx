"use client";

import { DELAY_REASONS } from "./notify-delay-constants";
import { NotifyDelayPreview } from "./notify-delay-preview";

interface NotifyDelayReasonFormProps {
  reason: string;
  onReasonChange: (reason: string) => void;
  customMessage: string;
  onCustomMessageChange: (message: string) => void;
  suggestedDate: string;
  suggestedTime: string;
}

export function NotifyDelayReasonForm({
  reason,
  onReasonChange,
  customMessage,
  onCustomMessageChange,
  suggestedDate,
  suggestedTime,
}: NotifyDelayReasonFormProps) {
  return (
    <div className="space-y-5">
      {/* 4. Motivo do Atraso */}
      <div className="space-y-2">
        <label
          htmlFor="delay-reason"
          className="text-xs font-semibold uppercase tracking-wider text-foreground"
        >
          4. Motivo do Atraso
        </label>
        <select
          id="delay-reason"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        >
          {DELAY_REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Mensagem Adicional */}
      <div className="space-y-2">
        <label
          htmlFor="custom-message"
          className="text-xs font-semibold uppercase tracking-wider text-foreground"
        >
          5. Mensagem Adicional para o Cliente (opcional)
        </label>
        <textarea
          id="custom-message"
          rows={2}
          value={customMessage}
          onChange={(e) => onCustomMessageChange(e.target.value)}
          placeholder="Ex: Trânsito intenso na avenida principal, estimo chegar pontualmente no novo horário..."
          className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Preview da Notificação */}
      <NotifyDelayPreview
        reason={reason}
        suggestedDate={suggestedDate}
        suggestedTime={suggestedTime}
      />
    </div>
  );
}
