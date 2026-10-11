"use client";

interface ScheduleLegendProps {
  showNow?: boolean;
}

export function ScheduleLegend({ showNow = false }: ScheduleLegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-[12.5px] text-muted-foreground">
      {/* Seu horário */}
      <span className="inline-flex items-center gap-2">
        <i
          className="inline-block w-[26px] h-[14px] rounded-[5px] bg-primary shrink-0 not-italic"
          aria-hidden="true"
        />
        Seu horário
      </span>

      {/* Colegas */}
      <span className="inline-flex items-center gap-2">
        <i
          className="inline-block w-[26px] h-[14px] rounded-[5px] bg-emerald-500/10 border border-emerald-500/30 shrink-0 not-italic"
          aria-hidden="true"
        />
        Colegas
      </span>

      {/* Folga */}
      <span className="inline-flex items-center gap-2">
        <i
          className="inline-block w-[26px] h-[14px] rounded-[5px] border border-dashed border-border bg-transparent shrink-0 not-italic"
          aria-hidden="true"
        />
        Folga
      </span>

      {/* Hora atual (visão Dia quando ativa) */}
      {showNow && (
        <span className="inline-flex items-center gap-2">
          <i
            className="inline-block w-[2px] h-[14px] rounded-[2px] bg-destructive shrink-0 not-italic"
            aria-hidden="true"
          />
          Hora atual
        </span>
      )}
    </div>
  );
}
