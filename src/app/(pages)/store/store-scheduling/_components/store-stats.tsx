import { CalendarCheck2, Hourglass, CheckCircle2 } from "lucide-react";

interface StoreStatsProps {
  total: number;
  pending: number;
  confirmed: number;
}

export function StoreStats({ total, pending, confirmed }: StoreStatsProps) {
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
        <CheckCircle2 className="size-5 text-green-500" strokeWidth={1.5} />
        <span className="text-lg font-bold text-foreground leading-none">{confirmed}</span>
        <span className="text-[10px] text-muted-foreground font-medium">Confirmados</span>
      </div>
    </div>
  );
}
