"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentDetails } from "./appointment-details";
import { OrderSummary } from "./order-summary";
import { PaymentMethodModal } from "./payment-method-modal";
import { PAYMENT_METHODS, type PaymentMethodId } from "./types";
// import { api } from "@/trpc/react"; // TODO: usar ao integrar com o backend

interface AppointmentConfirmationCardProps {
  appointmentId: string;
}

// TODO: trocar pelo retorno de api.appointment.getById.useQuery({ id: appointmentId })
const mockAppointment = {
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
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] =
    useState<PaymentMethodId | null>(null);
  const [observations, setObservations] = useState("");

  // const confirmAppointment = api.appointment.confirm.useMutation();

  const selectedPayment = PAYMENT_METHODS.find(
    (method) => method.id === selectedPaymentId,
  );

  const total = mockAppointment.price + mockAppointment.bookingFee;

  function handleConfirm() {
    if (!selectedPaymentId) {
      setPaymentModalOpen(true);
      return;
    }

    // confirmAppointment.mutate({
    //   appointmentId,
    //   paymentMethod: selectedPaymentId,
    //   observations,
    // });
    console.log("Confirmando agendamento", {
      appointmentId,
      selectedPaymentId,
      observations,
    });
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <h1 className="text-lg font-semibold">Detalhes do agendamento</h1>
          <p className="text-sm text-muted-foreground">
            {mockAppointment.serviceName}
          </p>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 lg:grid-cols-[2fr_1fr]">
          <AppointmentDetails
            date={mockAppointment.date}
            time={mockAppointment.time}
            address={mockAppointment.address}
            observations={observations}
            onObservationsChange={setObservations}
            selectedPayment={selectedPayment}
            onOpenPaymentModal={() => setPaymentModalOpen(true)}
          />

          <OrderSummary
            serviceName={mockAppointment.serviceName}
            providerName={mockAppointment.providerName}
            price={mockAppointment.price}
            bookingFee={mockAppointment.bookingFee}
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