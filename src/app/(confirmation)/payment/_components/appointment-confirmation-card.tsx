"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentDetails } from "./appointment-details";
import { OrderSummary } from "./order-summary";
import { PaymentMethodModal } from "./payment-method-modal";
import { PAYMENT_METHODS, type PaymentMethodId } from "./types";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface AppointmentConfirmationCardProps {
  appointmentId: string;
}

const defaultMockAppointment = {
  serviceName: "Análise e ajuste de parâmetros",
  providerName: "Guilherme Farias",
  date: "10/08 (Sexta-feira)",
  time: "09:00",
  address: "R. Cristiano Elisário Bilo, 40 - Parque Erasmo, Guarulhos",
  price: 120,
  bookingFee: 10,
};

export function AppointmentConfirmationCard({
  appointmentId,
}: AppointmentConfirmationCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceName = searchParams.get("serviceName") ?? defaultMockAppointment.serviceName;
  const providerName = searchParams.get("providerName") ?? defaultMockAppointment.providerName;
  const date = searchParams.get("date") ?? defaultMockAppointment.date;
  const time = searchParams.get("time") ?? defaultMockAppointment.time;
  const address = searchParams.get("address") ?? defaultMockAppointment.address;
  const price = Number(searchParams.get("price")) || defaultMockAppointment.price;
  const initialNotes = searchParams.get("notes") ?? "";

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] =
    useState<PaymentMethodId | null>("pix");
  const [observations, setObservations] = useState(initialNotes);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedPayment = PAYMENT_METHODS.find(
    (method) => method.id === selectedPaymentId,
  );

  const bookingFee = 10;
  const total = price + bookingFee;

  function handleConfirm() {
    if (!selectedPaymentId) {
      setPaymentModalOpen(true);
      return;
    }

    setIsSuccess(true);
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-auto rounded-2xl border border-border bg-background p-8 text-center shadow-lg"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h2 className="text-2xl font-bold text-foreground">Pagamento e Agendamento Confirmados!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O serviço foi contratado e o agendamento já está disponível no seu histórico.
        </p>

        <div className="my-6 rounded-xl border border-border bg-muted/40 p-4 text-left space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Serviço:</span>
            <span className="font-semibold text-foreground">{serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Prestador:</span>
            <span className="font-semibold text-foreground">{providerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data e Horário:</span>
            <span className="font-semibold text-primary">{date} às {time}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="text-muted-foreground">Total Pago:</span>
            <span className="font-bold text-emerald-600">R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/history")}
          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ver no Histórico
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <h1 className="text-lg font-semibold">Detalhes do agendamento</h1>
          <p className="text-sm text-muted-foreground">
            {serviceName}
          </p>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 lg:grid-cols-[2fr_1fr]">
          <AppointmentDetails
            date={date}
            time={time}
            address={address}
            observations={observations}
            onObservationsChange={setObservations}
            selectedPayment={selectedPayment}
            onOpenPaymentModal={() => setPaymentModalOpen(true)}
          />

          <OrderSummary
            serviceName={serviceName}
            providerName={providerName}
            price={price}
            bookingFee={bookingFee}
            total={total}
          />
        </CardContent>

        <div className="border-t p-6">
          <Button className="w-full" size="lg" onClick={handleConfirm}>
            Confirme Agendamento
          </Button>
        </div>
      </Card>

      <PaymentMethodModal
        open={isPaymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        selectedId={selectedPaymentId}
        onSelect={setSelectedPaymentId}
      />
    </>
  );
}