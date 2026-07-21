interface OrderSummaryProps {
  serviceName: string;
  providerName: string;
  price: number;
  bookingFee: number;
  total: number;
}

export function OrderSummary({
  serviceName,
  providerName,
  price,
  bookingFee,
  total,
}: OrderSummaryProps) {
  return (
    <aside className="flex flex-col gap-4 rounded-lg bg-muted p-4">
      <h2 className="text-sm font-semibold text-foreground">Resumo</h2>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{serviceName}</p>
        <p className="text-xs text-muted-foreground">{providerName}</p>
      </div>

      <div className="flex flex-col gap-2 border-t pt-3 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Serviço</span>
          <span>{formatCurrency(price)}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Taxa de agendamento</span>
          <span>{formatCurrency(bookingFee)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-3 text-base font-semibold text-foreground">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </aside>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}