import { AlertTriangle, Clock, ArrowRight, ShieldCheck } from "lucide-react";

interface DelayNoticeCardProps {
  originalTime: string;
  suggestedTime: string;
  delayReason: string;
  estimatedDelay: string;
  providerName: string;
}

export function DelayNoticeCard({
  originalTime,
  suggestedTime,
  delayReason,
  estimatedDelay,
  providerName,
}: DelayNoticeCardProps) {
  return (
    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-6 shadow-xs space-y-5">
      {/* Header do Alerta */}
      <div className="flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">
              Aviso de Atraso do Prestador
            </h3>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
              +{estimatedDelay}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {providerName} comunicou um imprevisto e sugeriu um novo horário para o seu atendimento.
          </p>
        </div>
      </div>

      {/* Motivo do Atraso */}
      <div className="rounded-xl border border-amber-500/20 bg-background/80 p-4 space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Motivo Informado
        </span>
        <p className="text-sm font-medium text-foreground">
          &ldquo;{delayReason}&rdquo;
        </p>
      </div>

      {/* Comparativo de Horários */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between">
          <span className="text-xs text-muted-foreground">Horário Original:</span>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-base font-bold text-muted-foreground line-through">
              {originalTime}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-primary">Novo Horário Sugerido:</span>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-base font-bold text-primary">
              {suggestedTime}
            </span>
            <span className="text-xs font-medium text-muted-foreground">(Hoje)</span>
          </div>
        </div>
      </div>

      {/* Garantia do Agilis */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-amber-500/15">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
        <span>
          Garantia Agilis: você pode aceitar a sugestão, receber o estorno total ou escolher outro dia com <strong>prioridade total</strong>.
        </span>
      </div>
    </div>
  );
}
