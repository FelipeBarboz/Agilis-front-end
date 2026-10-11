"use client";

import { Clock, MapPin, User, CheckCircle2, Hourglass, XCircle } from "lucide-react";
import type {
  CalendarAppointmentStatus,
  EmployeeCalendarAppointment,
} from "@/lib/mocks/employee-calendar-appointments";

interface CalendarAppointmentCardProps {
  appointment: EmployeeCalendarAppointment;
}

const STATUS_CONFIG: Record<
  CalendarAppointmentStatus,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  confirmed: {
    label: "Confirmado",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-700 dark:text-emerald-400",
    borderClass: "border-emerald-500/20",
    Icon: CheckCircle2,
  },
  pending: {
    label: "Pendente",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-700 dark:text-amber-400",
    borderClass: "border-amber-500/20",
    Icon: Hourglass,
  },
  cancelled: {
    label: "Cancelado",
    bgClass: "bg-destructive/10",
    textClass: "text-destructive",
    borderClass: "border-destructive/20",
    Icon: XCircle,
  },
  done: {
    label: "Concluído",
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
    borderClass: "border-border",
    Icon: CheckCircle2,
  },
};

export function CalendarAppointmentCard({ appointment }: CalendarAppointmentCardProps) {
  const cfg = STATUS_CONFIG[appointment.status];
  const Icon = cfg.Icon;

  return (
    <article className="rounded-[18px] border border-border bg-card p-4 sm:px-5 sm:py-4 shadow-sm flex flex-col gap-1.5 transition-colors">
      {/* Linha 1: nome do serviço e pílula de status */}
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-base font-bold text-foreground leading-snug">
          {appointment.serviceName}
        </h4>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`}
        >
          <Icon className="size-[13px]" />
          {cfg.label}
        </span>
      </div>

      {/* Linha 2: cliente */}
      <p className="flex items-center gap-2 text-[13.5px] text-muted-foreground">
        <User className="size-4 shrink-0 text-muted-foreground" />
        <span>{appointment.clientName}</span>
      </p>

      {/* Linha 3: horário e duração */}
      <p className="flex items-center gap-2 text-[13.5px] text-muted-foreground">
        <Clock className="size-4 shrink-0 text-primary" />
        <span>
          <b className="font-semibold text-foreground tabular-nums">
            {appointment.startTime} – {appointment.endTime}
          </b>{" "}
          · {appointment.duration} min
        </span>
      </p>

      {/* Linha 4: endereço */}
      <p className="flex items-center gap-2 text-[13.5px] text-muted-foreground">
        <MapPin className="size-4 shrink-0 text-primary" />
        <span className="truncate">{appointment.address}</span>
      </p>
    </article>
  );
}
