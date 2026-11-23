"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageTransition } from "@/components/ui/motion";
import { StoreSchedulingHeader } from "./_components/store-scheduling-header";
import { StoreCalendar } from "./_components/store-calendar";
import { StoreAppointmentList } from "./_components/store-appointment-list";
import { type StoreAppointment } from "./_components/store-appointment-card";
import { StoreStats } from "./_components/store-stats";
import { NotifyDelayModal } from "./_components/notify-delay-modal";
import { today } from "./_components/date-helper";
import {
  getStoreBookingsCalendar,
  getStoreBookingsOverview,
  confirmBooking,
  completeBooking,
  cancelBooking,
} from "@/lib/services/bookings-service";
import { getMyStores } from "@/lib/services/stores-service";

function mapStoreBookingStatus(status: string): "pending" | "confirmed" | "cancelled" | "done" {
  const s = (status ?? "").toUpperCase();
  if (s.includes("CANCEL")) return "cancelled";
  if (s.includes("COMPLET") || s.includes("CONCLU")) return "done";
  if (s.includes("PEND")) return "pending";
  return "confirmed";
}

function StoreSchedulingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldOpenDelay = searchParams.get("delay") === "true";
  const queryAppointmentId = searchParams.get("id");
  const storeIdParam = searchParams.get("storeId");

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [storeId, setStoreId] = useState<string>(storeIdParam ?? "");
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<StoreAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotifyDelayOpen, setIsNotifyDelayOpen] = useState(shouldOpenDelay || Boolean(queryAppointmentId));
  const [delayAppointmentId, setDelayAppointmentId] = useState<string | null>(queryAppointmentId);

  // Obtém o storeId caso não esteja nos searchParams
  useEffect(() => {
    let isCancelled = false;
    if (storeIdParam) {
      setStoreId(storeIdParam);
      return;
    }

    async function loadStore() {
      try {
        const myStores = await getMyStores();
        if (!isCancelled && myStores.length > 0 && myStores[0]?.storeId) {
          setStoreId(myStores[0].storeId);
        }
      } catch (err) {
        console.warn("[StoreScheduling] Erro ao carregar lojas:", err);
      }
    }
    void loadStore();

    return () => {
      isCancelled = true;
    };
  }, [storeIdParam]);

  // Carrega calendário de datas com agendamentos
  const loadCalendar = useCallback(async (sid: string) => {
    if (!sid) return;
    try {
      const cal = await getStoreBookingsCalendar(sid);
      if (Array.isArray(cal?.datesWithBookings)) {
        setBookedDates(cal.datesWithBookings);
      }
    } catch (err) {
      console.warn("[StoreScheduling] Erro ao carregar calendário:", err);
    }
  }, []);

  // Carrega visão geral do dia selecionado
  const loadOverview = useCallback(async (sid: string, date: string) => {
    if (!sid) return;
    setIsLoading(true);
    try {
      const overview = await getStoreBookingsOverview(sid, date);
      if (overview?.bookings) {
        const mapped: StoreAppointment[] = overview.bookings.map((b) => {
          let timeStr = "09:00";
          if (typeof b.startTime === "string") {
            timeStr = b.startTime.slice(0, 5);
          } else if (b.startTime && typeof b.startTime === "object") {
            const hour = String(b.startTime.hour ?? 0).padStart(2, "0");
            const minute = String(b.startTime.minute ?? 0).padStart(2, "0");
            timeStr = `${hour}:${minute}`;
          }
          return {
            id: b.bookingId,
            clientName: b.clientName || "Cliente",
            serviceName: b.serviceTitle || "Serviço",
            employeeName: b.employeeName || "Prestador",
            date,
            time: timeStr,
            duration: b.durationMinutes || 60,
            address: b.address || "Endereço não informado",
            status: mapStoreBookingStatus(b.status),
          };
        });
        setAppointments(mapped);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.warn("[StoreScheduling] Erro ao carregar agendamentos:", err);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (storeId) {
      void loadCalendar(storeId);
      void loadOverview(storeId, selectedDate);
    } else {
      setIsLoading(false);
    }
  }, [storeId, selectedDate, loadCalendar, loadOverview]);

  const dayAppointments = appointments
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const pending = dayAppointments.filter((a) => a.status === "pending").length;
  const confirmed = dayAppointments.filter((a) => a.status === "confirmed").length;

  useEffect(() => {
    if (shouldOpenDelay || queryAppointmentId) {
      setIsNotifyDelayOpen(true);
      if (queryAppointmentId) {
        setDelayAppointmentId(queryAppointmentId);
      }
    }
  }, [shouldOpenDelay, queryAppointmentId]);

  async function handleConfirm(id: string) {
    try {
      await confirmBooking(id);
      if (storeId) {
        await loadOverview(storeId, selectedDate);
        await loadCalendar(storeId);
      }
    } catch (err) {
      console.warn("[StoreScheduling] Erro ao confirmar agendamento:", err);
    }
  }

  async function handleComplete(id: string) {
    try {
      await completeBooking(id);
      if (storeId) {
        await loadOverview(storeId, selectedDate);
        await loadCalendar(storeId);
      }
    } catch (err) {
      console.warn("[StoreScheduling] Erro ao concluir agendamento:", err);
    }
  }

  async function handleCancel(id: string) {
    try {
      await cancelBooking(id);
      if (storeId) {
        await loadOverview(storeId, selectedDate);
        await loadCalendar(storeId);
      }
    } catch (err) {
      console.warn("[StoreScheduling] Erro ao cancelar agendamento:", err);
    }
  }

  function handleOpenDelayModal(id?: string) {
    setDelayAppointmentId(id ?? null);
    setIsNotifyDelayOpen(true);
  }

  return (
    <div className="relative flex flex-1 flex-col bg-muted pb-20">
      {/* Botão de voltar flutuante — padrão Agilis */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <PageTransition className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-2xl space-y-5 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">

          {/* Header da Página */}
          <StoreSchedulingHeader
            onOpenDelayModal={() => handleOpenDelayModal()}
          />

          {/* Calendário */}
          <StoreCalendar
            bookedDates={bookedDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Stats do dia selecionado */}
          {dayAppointments.length > 0 && (
            <StoreStats
              total={dayAppointments.length}
              pending={pending}
              confirmed={confirmed}
            />
          )}

          {/* Lista de Agendamentos */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <Loader2 className="size-6 animate-spin text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Carregando agendamentos da loja...</p>
            </div>
          ) : (
            <StoreAppointmentList
              selectedDate={selectedDate}
              dayAppointments={dayAppointments}
              onConfirm={handleConfirm}
              onComplete={handleComplete}
              onCancel={handleCancel}
              onOpenDelayModal={(id) => handleOpenDelayModal(id)}
            />
          )}

          {/* Modal de disparo de aviso de atraso */}
          <NotifyDelayModal
            open={isNotifyDelayOpen}
            onClose={() => {
              setIsNotifyDelayOpen(false);
              setDelayAppointmentId(null);
            }}
            storeId={storeId}
            dayAppointments={dayAppointments}
            allAppointments={appointments}
            selectedDate={selectedDate}
            initialAppointmentId={delayAppointmentId}
            onSuccessNotification={() => {
              if (storeId) {
                void loadOverview(storeId, selectedDate);
              }
            }}
          />

        </div>
      </PageTransition>
    </div>
  );
}

export default function StoreSchedulingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Carregando agendamentos...</div>}>
      <StoreSchedulingContent />
    </Suspense>
  );
}
