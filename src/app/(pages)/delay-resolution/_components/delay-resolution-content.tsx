"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { mapBookingDetailToHistoryEntry } from "@/lib/utils/booking-detail-mapper";
import type { HistoryEntry } from "@/types/history";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatDelayDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "Alguns minutos";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function DelayResolutionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [pendingDelay, setPendingDelay] = useState<PendingDelayItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [mode, setMode] = useState<
    "options" | "priority-reschedule" | "reschedule-success" | "refund-success"
  >("options");

  const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [isSubmittingPriority, setIsSubmittingPriority] = useState(false);

  const [confirmedDate, setConfirmedDate] = useState<Date>(() => new Date());
  const [confirmedTime, setConfirmedTime] = useState<string>("11:00");

  useEffect(() => {
    let isCancelled = false;

    async function loadDelayData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const delays = await getPendingDelays();
        if (isCancelled) return;

        const match =
          delays && delays.length > 0
            ? id
              ? delays.find((d) => d.bookingId === id) ?? delays[0]
              : delays[0]
            : null;

        if (match) {
          setPendingDelay(match);
          if (match.newScheduledAt) {
            setConfirmedTime(match.newScheduledAt.slice(11, 16));
          }
        }

        const targetBookingId = id ?? match?.bookingId;
        if (targetBookingId) {
          const detail = await getBookingDetail(targetBookingId);
          if (!isCancelled && detail) {
            setEntry(mapBookingDetailToHistoryEntry(detail));
          }
        }
      } catch (err) {
        if (!isCancelled) {
          const msg =
            err instanceof Error
              ? err.message
              : "Não foi possível carregar as informações do atraso.";
          setLoadError(msg);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    void loadDelayData();
    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Informações do atraso do prestador
  const originalTime = pendingDelay?.originalScheduledAt
    ? pendingDelay.originalScheduledAt.slice(11, 16)
    : entry?.time ?? "—";
  const suggestedTime = pendingDelay?.newScheduledAt
    ? pendingDelay.newScheduledAt.slice(11, 16)
    : entry?.time ?? "—";
  const delayReason =
    pendingDelay?.reason ?? "Imprevisto informado pelo prestador.";
  const estimatedDelay = pendingDelay
    ? formatDelayDuration(pendingDelay.delayMinutes)
    : "—";

  const bookingFee = entry?.bookingFee ?? 0;
  const totalPrice = (entry?.price ?? 0) + bookingFee;
  const protocol = entry
    ? `AGL-${entry.id.slice(0, 8).toUpperCase()}`
    : "AGL-00000000";

  // Ação 1: Aceitar o horário sugerido pelo prestador (ACCEPT_NEW_TIME)
  async function handleAcceptSuggested() {
    if (!pendingDelay?.delayId) {
      setActionError("Nenhum aviso de atraso pendente encontrado para confirmar.");
      return;
    }

    setIsSubmittingAccept(true);
    setActionError(null);
    try {
      await respondToDelay(pendingDelay.delayId, "ACCEPT_NEW_TIME");
      setConfirmedDate(
        pendingDelay.newScheduledAt
          ? new Date(pendingDelay.newScheduledAt)
          : new Date()
      );
      setConfirmedTime(suggestedTime);
      setMode("reschedule-success");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível aceitar o novo horário.";
      setActionError(msg);
    } finally {
      setIsSubmittingAccept(false);
    }
  }

  // Ação 2: Solicitar reembolso (REQUEST_REFUND)
  async function handleRequestRefund() {
    if (!pendingDelay?.delayId) {
      setActionError("Nenhum aviso de atraso pendente encontrado para reembolso.");
      return;
    }

    setIsSubmittingRefund(true);
    setActionError(null);
    try {
      await respondToDelay(pendingDelay.delayId, "REQUEST_REFUND");
      setMode("refund-success");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível solicitar o reembolso.";
      setActionError(msg);
    } finally {
      setIsSubmittingRefund(false);
    }
  }

  // Ação 3: Confirmar reagendamento com prioridade (REQUEST_RESCHEDULE)
  async function handleConfirmPriority(date: Date, time: string) {
    if (!pendingDelay?.delayId) {
      setActionError("Nenhum aviso de atraso pendente encontrado para reagendar.");
      return;
    }

    setIsSubmittingPriority(true);
    setActionError(null);
    try {
      await respondToDelay(pendingDelay.delayId, "REQUEST_RESCHEDULE");
      setConfirmedDate(date);
      setConfirmedTime(time);
      setMode("reschedule-success");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível solicitar o reagendamento prioritário.";
      setActionError(msg);
    } finally {
      setIsSubmittingPriority(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background p-12 text-muted-foreground">
        <Loader2 className="size-7 animate-spin text-primary" />
        <p className="text-sm">Carregando detalhes do atraso...</p>
      </div>
    );
  }

  if (loadError || (!entry && !pendingDelay)) {
    return (
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-background p-8 text-center space-y-4">
        <div className="flex flex-col items-center gap-2">
          {loadError ? (
            <AlertCircle className="size-8 text-destructive" />
          ) : (
            <Clock className="size-8 text-muted-foreground" />
          )}
          <p className="text-base font-semibold text-foreground">
            {loadError
              ? "Erro ao carregar atraso"
              : "Nenhum atraso pendente encontrado"}
          </p>
          <p className="text-sm text-muted-foreground">
            {loadError ??
              "Não há notificações de atraso aguardando sua resposta no momento."}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => router.push("/history")}
          className="rounded-xl cursor-pointer"
        >
          Voltar ao Histórico
        </Button>
      </div>
    );
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

      {actionError && (
        <div className="flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{actionError}</span>
        </div>
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
            onSelectPriorityReschedule={() => {
              setActionError(null);
              setMode("priority-reschedule");
            }}
          />
        </>
      )}

      {mode === "priority-reschedule" && (
        <PriorityRescheduleForm
          onConfirm={handleConfirmPriority}
          onBackToOptions={() => {
            setActionError(null);
            setMode("options");
          }}
          isSubmitting={isSubmittingPriority}
        />
      )}
    </div>
  );
}
