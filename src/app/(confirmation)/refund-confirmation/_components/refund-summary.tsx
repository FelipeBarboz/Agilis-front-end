import { CreditCard, QrCode } from "lucide-react";

interface RefundSummaryProps {
  servicePrice: string;
  bookingFee: string;
  totalPrice: string;
  paymentMethod: string;
}

export function RefundSummary({
  servicePrice,
  bookingFee,
  totalPrice,
  paymentMethod,
}: RefundSummaryProps) {
  const isPix = paymentMethod === "PIX";

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background p-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Resumo do Reembolso
      </h4>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Valor do serviço</span>
          <span className="font-medium text-foreground">{servicePrice}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Taxa de agendamento</span>
          <span className="font-medium text-foreground">{bookingFee}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
          <span>Total a ser estornado</span>
          <span className="text-emerald-600">{totalPrice}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        {isPix ? (
          <QrCode className="h-4 w-4 text-primary" />
        ) : (
          <CreditCard className="h-4 w-4 text-primary" />
        )}
        <span>
          Destino: <strong>{paymentMethod ?? "PIX"}</strong> (mesmo método de
          pagamento utilizado)
        </span>
      </div>
    </div>
  );
}
