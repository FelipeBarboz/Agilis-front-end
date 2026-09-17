"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageTransition } from "@/components/ui/motion";
import { StoreSchedulingHeader } from "./_components/store-scheduling-header";
import { StoreCalendar } from "./_components/store-calendar";
import { StoreAppointmentList } from "./_components/store-appointment-list";
import { type StoreAppointment } from "./_components/store-appointment-card";
import { StoreStats } from "./_components/store-stats";
import { NotifyDelayModal } from "./_components/notify-delay-modal";
import { MOCK_STORE_APPOINTMENTS } from "@/lib/mocks/store-appointments";
import { today } from "./_components/date-helper";

function StoreSchedulingContent() {
  const searchParams = useSearchParams();
  const shouldOpenDelay = searchParams.get("delay") === "true";
  const queryAppointmentId = searchParams.get("id");

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [appointments, setAppointments] = useState<StoreAppointment[]>(MOCK_STORE_APPOINTMENTS);
  const [isNotifyDelayOpen, setIsNotifyDelayOpen] = useState(shouldOpenDelay || Boolean(queryAppointmentId));
  const [delayAppointmentId, setDelayAppointmentId] = useState<string | null>(queryAppointmentId);

  const bookedDates = [...new Set(appointments.map((a) => a.date))];

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

  function handleConfirm(id: string) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "confirmed" } : a))
    );
  }

  function handleCancel(id: string) {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }

  function handleOpenDelayModal(id?: string) {
    setDelayAppointmentId(id ?? null);
    setIsNotifyDelayOpen(true);
  }

  return (
    <div className="flex flex-1 flex-col bg-muted pb-20">
      <PageTransition className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6">

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
          <StoreAppointmentList
            selectedDate={selectedDate}
            dayAppointments={dayAppointments}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onOpenDelayModal={(id) => handleOpenDelayModal(id)}
          />

          {/* Modal de disparo de aviso de atraso */}
          <NotifyDelayModal
            open={isNotifyDelayOpen}
            onClose={() => {
              setIsNotifyDelayOpen(false);
              setDelayAppointmentId(null);
            }}
            dayAppointments={dayAppointments}
            allAppointments={appointments}
            selectedDate={selectedDate}
            initialAppointmentId={delayAppointmentId}
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
