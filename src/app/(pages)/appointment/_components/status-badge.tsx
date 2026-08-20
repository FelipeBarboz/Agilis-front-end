import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "./types";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  "in-progress": "Em andamento",
  scheduled: "Agendado",
  completed: "Concluído",
  canceled: "Cancelado",
};

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  "in-progress": "bg-amber-100 text-amber-800",
  scheduled: "bg-primary text-primary-foreground",
  completed: "bg-muted text-muted-foreground",
  canceled: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      <Clock className="h-3 w-3" />
      {STATUS_LABELS[status]}
    </span>
  );
}