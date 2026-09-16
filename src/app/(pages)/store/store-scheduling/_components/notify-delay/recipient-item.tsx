"use client";

import type { StoreAppointment } from "../store-appointment-card";

interface RecipientItemProps {
  appointment: StoreAppointment;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

export function RecipientItem({ appointment, isChecked, onToggle }: RecipientItemProps) {
  return (
    <label
      className={`flex items-center justify-between gap-2 p-2 rounded-lg transition-colors cursor-pointer text-xs ${
        isChecked ? "bg-background shadow-xs font-medium" : "hover:bg-background/60"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggle(appointment.id)}
          className="rounded border-input text-primary focus:ring-primary h-4 w-4 shrink-0"
        />
        <div className="truncate">
          <span className="font-semibold text-foreground">
            {appointment.clientName}
          </span>
          <span className="text-muted-foreground ml-1.5 truncate">
            • {appointment.serviceName}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 font-mono text-muted-foreground text-[11px]">
        <span>{appointment.date}</span>
        <span className="font-bold text-foreground bg-muted px-1.5 py-0.5 rounded">
          {appointment.time}
        </span>
      </div>
    </label>
  );
}
