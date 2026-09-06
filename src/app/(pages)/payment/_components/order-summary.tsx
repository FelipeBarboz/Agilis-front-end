import { Receipt, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <Card className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Receipt className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Resumo do Pedido</h2>
          <p className="text-xs text-muted-foreground">Discriminação de valores</p>
        </div>
      </div>

      {/* Item contratado */}
      <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 flex flex-col gap-1">
        <span className="text-xs text-muted-foreground font-medium">Serviço Selecionado</span>
        <p className="text-sm font-semibold text-foreground leading-snug">{serviceName}</p>
        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {providerName.charAt(0)}
          </div>
          <span className="truncate">{providerName}</span>
        </div>
      </div>

      {/* Tabela de valores */}
      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Valor do serviço</span>
          <span className="font-medium text-foreground">{formatCurrency(price)}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Taxa de agendamento</span>
          <span className="font-medium text-foreground">{formatCurrency(bookingFee)}</span>
        </div>
        <div className="border-t border-border/80 pt-3 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-foreground block">Total a pagar</span>
            <span className="text-[11px] text-muted-foreground">Em até 12x ou à vista</span>
          </div>
          <span className="text-xl font-extrabold text-primary">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Garantia Agilis */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5">
        <ShieldCheck className="size-4 shrink-0 text-primary mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-semibold">Garantia Agilis:</strong> Pagamento 100% seguro retido até a conclusão do serviço.
        </p>
      </div>
    </Card>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}