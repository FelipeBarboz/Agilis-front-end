import { CalendarCheck2, Hourglass, XCircle } from "lucide-react";

interface SchedulingStatsProps {
  total: number;
  pending: number;
  cancelled: number;
}

export function SchedulingStats({ total, pending, cancelled }: SchedulingStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="flex flex-col items-center gap-1 rounded-2xl border bg-white p-3 shadow-sm text-center">
        <CalendarCheck2 className="size-5 text-primary" strokeWidth={1.5} />
        <span className="text-lg font-bold text-foreground leading-none">{total}</span>
        <span className="text-[10px] text-muted-foreground font-medium">Total hoje</span>
      </div>
      <div className="flex flex-col items-center gap-1 rounded-2xl border bg-white p-3 shadow-sm text-center">
        <Hourglass className="size-5 text-amber-500" strokeWidth={1.5} />
        <span className="text-lg font-bold text-foreground leading-none">{pending}</span>
        <span className="text-[10px] text-muted-foreground font-medium">Pendentes</span>
      </div>
      <div className="flex flex-col items-center gap-1 rounded-2xl border bg-white p-3 shadow-sm text-center">
        <XCircle className="size-5 text-red-400" strokeWidth={1.5} />
        <span className="text-lg font-bold text-foreground leading-none">{cancelled}</span>
        <span className="text-[10px] text-muted-foreground font-medium">Cancelados</span>
      </div>
    </div>
  );
}
