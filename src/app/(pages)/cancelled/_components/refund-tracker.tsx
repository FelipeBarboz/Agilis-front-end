import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface RefundTrackerProps {
  paymentMethod?: string;
  refundStatus?: "completed" | "processing" | "review";
}

export function RefundTracker({
  paymentMethod = "PIX",
  refundStatus = "completed",
}: RefundTrackerProps) {
  const isPix = paymentMethod === "PIX";

  const steps = [
    {
      title: "Cancelamento Solicitado",
      description: "Serviço cancelado e estorno gerado",
      isDone: true,
      time: "Confirmado",
    },
    {
      title: "Processamento Financeiro",
      description: isPix
        ? "Envio para a chave PIX de origem"
        : "Comunicação com a operadora do cartão",
      isDone: true,
      time: "Processado",
    },
    {
      title: "Reembolso Creditado",
      description: isPix
        ? "Saldo disponível na sua conta"
        : "Crédito lançado na próxima fatura",
      isDone: refundStatus === "completed",
      isCurrent: refundStatus === "processing",
      time: refundStatus === "completed" ? "Concluído" : isPix ? "Em até 2h" : "1 a 2 faturas",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Acompanhamento do Reembolso
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fluxo de devolução do pagamento
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {refundStatus === "completed" ? "Estorno Concluído" : "Em Processamento"}
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex items-start gap-4">
            {/* Step Icon Indicator */}
            <div className="absolute -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-background ring-4 ring-background">
              {step.isDone ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              ) : step.isCurrent ? (
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
              <span className="text-xs font-medium text-muted-foreground self-start sm:self-auto">
                {step.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
