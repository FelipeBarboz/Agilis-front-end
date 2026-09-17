import { Clock } from "lucide-react";
import type { HistoryEntry } from "@/types/history";

interface DelayServiceCardProps {
  entry: HistoryEntry;
  formattedTotal: string;
}

export function DelayServiceCard({
  entry,
  formattedTotal,
}: DelayServiceCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-border bg-background p-5 shadow-xs">
      {entry.imageUrl && entry.imageUrl.trim() !== "" ? (
        <img
          src={entry.imageUrl}
          alt={entry.serviceName}
          className="h-20 w-20 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary shrink-0">
          {entry.serviceName?.[0] ?? "S"}
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between gap-2">
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

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1 border-t border-border/60">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>
              Horário agendado: {entry.date} às {entry.time ?? "09:30"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">Valor pago:</span>
            <span className="font-bold text-foreground">{formattedTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
