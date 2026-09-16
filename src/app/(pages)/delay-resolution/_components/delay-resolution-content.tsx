"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_HISTORY } from "@/lib/mocks/history";
import { DelayServiceCard } from "./delay-service-card";
import { DelayNoticeCard } from "./delay-notice-card";
import { DelayOptionsSelector } from "./delay-options-selector";
import { PriorityRescheduleForm } from "./priority-reschedule-form";
import { RescheduleSuccess } from "../../reschedule/_components/reschedule-success";
import { SuccessCard } from "../../refund-confirmation/_components/success-card";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function DelayResolutionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const entry =
    MOCK_HISTORY.find((item) => item.id === id) ??
    MOCK_HISTORY.find((item) => item.status === "agendado") ??
    MOCK_HISTORY[1];

  const [mode, setMode] = useState<
    "options" | "priority-reschedule" | "reschedule-success" | "refund-success"
  >("options");

  const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [isSubmittingPriority, setIsSubmittingPriority] = useState(false);

  // Informações do atraso do prestador
  const originalTime = entry?.time ?? "09:30";
  const suggestedTime = "11:00";
  const delayReason = "Trânsito intenso na região e atendimento anterior estendido.";
  const estimatedDelay = "1h 30min";

  // Dados para confirmação de reagendamento
  const [confirmedDate, setConfirmedDate] = useState<Date>(() => new Date());
  const [confirmedTime, setConfirmedTime] = useState<string>(suggestedTime);

  const bookingFee = entry?.bookingFee ?? 10;
  const totalPrice = (entry?.price ?? 0) + bookingFee;
  const protocol = `AGL-${Math.floor(100000 + Math.random() * 900000)}`;

  // Ação 1: Aceitar o horário sugerido pelo prestador
  function handleAcceptSuggested() {
    setIsSubmittingAccept(true);
    setTimeout(() => {
      setIsSubmittingAccept(false);
      setConfirmedDate(new Date());
      setConfirmedTime(suggestedTime);
      setMode("reschedule-success");
    }, 600);
  }

  // Ação 2: Solicitar reembolso
  function handleRequestRefund() {
    setIsSubmittingRefund(true);
    setTimeout(() => {
      setIsSubmittingRefund(false);
      setMode("refund-success");
    }, 600);
  }

  // Ação 3: Confirmar reagendamento com prioridade
  function handleConfirmPriority(date: Date, time: string) {
    setIsSubmittingPriority(true);
    setTimeout(() => {
      setIsSubmittingPriority(false);
      setConfirmedDate(date);
      setConfirmedTime(time);
      setMode("reschedule-success");
    }, 600);
  }

  // Fim de fluxo: Reagendamento com Sucesso
  if (mode === "reschedule-success" && entry) {
    return (
      <RescheduleSuccess
        entry={entry}
        selectedDate={confirmedDate}
        selectedTime={confirmedTime}
        onBack={() => router.push("/history")}
      />
    );
  }

  // Fim de fluxo: Reembolso com Sucesso
  if (mode === "refund-success" && entry) {
    return (
      <SuccessCard
        protocol={protocol}
        serviceName={entry.serviceName}
        totalPrice={currencyFormatter.format(totalPrice)}
        paymentMethod={entry.paymentMethod ?? "Cartão de Crédito"}
        onBackToHistory={() => router.push("/history")}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      {entry && (
        <DelayServiceCard
          entry={entry}
          formattedTotal={currencyFormatter.format(totalPrice)}
        />
      )}

      {mode === "options" && (
        <>
          <DelayNoticeCard
            originalTime={originalTime}
            suggestedTime={suggestedTime}
            delayReason={delayReason}
            estimatedDelay={estimatedDelay}
            providerName={entry?.counterpartName ?? "O prestador"}
          />

          <DelayOptionsSelector
            suggestedTime={suggestedTime}
            isSubmittingAccept={isSubmittingAccept}
            isSubmittingRefund={isSubmittingRefund}
            onAcceptSuggested={handleAcceptSuggested}
            onSelectRefund={handleRequestRefund}
            onSelectPriorityReschedule={() => setMode("priority-reschedule")}
          />
        </>
      )}

      {mode === "priority-reschedule" && (
        <PriorityRescheduleForm
          onConfirm={handleConfirmPriority}
          onBackToOptions={() => setMode("options")}
          isSubmitting={isSubmittingPriority}
        />
      )}
    </div>
  );
}
