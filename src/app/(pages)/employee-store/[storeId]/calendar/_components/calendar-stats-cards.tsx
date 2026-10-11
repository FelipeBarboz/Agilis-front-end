"use client";

import { CalendarDays, Hourglass, CheckCircle2 } from "lucide-react";

interface CalendarStatsCardsProps {
  total: number;
  pending: number;
  confirmed: number;
  totalLabel?: string; // "Total hoje", "Total no dia", "Total na semana"
}

export function CalendarStatsCards({
  total,
  pending,
  confirmed,
  totalLabel = "Total hoje",
}: CalendarStatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Total */}
      <div className="flex flex-col items-center justify-center gap-1 rounded-[18px] border border-border bg-card p-4 shadow-sm text-center">
        <CalendarDays className="size-5 text-primary" strokeWidth={1.8} />
        <strong className="text-2xl font-bold text-foreground leading-tight tabular-nums">
          {total}
        </strong>
        <span className="text-xs text-muted-foreground">{totalLabel}</span>
      </div>

      {/* Pendentes */}
      <div className="flex flex-col items-center justify-center gap-1 rounded-[18px] border border-border bg-card p-4 shadow-sm text-center">
        <Hourglass className="size-5 text-amber-500" strokeWidth={1.8} />
        <strong className="text-2xl font-bold text-foreground leading-tight tabular-nums">
          {pending}
        </strong>
        <span className="text-xs text-muted-foreground">Pendentes</span>
      </div>

      {/* Confirmados */}
      <div className="flex flex-col items-center justify-center gap-1 rounded-[18px] border border-border bg-card p-4 shadow-sm text-center">
        <CheckCircle2 className="size-5 text-primary" strokeWidth={1.8} />
        <strong className="text-2xl font-bold text-foreground leading-tight tabular-nums">
          {confirmed}
        </strong>
        <span className="text-xs text-muted-foreground">Confirmados</span>
      </div>
    </div>
  );
}
