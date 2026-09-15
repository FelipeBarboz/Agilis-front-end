"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/ui/motion";
import { StoreCalendar } from "./_components/store-calendar";
import { StoreAppointmentCard, type StoreAppointment } from "./_components/store-appointment-card";
import { StoreEmptySchedule } from "./_components/store-empty-schedule";
import { StoreStats } from "./_components/store-stats";
import { MOCK_STORE_APPOINTMENTS } from "@/lib/mocks/store-appointments";
import { today } from "./_components/date-helper";

export default function StoreSchedulingPage() {
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [appointments, setAppointments] = useState<StoreAppointment[]>(MOCK_STORE_APPOINTMENTS);

  const bookedDates = [...new Set(appointments.map((a) => a.date))];

  const dayAppointments = appointments
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const pending = dayAppointments.filter((a) => a.status === "pending").length;
  const confirmed = dayAppointments.filter((a) => a.status === "confirmed").length;

  function handleConfirm(id: string) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "confirmed" } : a))
    );
  }

  function handleCancel(id: string) {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-muted pb-20">
      <PageTransition className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6">

          {/* Botão de retorno padrão Agilis */}
          <div>
            <Link
              href="/store/store-profile"
              aria-label="Voltar ao perfil da loja"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted cursor-pointer"
            >
              <ArrowLeft className="size-5" />
            </Link>
          </div>

          {/* Page title */}
          <div>
            <h1 className="text-xl font-bold text-foreground">Gerencie os agendamentos da loja</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Selecione um dia para ver os detalhes
            </p>
          </div>

          {/* Calendar */}
          <StoreCalendar
            bookedDates={bookedDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Stats for selected day */}
          {dayAppointments.length > 0 && (
            <StoreStats
              total={dayAppointments.length}
              pending={pending}
              confirmed={confirmed}
            />
          )}

          {/* Appointments list */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Agendamentos do dia
            </h2>

            {dayAppointments.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card shadow-sm">
                <StoreEmptySchedule selectedDate={selectedDate} />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {dayAppointments.map((appointment) => (
                  <StoreAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onConfirm={handleConfirm}
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
