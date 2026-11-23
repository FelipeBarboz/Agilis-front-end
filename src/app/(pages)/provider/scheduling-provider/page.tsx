"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageTransition } from "@/components/ui/motion";
import { SchedulingCalendar } from "./_components/scheduling-calendar/scheduling-calendar";
import { AppointmentCard, type Appointment, type AppointmentStatus } from "./_components/appointment-card/appointment-card";
import { EmptySchedule } from "./_components/empty-schedule/empty-schedule";
import { SchedulingStats } from "./_components/scheduling-stats/scheduling-stats";
import {
  getStoreBookingsCalendar,
  getStoreBookingsOverview,
  confirmBooking,
  completeBooking,
  cancelBooking,
} from "@/lib/services/bookings-service";
import { getMyStores } from "@/lib/services/stores-service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const today = toLocalDateString(new Date());

function mapBookingStatus(status: string): AppointmentStatus {
  const s = (status ?? "").toUpperCase();
  if (s.includes("CANCEL")) return "cancelled";
  if (s.includes("COMPLET") || s.includes("CONCLU")) return "done";
  if (s.includes("PEND")) return "pending";
  return "confirmed";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulingProviderPage() {
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [storeId, setStoreId] = useState<string>("");
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<{ total: number; pending: number; confirmed: number }>({
    total: 0,
    pending: 0,
    confirmed: 0,
  });

  // Busca a loja do prestador autenticado
  useEffect(() => {
    let isCancelled = false;
    async function loadStore() {
      try {
        const myStores = await getMyStores();
        if (!isCancelled && myStores.length > 0 && myStores[0]?.storeId) {
          setStoreId(myStores[0].storeId);
        }
      } catch (err) {
        console.warn("[SchedulingProvider] Erro ao carregar lojas do prestador:", err);
      }
    }
    void loadStore();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Busca calendário de agendamentos da loja
  const loadCalendar = useCallback(async (sid: string) => {
    if (!sid) return;
    try {
      const cal = await getStoreBookingsCalendar(sid);
      if (Array.isArray(cal?.datesWithBookings)) {
        setBookedDates(cal.datesWithBookings);
      }
    } catch (err) {
      console.warn("[SchedulingProvider] Erro ao carregar calendário:", err);
    }
  }, []);

  // Busca visão geral do dia selecionado
  const loadOverview = useCallback(async (sid: string, date: string) => {
    if (!sid) return;
    setIsLoading(true);
    try {
      const overview = await getStoreBookingsOverview(sid, date);
      if (overview?.bookings) {
        const mapped: Appointment[] = overview.bookings.map((b) => {
          const hour = String(b.startTime?.hour ?? 0).padStart(2, "0");
          const minute = String(b.startTime?.minute ?? 0).padStart(2, "0");
          return {
            id: b.bookingId,
            clientName: b.clientName || "Cliente",
            serviceName: b.serviceTitle || "Serviço",
            date,
            time: `${hour}:${minute}`,
            duration: b.durationMinutes || 60,
            address: b.address || "Endereço não informado",
            status: mapBookingStatus(b.status),
          };
        });
        setAppointments(mapped);
        setMetrics({
          total: overview.metrics?.totalToday ?? mapped.length,
          pending: overview.metrics?.pendingCount ?? mapped.filter((a) => a.status === "pending").length,
          confirmed: overview.metrics?.confirmedCount ?? mapped.filter((a) => a.status === "confirmed").length,
        });
      } else {
        setAppointments([]);
        setMetrics({ total: 0, pending: 0, confirmed: 0 });
      }
    } catch (err) {
      console.warn("[SchedulingProvider] Erro ao carregar overview:", err);
      setAppointments([]);
      setMetrics({ total: 0, pending: 0, confirmed: 0 });
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

  async function handleConfirm(id: string) {
    try {
      await confirmBooking(id);
      if (storeId) {
        await loadOverview(storeId, selectedDate);
        await loadCalendar(storeId);
      }
    } catch (err) {
      console.warn("[SchedulingProvider] Erro ao confirmar agendamento:", err);
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
      console.warn("[SchedulingProvider] Erro ao concluir agendamento:", err);
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
      console.warn("[SchedulingProvider] Erro ao cancelar agendamento:", err);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-muted/40 pb-20">
      <PageTransition className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6">

          {/* Botão de retorno padrão Agilis */}
          <div>
            <Link
              href="/profile"
              aria-label="Voltar para perfil"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="size-5" />
            </Link>
          </div>

          {/* Page title */}
          <div>
            <h1 className="text-xl font-bold text-foreground">Gerencie seus agendamentos</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Selecione um dia para ver os detalhes
            </p>
          </div>

          {/* Calendar */}
          <SchedulingCalendar
            bookedDates={bookedDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Stats for selected day */}
          {appointments.length > 0 && (
            <SchedulingStats
              total={metrics.total}
              pending={metrics.pending}
              confirmed={metrics.confirmed}
            />
          )}

          {/* Appointments list */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Agendamentos do dia
            </h2>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                <Loader2 className="size-6 animate-spin text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Carregando agendamentos...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card shadow-sm">
                <EmptySchedule selectedDate={selectedDate} />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onConfirm={handleConfirm}
                    onComplete={handleComplete}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </PageTransition>
    </div>
  );
}
