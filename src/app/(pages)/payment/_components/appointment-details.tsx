import {
  CalendarDays,
  MapPin,
  CreditCard,
  ChevronRight,
  QrCode,
  Wallet,
} from "lucide-react";
import type { PaymentMethod } from "../../../../types/payment";

interface AppointmentDetailsProps {
  date: string;
  time: string;
  address: string;
  selectedPayment?: PaymentMethod;
  onOpenPaymentModal: () => void;
}

export function AppointmentDetails({
  date,
  time,
  address,
  selectedPayment,
  onOpenPaymentModal,
}: AppointmentDetailsProps) {
  const PaymentIcon = selectedPayment
    ? selectedPayment.id === "pix"
      ? QrCode
      : selectedPayment.id === "credit-card"
      ? CreditCard
      : Wallet
    : CreditCard;

  return (
    <div className="flex flex-col gap-6">
      {/* Seção: Data e Horário */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Data e Horário
            </span>
            <p className="mt-0.5 text-base font-semibold text-foreground">
              {date} às {time}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Horário reservado com o profissional
            </p>
          </div>
        </div>
      </div>

      {/* Seção: Endereço do Atendimento */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Local do Atendimento
            </span>
            <p className="mt-0.5 text-sm font-semibold text-foreground break-words">
              {address}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Atendimento no endereço informado
            </p>
          </div>
        </div>
      </div>

      {/* Seção: Forma de Pagamento */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PaymentIcon className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Forma de Pagamento
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenPaymentModal}
              className="mt-2.5 flex w-full items-center justify-between rounded-xl border border-border/80 bg-muted/30 p-3.5 text-left transition-all hover:bg-muted/60 hover:border-primary/40 group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border text-foreground">
                  <PaymentIcon className="size-4 text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {selectedPayment ? selectedPayment.label : "Selecionar forma de pagamento"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {selectedPayment ? selectedPayment.description : "Clique para escolher"}
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

