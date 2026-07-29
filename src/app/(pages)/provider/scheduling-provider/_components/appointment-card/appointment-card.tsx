import { Clock, MapPin, User, CheckCircle2, XCircle, Hourglass } from "lucide-react";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "done";

export interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  date: string;       // ISO: YYYY-MM-DD
  time: string;       // HH:MM
  duration: number;   // minutes
  address: string;
  status: AppointmentStatus;
}

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; bgClass: string; textClass: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  pending: {
    label: "Pendente",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    Icon: Hourglass,
  },
  confirmed: {
    label: "Confirmado",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    Icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelado",
    bgClass: "bg-red-50",
    textClass: "text-red-500",
    Icon: XCircle,
  },
  done: {
    label: "Concluído",
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
    Icon: CheckCircle2,
  },
};

interface AppointmentCardProps {
  appointment: Appointment;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function AppointmentCard({ appointment, onConfirm, onCancel }: AppointmentCardProps) {
  const { label, bgClass, textClass, Icon } = STATUS_CONFIG[appointment.status];
  const endHour = getEndTime(appointment.time, appointment.duration);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm flex flex-col gap-3">
      {/* Top row: service name + status badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-foreground leading-snug">{appointment.serviceName}</p>
          <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
            <User className="size-3.5 shrink-0" />
            <span className="text-xs">{appointment.clientName}</span>
          </div>
        </div>
        <span
          className={[
            "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            bgClass,
            textClass,
          ].join(" ")}
        >
          <Icon className="size-3" />
          {label}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5 shrink-0 text-primary" />
          <span>
            {appointment.time} – {endHour} &middot; {appointment.duration} min
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{appointment.address}</span>
        </div>
      </div>

      {/* Actions for pending */}
      {appointment.status === "pending" && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onConfirm?.(appointment.id)}
            className="flex-1 rounded-xl bg-primary py-2 text-xs font-bold text-white transition-colors hover:bg-primary/90"
          >
            Confirmar
          </button>
          <button
            onClick={() => onCancel?.(appointment.id)}
            className="flex-1 rounded-xl border border-destructive py-2 text-xs font-bold text-destructive transition-colors hover:bg-destructive/5"
          >
            Recusar
          </button>
        </div>
      )}
    </div>
  );
}

function getEndTime(start: string, durationMinutes: number): string {
  const [h = 0, m = 0] = start.split(":").map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;
  const endH = Math.floor(totalMinutes / 60) % 24;
  const endM = totalMinutes % 60;
  return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
}
