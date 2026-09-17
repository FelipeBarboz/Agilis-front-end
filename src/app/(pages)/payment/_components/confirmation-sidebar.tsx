import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "./order-summary";

interface ConfirmationSidebarProps {
  serviceName: string;
  providerName: string;
  price: number;
  bookingFee: number;
  total: number;
  onConfirm: () => void;
}

export function ConfirmationSidebar({
  serviceName,
  providerName,
  price,
  bookingFee,
  total,
  onConfirm,
}: ConfirmationSidebarProps) {
  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-6">
      <OrderSummary
        serviceName={serviceName}
        providerName={providerName}
        price={price}
        bookingFee={bookingFee}
        total={total}
      />

      <Button
        className="w-full h-12 rounded-xl text-base font-bold shadow-xs transition-all hover:shadow-md cursor-pointer"
        size="lg"
        onClick={onConfirm}
      >
        <CheckCircle2 className="h-5 w-5 mr-2" />
        Confirmar Agendamento
      </Button>

      <p className="text-center text-xs text-muted-foreground leading-relaxed px-2">
        Ao confirmar, você concorda com os Termos de Serviço e com a Política de
        Cancelamento da Agilis.
      </p>
    </div>
  );
}
