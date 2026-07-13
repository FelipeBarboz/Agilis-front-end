import {
  Calendar,
  MapPin,
  MessageSquare,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import type { PaymentMethod } from "./types";

interface AppointmentDetailsProps {
  date: string;
  time: string;
  address: string;
  observations: string;
  onObservationsChange: (value: string) => void;
  selectedPayment?: PaymentMethod;
  onOpenPaymentModal: () => void;
}

export function AppointmentDetails({
  date,
  time,
  address,
  observations,
  onObservationsChange,
  selectedPayment,
  onOpenPaymentModal,
}: AppointmentDetailsProps) {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <SectionTitle icon={Calendar} label="Data e horário" />
        <p className="text-sm text-foreground">
          {date} às {time}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <SectionTitle icon={MapPin} label="Endereço de serviço" />
        <p className="text-sm text-foreground">{address}</p>
      </section>

      <section className="flex flex-col gap-2">
        <SectionTitle icon={MessageSquare} label="Observações" />
        <textarea
          value={observations}
          onChange={(event) => onObservationsChange(event.target.value)}
          placeholder="Alguma observação para o prestador? (opcional)"
          rows={3}
          className="w-full resize-none rounded-md border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </section>

      <section className="flex flex-col gap-2">
        <SectionTitle icon={CreditCard} label="Forma de pagamento" />
        <button
          type="button"
          onClick={onOpenPaymentModal}
          className="flex items-center justify-between rounded-md border border-input bg-background p-3 text-sm transition-colors hover:bg-muted"
        >
          <span
            className={
              selectedPayment ? "text-foreground" : "text-muted-foreground"
            }
          >
            {selectedPayment
              ? selectedPayment.label
              : "Selecionar forma de pagamento"}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </section>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </div>
  );
}