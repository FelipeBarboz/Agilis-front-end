"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/ui/motion";
import { StoreCalendar } from "./_components/store-calendar";
import { StoreAppointmentCard, type StoreAppointment } from "./_components/store-appointment-card";
import { StoreEmptySchedule } from "./_components/store-empty-schedule";
import { StoreStats } from "./_components/store-stats";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const today = toLocalDateString(new Date());

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toLocalDateString(d);
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_STORE_APPOINTMENTS: StoreAppointment[] = [
  {
    id: "1",
    clientName: "Lucas Mendes",
    serviceName: "Limpeza de piscina",
    employeeName: "Rafael Silva",
    date: today,
    time: "09:00",
    duration: 120,
    address: "Rua das Flores, 123 – Guarulhos",
    status: "confirmed",
  },
  {
    id: "2",
    clientName: "Ana Paula Costa",
    serviceName: "Tratamento de água",
    employeeName: "Ana Beatriz",
    date: today,
    time: "14:00",
    duration: 90,
    address: "Av. Brasil, 456 – Guarulhos",
    status: "pending",
  },
  {
    id: "3",
    clientName: "Roberto Silva",
    serviceName: "Reparação de encanamento",
    employeeName: "Carlos Souza",
    date: today,
    time: "16:30",
    duration: 120,
    address: "Rua Ipê, 789 – Guarulhos",
    status: "cancelled",
  },
  {
    id: "4",
    clientName: "Carla Fernandes",
    serviceName: "Instalação de bomba",
    employeeName: "Rafael Silva",
    date: offsetDate(1),
    time: "10:00",
    duration: 60,
    address: "Rua Palmeiras, 22 – Guarulhos",
    status: "confirmed",
  },
  {
    id: "5",
    clientName: "Marcos Oliveira",
    serviceName: "Manutenção de Aquecedor",
    employeeName: "Carlos Souza",
    date: offsetDate(2),
    time: "08:30",
    duration: 120,
    address: "Rua das Acácias, 55 – Guarulhos",
    status: "pending",
  },
  {
    id: "6",
    clientName: "Juliana Rocha",
    serviceName: "Tratamento de água",
    employeeName: "Ana Beatriz",
    date: offsetDate(5),
    time: "11:00",
    duration: 90,
    address: "Alameda Santos, 300 – Guarulhos",
    status: "confirmed",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

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
    <div className="flex h-full flex-col overflow-y-auto bg-muted/40 pb-20">
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
