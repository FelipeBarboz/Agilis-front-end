import {
  Briefcase,
  User,
  CalendarDays,
  MapPin,
  CreditCard,
  Receipt,
} from "lucide-react";

interface PaymentReceiptProps {
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  address: string;
  paymentMethodLabel: string;
  total: number;
}

export function PaymentReceipt({
  serviceName,
  providerName,
  date,
  time,
  address,
  paymentMethodLabel,
  total,
}: PaymentReceiptProps) {
  return (
    <div className="my-6 rounded-2xl border border-border bg-muted/40 p-4 sm:p-5 text-left space-y-3.5 text-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Comprovante do Agendamento
        </span>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          Pago
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="h-4 w-4 text-primary shrink-0" />
          <span>Serviço:</span>
        </div>
        <span className="font-semibold text-foreground text-right">
          {serviceName}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4 text-primary shrink-0" />
          <span>Prestador:</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <div className="flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {providerName.charAt(0)}
          </div>
          <span>{providerName}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4 text-primary shrink-0" />
          <span>Data e Horário:</span>
        </div>
        <span className="font-semibold text-primary">
          {date} às {time}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span>Local:</span>
        </div>
        <span
          className="font-medium text-foreground text-right text-xs max-w-[240px] truncate"
          title={address}
        >
          {address}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CreditCard className="h-4 w-4 text-primary shrink-0" />
          <span>Forma de Pagamento:</span>
        </div>
        <span className="font-medium text-foreground">
          {paymentMethodLabel}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-border/80 pt-3">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Receipt className="h-4 w-4 text-emerald-600" />
          <span>Total Pago:</span>
        </div>
        <span className="text-lg font-extrabold text-emerald-600">
          R$ {total.toFixed(2).replace(".", ",")}
        </span>
      </div>
    </div>
  );
}
