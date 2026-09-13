"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaymentMethodModal } from "../payment-method-modal";
import { PaymentHeader } from "../payment-header";
import { PaymentSuccess } from "../payment-success";
import { AppointmentDetailsCard } from "./appointment-details-card";
import { ConfirmationSidebar } from "../confirmation-sidebar";
import { PAYMENT_METHODS, type PaymentMethodId } from "../../../../../types/payment";

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
  appointmentId: _appointmentId,
}: AppointmentConfirmationCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceName =
    searchParams.get("serviceName") ?? defaultMockAppointment.serviceName;
  const providerName =
    searchParams.get("providerName") ?? defaultMockAppointment.providerName;
  const date = searchParams.get("date") ?? defaultMockAppointment.date;
  const time = searchParams.get("time") ?? defaultMockAppointment.time;
  const address =
    searchParams.get("address") ?? defaultMockAppointment.address;
  const price =
    Number(searchParams.get("price")) || defaultMockAppointment.price;

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] =
    useState<PaymentMethodId | null>("pix");
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

  // Tela de pagamento aceito (sucesso)
  if (isSuccess) {
    return (
      <PaymentSuccess
        serviceName={serviceName}
        providerName={providerName}
        date={date}
        time={time}
        address={address}
        selectedPayment={selectedPayment}
        total={total}
        onNavigateHome={() => router.push("/home")}
        onNavigateHistory={() => router.push("/history")}
      />
    );
  }

  // Tela de pagamento e confirmação
  return (
    <>
      <PaymentHeader onBack={() => router.back()} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        <AppointmentDetailsCard
          serviceName={serviceName}
          date={date}
          time={time}
          address={address}
          selectedPayment={selectedPayment}
          onOpenPaymentModal={() => setPaymentModalOpen(true)}
        />

        <ConfirmationSidebar
          serviceName={serviceName}
          providerName={providerName}
          price={price}
          bookingFee={bookingFee}
          total={total}
          onConfirm={handleConfirm}
        />
      </div>

      <PaymentMethodModal
        open={isPaymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        selectedId={selectedPaymentId}
        onSelect={setSelectedPaymentId}
      />
    </>
  );
}
