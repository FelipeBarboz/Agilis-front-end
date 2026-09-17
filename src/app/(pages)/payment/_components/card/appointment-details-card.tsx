import type { PaymentMethod } from "../../../../../types/payment";
import { AppointmentDetails } from "../appointment-details";

interface AppointmentDetailsCardProps {
  serviceName: string;
  date: string;
  time: string;
  address: string;
  selectedPayment?: PaymentMethod;
  onOpenPaymentModal: () => void;
}

export function AppointmentDetailsCard({
  serviceName,
  date,
  time,
  address,
  selectedPayment,
  onOpenPaymentModal,
}: AppointmentDetailsCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/70">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Detalhes do Agendamento
            </h2>
            <p className="text-xs text-muted-foreground">{serviceName}</p>
          </div>
          <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            Etapa Final
          </span>
        </div>

        <AppointmentDetails
          date={date}
          time={time}
          address={address}
          selectedPayment={selectedPayment}
          onOpenPaymentModal={onOpenPaymentModal}
        />
      </div>
    </div>
  );
}
