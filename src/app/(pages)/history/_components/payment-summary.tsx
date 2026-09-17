import { CreditCard } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface PaymentSummaryProps {
  price: number;
  bookingFee: number;
  paymentMethod?: string;
}

export function PaymentSummary({ price, bookingFee, paymentMethod }: PaymentSummaryProps) {
  const total = price + bookingFee;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-xs space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Resumo Financeiro
      </h4>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Valor do serviço</span>
          <span className="font-medium text-foreground">{currencyFormatter.format(price)}</span>
        </div>

        {bookingFee > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>Taxa de serviço</span>
            <span className="font-medium text-foreground">
              {currencyFormatter.format(bookingFee)}
            </span>
          </div>
        )}

        <div className="flex justify-between border-t border-border/60 pt-2 text-sm font-bold text-foreground">
          <span>Total</span>
          <span>{currencyFormatter.format(total)}</span>
        </div>

        {paymentMethod && (
          <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              Forma de pagamento
            </span>
            <span className="font-semibold text-foreground">{paymentMethod}</span>
          </div>
        )}
      </div>
    </div>
  );
}
