"use client";

import { Users, Moon, Clock } from "lucide-react";

interface ScheduleStatsCardsProps {
  scheduledCount: number;
  offCount: number;
  coverageText: string;
}

export function ScheduleStatsCards({
  scheduledCount,
  offCount,
  coverageText,
}: ScheduleStatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Escalados */}
      <div className="flex flex-col items-center justify-center gap-1 rounded-[18px] border border-border bg-card p-4 shadow-sm text-center">
        <Users className="size-5 text-primary" strokeWidth={1.8} />
        <strong className="text-2xl font-bold text-foreground leading-tight tabular-nums">
          {scheduledCount}
        </strong>
        <span className="text-xs text-muted-foreground">Escalados</span>
      </div>

      {/* Folgas */}
      <div className="flex flex-col items-center justify-center gap-1 rounded-[18px] border border-border bg-card p-4 shadow-sm text-center">
        <Moon className="size-5 text-primary" strokeWidth={1.8} />
        <strong className="text-2xl font-bold text-foreground leading-tight tabular-nums">
          {offCount}
        </strong>
        <span className="text-xs text-muted-foreground">Folgas</span>
      </div>

      {/* Cobertura */}
      <div className="flex flex-col items-center justify-center gap-1 rounded-[18px] border border-border bg-card p-4 shadow-sm text-center">
        <Clock className="size-5 text-primary" strokeWidth={1.8} />
        <strong className="text-[17px] font-bold text-foreground leading-[1.7] tabular-nums whitespace-nowrap">
          {coverageText}
        </strong>
        <span className="text-xs text-muted-foreground">Cobertura</span>
      </div>
    </div>
  );
}
