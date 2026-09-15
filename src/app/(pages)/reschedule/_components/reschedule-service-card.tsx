import { Clock } from "lucide-react";
import type { HistoryEntry } from "@/types/history";

interface RescheduleServiceCardProps {
  entry: HistoryEntry;
}

export function RescheduleServiceCard({ entry }: RescheduleServiceCardProps) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-background p-5 shadow-xs">
      {entry.imageUrl && entry.imageUrl.trim() !== "" ? (
        <img
          src={entry.imageUrl}
          alt={entry.serviceName}
          className="h-20 w-20 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
          {entry.serviceName?.[0] ?? "S"}
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <span className="text-xs font-semibold text-primary">
            {entry.category ?? "Serviço"}
          </span>
          <h2 className="text-base font-bold text-foreground">{entry.serviceName}</h2>
          <p className="text-xs text-muted-foreground">
            {entry.counterpartRole === "prestador" ? "Prestador: " : "Cliente: "}
            {entry.counterpartName}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>
            Agendamento atual: {entry.date} às {entry.time ?? "14:00"}
          </span>
        </div>
      </div>
    </div>
  );
}
