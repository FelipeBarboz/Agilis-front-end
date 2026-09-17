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
