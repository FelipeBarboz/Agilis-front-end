import { Star, Clock, DollarSign, CalendarCheck, MapPin, Tag } from "lucide-react";
import { type Service } from "@/lib/mocks/services";

interface ServiceInfoProps {
  service: Service;
}

export function ServiceInfo({ service }: ServiceInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Categoria e Título */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
            {service.category}
          </span>
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            {service.availability || "Disponível"}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold leading-tight text-foreground">
          {service.title}
        </h1>
      </div>

      {/* Avaliação e Localização */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="font-semibold text-foreground">{service.rating}</span>
          <span>({service.reviewCount} avaliações)</span>
          <span>·</span>
          <span>{service.totalServices} serviços realizados</span>
        </div>

        {service.city && (
          <>
            <span>•</span>
            <div className="flex items-center gap-1 font-medium text-foreground">
              <MapPin size={13} className="text-primary" />
              <span>
                {service.city}, {service.state}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Descrição */}
      <p className="text-sm leading-relaxed text-muted-foreground border-t pt-3">
        {service.description}
      </p>

      {/* Info cards rápidos */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/80 bg-muted/20 p-3 text-center">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clock size={16} />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground leading-tight">
            {service.durationMinutes} min de duração
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/80 bg-muted/20 p-3 text-center">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <DollarSign size={16} />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground leading-tight">
            A partir de R$ {service.price.inicial}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/80 bg-muted/20 p-3 text-center">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarCheck size={16} />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground leading-tight">
            Escolha seu horário
          </span>
        </div>
      </div>
    </div>
  );
}