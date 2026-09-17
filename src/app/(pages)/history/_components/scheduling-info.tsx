import { Calendar, Clock, MapPin } from "lucide-react";

interface SchedulingInfoProps {
  formattedDate: string;
  time?: string;
  duration?: string;
  address?: string;
}

export function SchedulingInfo({
  formattedDate,
  time,
  duration,
  address,
}: SchedulingInfoProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-xs space-y-3.5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Informações de Atendimento
      </h4>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-2.5">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-[11px] text-muted-foreground">Data do serviço</p>
            <p className="text-xs font-medium leading-tight text-foreground">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-[11px] text-muted-foreground">Horário e duração</p>
            <p className="text-xs font-medium leading-tight text-foreground">
              {time ?? "Horário comercial"}
              {duration ? ` (${duration})` : ""}
            </p>
          </div>
        </div>
      </div>

      {address && (
        <div className="flex items-start gap-2.5 border-t border-border/60 pt-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-[11px] text-muted-foreground">Local de atendimento</p>
            <p className="text-xs font-medium leading-tight text-foreground">{address}</p>
          </div>
        </div>
      )}
    </div>
  );
}
