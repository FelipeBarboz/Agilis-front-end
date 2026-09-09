import { Star, Clock, ShieldCheck, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import { type Service } from "@/lib/mocks/services";
import { ServiceImages } from "./service-images";

interface ServiceInfoProps {
  service: Service;
}

export function ServiceInfo({ service }: ServiceInfoProps) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-5 sm:p-7 shadow-xs ring-1 ring-foreground/10">
      {/* Imagens do Serviço dentro do mesmo card */}
      <ServiceImages images={service.images} title={service.title} />

      {/* Categoria e Status de Disponibilidade */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
            {service.category}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {service.availability || "Disponível"}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          <span className="font-semibold text-foreground">Garantia Agilis</span>
        </div>
      </div>

      {/* Título Principal */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
          {service.title}
        </h1>

        {/* Avaliação e Localização */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1 font-medium">
            <Star size={15} className="fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-bold text-foreground text-sm">{service.rating.toFixed(1)}</span>
            <span>({service.reviewCount} avaliações)</span>
          </div>

          <span>•</span>

          <div className="flex items-center gap-1 font-medium">
            <CheckCircle2 size={14} className="text-primary shrink-0" />
            <span className="font-semibold text-foreground">{service.totalServices}</span>
            <span>serviços realizados</span>
          </div>

          {service.city && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1 font-medium text-foreground">
                <MapPin size={14} className="text-primary shrink-0" />
                <span>
                  {service.city}, {service.state}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Descrição */}
      <div className="border-t border-border/60 pt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Sobre o serviço
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>
      </div>

      {/* Destaques rápidos / Agilis highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
        <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-muted/40 p-3">
          <div className="flex items-center gap-1.5 text-primary">
            <Clock size={16} />
            <span className="text-[11px] font-bold text-foreground">Tempo estimado</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Aprox. {service.durationMinutes} minutos
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-muted/40 p-3">
          <div className="flex items-center gap-1.5 text-primary">
            <Sparkles size={16} />
            <span className="text-[11px] font-bold text-foreground">Equipamentos</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Inclusos pelo prestador
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-muted/40 p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-primary">
            <ShieldCheck size={16} />
            <span className="text-[11px] font-bold text-foreground">Segurança</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Profissionais verificados
          </span>
        </div>
      </div>
    </div>
  );
}