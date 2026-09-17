import { Check, RotateCcw, CalendarSync, Sparkles } from "lucide-react";

interface DelayOptionsSelectorProps {
  suggestedTime: string;
  isSubmittingAccept: boolean;
  isSubmittingRefund: boolean;
  onAcceptSuggested: () => void;
  onSelectRefund: () => void;
  onSelectPriorityReschedule: () => void;
}

export function DelayOptionsSelector({
  suggestedTime,
  isSubmittingAccept,
  isSubmittingRefund,
  onAcceptSuggested,
  onSelectRefund,
  onSelectPriorityReschedule,
}: DelayOptionsSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
        Como você deseja prosseguir?
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {/* Opção 1: Aceitar horário sugerido */}
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-background p-5 shadow-xs transition-all hover:border-emerald-500/60 hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-foreground">
                  Aceitar Horário Sugerido
                </h4>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Recomendado
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mantenha seu agendamento para hoje às <strong>{suggestedTime}</strong> sem burocracia.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isSubmittingAccept}
            onClick={onAcceptSuggested}
            className="w-full sm:w-auto shrink-0 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-emerald-700 disabled:opacity-50 cursor-pointer text-center"
          >
            {isSubmittingAccept ? "Confirmando..." : `Confirmar às ${suggestedTime}`}
          </button>
        </div>

        {/* Opção 2: Remarcar com Prioridade */}
        <div className="rounded-2xl border-2 border-primary/30 bg-background p-5 shadow-xs transition-all hover:border-primary/60 hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-foreground">
                  Remarcar com Prioridade
                </h4>
                <span className="rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
                  Fila Prioritária
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Escolha outro dia ou horário com <strong>horários preferenciais liberados</strong> para você.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSelectPriorityReschedule}
            className="w-full sm:w-auto shrink-0 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 cursor-pointer text-center"
          >
            Escolher Novo Horário
          </button>
        </div>

        {/* Opção 3: Receber Reembolso */}
        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs transition-all hover:border-destructive/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Receber Reembolso Integral
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cancele o atendimento agora e receba 100% do valor de volta na sua conta de pagamento.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isSubmittingRefund}
            onClick={onSelectRefund}
            className="w-full sm:w-auto shrink-0 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-2.5 text-xs font-bold text-destructive shadow-xs transition-colors hover:bg-destructive hover:text-white disabled:opacity-50 cursor-pointer text-center"
          >
            {isSubmittingRefund ? "Processando..." : "Solicitar Reembolso"}
          </button>
        </div>
      </div>
    </div>
  );
}
