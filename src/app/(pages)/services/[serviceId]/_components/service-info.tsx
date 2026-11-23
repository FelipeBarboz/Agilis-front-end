import { Star, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { type Service } from "@/lib/mocks/services";
import { ServiceImages } from "./service-images";

interface ServiceInfoProps {
  service: Service;
}

function formatEstimatedDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return "A combinar";
  if (minutes < 60) return `${minutes} minutos`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${hours} ${hours === 1 ? "hora" : "horas"}`;
  }
  return `${hours}h ${remainingMins}min`;
}

export function ServiceInfo({ service }: ServiceInfoProps) {
  const hasReviews = typeof service.reviewCount === "number" && service.reviewCount > 0;
  const ratingValue = typeof service.rating === "number" ? service.rating : 0;
  const totalCompleted = typeof service.totalServices === "number" ? service.totalServices : 0;

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
      </div>

      {/* Título Principal */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
          {service.title}
        </h1>

        {/* Avaliação e Localização */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1 font-medium">
            <Star
              size={15}
              className={`shrink-0 ${
                hasReviews ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"
              }`}
            />
            {hasReviews ? (
              <>
                <span className="font-bold text-foreground text-sm">{ratingValue.toFixed(1)}</span>
                <span>
                  ({service.reviewCount} {service.reviewCount === 1 ? "avaliação" : "avaliações"})
                </span>
              </>
            ) : (
              <>
                <span className="font-semibold text-foreground">Novo</span>
                <span>(Sem avaliações)</span>
              </>
            )}
          </div>

          <span>•</span>

          <div className="flex items-center gap-1 font-medium">
            <CheckCircle2 size={14} className="text-primary shrink-0" />
            <span className="font-semibold text-foreground">{totalCompleted}</span>
            <span>
              {totalCompleted === 1 ? "serviço realizado" : "serviços realizados"}
            </span>
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
      <div className="pt-1">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 p-3 sm:p-4">
          <div className="flex items-center gap-2 text-primary">
            <Clock size={18} />
            <span className="text-xs font-bold text-foreground">Tempo estimado</span>
          </div>
          <span className="text-xs font-semibold text-foreground">
            {formatEstimatedDuration(service.durationMinutes)}
          </span>
        </div>
      </div>
    </div>
  );
}