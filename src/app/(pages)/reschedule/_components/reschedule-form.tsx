"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RescheduleServiceCard } from "./reschedule-service-card";
import { RescheduleDateTimePicker } from "./reschedule-datetime-picker";
import { RescheduleReasonField } from "./reschedule-reason-field";
import { ReschedulePolicyNotice } from "./reschedule-policy-notice";
import { RescheduleActions } from "./reschedule-actions";
import { RescheduleSuccess } from "./reschedule-success";
import {
  getBookingById,
  getBookingDetail,
  createBooking,
  cancelBooking,
  type BookingDetailDTO,
} from "@/lib/services/bookings-service";
import { getServiceById } from "@/lib/services/services-service";
import { mapBookingDetailToHistoryEntry } from "@/lib/utils/booking-detail-mapper";
import { useAuth } from "@/lib/auth/auth-context";
import type { HistoryEntry } from "@/types/history";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

export function RescheduleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, supabaseUser } = useAuth();
  const currentUserId = user?.id ?? supabaseUser?.id ?? "";

  const id = searchParams.get("id");

  const [booking, setBooking] = useState<BookingDetailDTO | null>(null);
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(id));

  const [selectedDate, setSelectedDate] = useState<Date>(
    () => new Date(Date.now() + 86400000)
  );
  const [selectedTime, setSelectedTime] = useState<string>("14:00");
  const [reason, setReason] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    let isCancelled = false;

    if (!id) {
      setIsLoading(false);
      return;
    }

    async function loadBookingData() {
      setIsLoading(true);
      try {
        const [detailRes, simpleRes] = await Promise.allSettled([
          getBookingDetail(id!),
          getBookingById(id!),
        ]);

        if (isCancelled) return;

        const simple =
          simpleRes.status === "fulfilled" ? simpleRes.value : null;
        if (simple) setBooking(simple);

        if (detailRes.status === "fulfilled" && detailRes.value) {
          setEntry(mapBookingDetailToHistoryEntry(detailRes.value));
          return;
        }

        if (simple) {
          let serviceTitle = simple.serviceTitle ?? "Serviço";
          let companyName = "Prestador Agilis";
          let imageUrl =
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800";
          let price = 0;
          let category = "Geral";

          if (simple.serviceId) {
            try {
              const s = await getServiceById(simple.serviceId);
              if (s) {
                serviceTitle = s.title;
                companyName = s.company ?? companyName;
                imageUrl = s.images[0]?.url ?? imageUrl;
                price = s.price.inicial ?? price;
                category = s.category ?? category;
              }
            } catch {
              // Mantém valores básicos
            }
          }

          const dateObj = new Date(simple.scheduledAt);
          const timeStr = !isNaN(dateObj.getTime())
            ? dateObj.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "14:00";
          const formattedDate = !isNaN(dateObj.getTime())
            ? dateObj.toLocaleDateString("pt-BR")
            : simple.scheduledAt;

          if (!isCancelled) {
            setEntry({
              id: simple.bookingId,
              serviceName: serviceTitle,
              imageUrl,
              counterpartName: companyName,
              counterpartRole: "prestador",
              date: formattedDate,
              time: timeStr,
              price,
              bookingFee: 0,
              status: "agendado",
              category,
            });
          }
        }
      } catch (err) {
        console.warn("[Reschedule] Erro ao buscar agendamento pelo ID:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadBookingData();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(hours ?? 0, minutes ?? 0, 0, 0);
      const scheduledAt = scheduledDate.toISOString();

      const clientId = booking?.clientId ?? currentUserId ?? "";
      const serviceId = booking?.serviceId ?? "";

      if (!serviceId) {
        setErrorMessage(
          "Não foi possível identificar o serviço para reagendamento."
        );
        setIsSubmitting(false);
        return;
      }

      // Cria o novo agendamento com o novo horário
      await createBooking({
        clientId,
        serviceId,
        scheduledAt,
        notes: reason.trim()
          ? `Reagendamento: ${reason.trim()}`
          : "Reagendamento de serviço",
      });

      // Cancela o agendamento anterior
      if (id) {
        await cancelBooking(id);
      }

      setIsSuccess(true);
    } catch (err) {
      console.warn("[Reschedule] Erro ao processar reagendamento:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível concluir o reagendamento.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-semibold text-foreground">
          Carregando agendamento...
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Buscando detalhes do serviço
        </p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-background p-8 text-center space-y-4">
        <AlertCircle className="mx-auto size-8 text-muted-foreground" />
        <p className="text-base font-semibold text-foreground">
          Agendamento não encontrado
        </p>
        <p className="text-sm text-muted-foreground">
          Selecione um agendamento válido no seu histórico para reagendar.
        </p>
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

  if (isSuccess) {
    return (
      <RescheduleSuccess
        entry={entry}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onBack={() => router.push("/history")}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <RescheduleServiceCard entry={entry} />

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-background p-6 shadow-sm space-y-6"
      >
        <RescheduleDateTimePicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          minDate={today}
        />

        <RescheduleReasonField value={reason} onChange={setReason} />

        <ReschedulePolicyNotice />

        {errorMessage && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            {errorMessage}
          </div>
        )}

        <RescheduleActions isSubmitting={isSubmitting} />
      </form>
    </div>
  );
}
