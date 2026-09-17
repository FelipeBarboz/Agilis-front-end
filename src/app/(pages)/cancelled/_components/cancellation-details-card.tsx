import { QrCode, CreditCard, ShieldCheck } from "lucide-react";

interface CancellationDetailsCardProps {
  protocol: string;
  cancellationReason?: string;
  servicePrice: string;
  bookingFee: string;
  totalPrice: string;
  paymentMethod: string;
  date: string;
}

export function CancellationDetailsCard({
  protocol,
  cancellationReason,
  servicePrice,
  bookingFee,
  totalPrice,
  paymentMethod,
  date,
}: CancellationDetailsCardProps) {
  const isPix = paymentMethod === "PIX";

  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-xs space-y-5">
      <h3 className="text-sm font-bold text-foreground">
        Resumo da Devolução
      </h3>

      {/* Motivo registrado */}
      <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Motivo do Cancelamento
        </span>
        <p className="text-sm text-foreground font-medium">
          {cancellationReason || "Cancelamento solicitado pelo usuário"}
        </p>
      </div>

      {/* Tabela de valores */}
      <div className="space-y-2.5 text-xs sm:text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Protocolo do estorno:</span>
          <span className="font-mono font-bold text-foreground">{protocol}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Data do cancelamento:</span>
          <span className="font-medium text-foreground">{date}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Valor do serviço:</span>
          <span className="font-medium text-foreground">{servicePrice}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Taxa de agendamento:</span>
          <span className="font-medium text-foreground">{bookingFee}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-sm sm:text-base font-bold text-foreground">
          <span>Total estornado:</span>
          <span className="text-emerald-600 dark:text-emerald-400">{totalPrice}</span>
        </div>
      </div>

      {/* Método de pagamento */}
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/30 p-3.5 text-xs text-muted-foreground">
        {isPix ? (
          <QrCode className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <CreditCard className="h-4 w-4 text-primary shrink-0" />
        )}
        <span>
          Devolvido via <strong className="text-foreground">{paymentMethod}</strong> (estorno automático na mesma conta de pagamento).
        </span>
      </div>

    </div>
  );
}
