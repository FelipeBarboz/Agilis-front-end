import { Star, Clock, DollarSign, CalendarCheck } from "lucide-react";
import { type Service } from "@/lib/mocks/services";

interface ServiceInfoProps {
  service: Service;
}

export function ServiceInfo({ service }: ServiceInfoProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* Título */}
      <h1 className="text-2xl font-bold leading-tight text-foreground">
        {service.title}
      </h1>

      {/* Avaliação */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Star size={15} className="fill-yellow-400 text-yellow-400" />
        <span className="font-semibold text-foreground">{service.rating}</span>
        <span>({service.reviewCount})</span>
        <span>·</span>
        <span>{service.totalServices} serviços</span>
      </div>

      {/* Descrição */}
      <p className="text-sm leading-relaxed text-muted-foreground">
        {service.description}
      </p>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 text-center">
          <Clock size={18} className="text-primary" />
          <span className="text-xs text-muted-foreground">
            Duração média {service.durationMinutes} minutos
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 text-center">
          <DollarSign size={18} className="text-primary" />
          <span className="text-xs text-muted-foreground">
            A partir de R$ {service.price.inicial}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 text-center">
          <CalendarCheck size={18} className="text-primary" />
          <span className="text-xs text-muted-foreground">
            Agendamento escolher o melhor dia
          </span>
        </div>
      </div>

    </div>
  );
}