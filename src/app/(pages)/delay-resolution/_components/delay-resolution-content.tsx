"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_HISTORY } from "@/lib/mocks/history";
import { DelayServiceCard } from "./delay-service-card";
import { DelayNoticeCard } from "./delay-notice-card";
import { DelayOptionsSelector } from "./delay-options-selector";
import { PriorityRescheduleForm } from "./priority-reschedule-form";
import { RescheduleSuccess } from "../../reschedule/_components/reschedule-success";
import { SuccessCard } from "../../refund-confirmation/_components/success-card";
import {
  getPendingDelays,
  respondToDelay,
  getBookingDetail,
  type PendingDelayItem,
} from "@/lib/services/bookings-service";
import { type HistoryEntry } from "@/types/history";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function DelayResolutionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [entry, setEntry] = useState<HistoryEntry | null>(() => {
    return (
      MOCK_HISTORY.find((item) => item.id === id) ??
      MOCK_HISTORY.find((item) => item.status === "agendado") ??
      MOCK_HISTORY[1] ??
      null
    );
  });

  const [pendingDelay, setPendingDelay] = useState<PendingDelayItem | null>(null);

  const [mode, setMode] = useState<
    "options" | "priority-reschedule" | "reschedule-success" | "refund-success"
  >("options");

  const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [isSubmittingPriority, setIsSubmittingPriority] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    // 1. Carrega atraso pendente da API se houver
    getPendingDelays()
      .then((delays) => {
        if (!isCancelled && delays && delays.length > 0) {
          const match = id ? delays.find((d) => d.bookingId === id) : delays[0];
          if (match) {
            setPendingDelay(match);
          }
        }
      })
      .catch((err) => {
        console.warn("[DelayResolution] Usando atraso padrão:", err);
      });

    // 2. Carrega detalhes do agendamento se id estiver presente
    if (id) {
      getBookingDetail(id)
        .then((detail) => {
          if (!isCancelled && detail) {
            setEntry({
              id: detail.bookingId,
              serviceName: detail.serviceTitle,
              imageUrl:
                detail.thumbnailUrl ||
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
              counterpartName: detail.storeName || "Prestador Agilis",
              counterpartRole: "prestador" as const,
              date: detail.date,
              time: detail.time ? detail.time.slice(0, 5) : "14:00",
              price: detail.price,
              bookingFee: detail.serviceFee ?? 5,
              status: "agendado",
              category: detail.category,
              address: detail.address ?? undefined,
              paymentMethod: typeof detail.paymentMethod === "string" ? detail.paymentMethod : "PIX",
            });
          }
        })
        .catch(() => {});
    }

    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Informações do atraso do prestador (usando dados do backend se disponíveis)
  const originalTime = pendingDelay
    ? pendingDelay.originalScheduledAt.slice(11, 16)
    : (entry?.time ?? "09:30");
  const suggestedTime = pendingDelay
    ? pendingDelay.newScheduledAt.slice(11, 16)
    : "11:00";
  const delayReason = pendingDelay?.reason || "Trânsito intenso na região e atendimento anterior estendido.";
  const estimatedDelay = pendingDelay ? `${pendingDelay.delayMinutes} min` : "1h 30min";

  // Dados para confirmação de reagendamento
  const [confirmedDate, setConfirmedDate] = useState<Date>(() => new Date());
  const [confirmedTime, setConfirmedTime] = useState<string>(suggestedTime);

  const bookingFee = entry?.bookingFee ?? 5;
  const totalPrice = (entry?.price ?? 0) + bookingFee;
  const protocol = `AGL-${Math.floor(100000 + Math.random() * 900000)}`;

  // Ação 1: Aceitar o horário sugerido pelo prestador (ACCEPT_NEW_TIME)
  async function handleAcceptSuggested() {
    setIsSubmittingAccept(true);
    try {
      if (pendingDelay?.delayId) {
        await respondToDelay(pendingDelay.delayId, "ACCEPT_NEW_TIME");
      }
    } catch (err) {
      console.warn("[DelayResolution] Falha ao responder atraso:", err);
    } finally {
      setIsSubmittingAccept(false);
      setConfirmedDate(new Date());
      setConfirmedTime(suggestedTime);
      setMode("reschedule-success");
    }
  }

  // Ação 2: Solicitar reembolso (REQUEST_REFUND)
  async function handleRequestRefund() {
    setIsSubmittingRefund(true);
    try {
      if (pendingDelay?.delayId) {
        await respondToDelay(pendingDelay.delayId, "REQUEST_REFUND");
      }
    } catch (err) {
      console.warn("[DelayResolution] Falha ao solicitar reembolso:", err);
    } finally {
      setIsSubmittingRefund(false);
      setMode("refund-success");
    }
  }

  // Ação 3: Confirmar reagendamento com prioridade (REQUEST_RESCHEDULE)
  async function handleConfirmPriority(date: Date, time: string) {
    setIsSubmittingPriority(true);
    try {
      if (pendingDelay?.delayId) {
        await respondToDelay(pendingDelay.delayId, "REQUEST_RESCHEDULE");
      }
    } catch (err) {
      console.warn("[DelayResolution] Falha ao solicitar reagendamento prioritário:", err);
    } finally {
      setIsSubmittingPriority(false);
      setConfirmedDate(date);
      setConfirmedTime(time);
      setMode("reschedule-success");
    }
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
