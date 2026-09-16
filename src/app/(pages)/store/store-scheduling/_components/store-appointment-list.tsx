"use client";

import { AlertTriangle } from "lucide-react";
import { StoreAppointmentCard, type StoreAppointment } from "./store-appointment-card";
import { StoreEmptySchedule } from "./store-empty-schedule";

interface StoreAppointmentListProps {
  selectedDate: string;
  dayAppointments: StoreAppointment[];
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onOpenDelayModal: (id?: string) => void;
}

export function StoreAppointmentList({
  selectedDate,
  dayAppointments,
  onConfirm,
  onCancel,
  onOpenDelayModal,
}: StoreAppointmentListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">
          Agendamentos do dia
        </h2>
        {dayAppointments.length > 0 && (
          <button
            type="button"
            onClick={() => onOpenDelayModal()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors hover:bg-amber-500/20 cursor-pointer shadow-xs"
          >
            <AlertTriangle className="size-3.5" />
            Notificar Atraso no Dia
          </button>
        )}
      </div>

      {dayAppointments.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <StoreEmptySchedule
            selectedDate={selectedDate}
            onOpenDelayModal={() => onOpenDelayModal()}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {dayAppointments.map((appointment) => (
            <StoreAppointmentCard
              key={appointment.id}
              appointment={appointment}
              onConfirm={onConfirm}
              onCancel={onCancel}
              onNotifyDelay={(id) => onOpenDelayModal(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
