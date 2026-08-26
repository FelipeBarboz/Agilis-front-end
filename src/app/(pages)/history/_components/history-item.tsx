"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Heart,
  ChevronRight,
  Hourglass,
  CalendarDays,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { type HistoryEntry, type HistoryStatus, STATUS_BADGE_CLASS, STATUS_LABEL } from "../types";
import { cn } from "@/lib/utils";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

const STATUS_ICONS: Record<HistoryStatus, React.ComponentType<{ className?: string }>> = {
  em_andamento: Hourglass,
  agendado: CalendarDays,
  concluido: CheckCircle2,
  cancelado: XCircle,
};

interface HistoryItemProps {
  entry: HistoryEntry;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect?: (entry: HistoryEntry) => void;
}

export function HistoryItem({ entry, isFavorite, onToggleFavorite, onSelect }: HistoryItemProps) {
  const [imgError, setImgError] = useState(false);
  const StatusIcon = STATUS_ICONS[entry.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect?.(entry)}
      className="group relative flex cursor-pointer flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-xs transition-all duration-200 hover:border-primary/40 hover:bg-card/90 hover:shadow-md text-left"
    >
      {/* Imagem do serviço */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
        {entry.imageUrl && !imgError ? (
          <Image
            src={entry.imageUrl}
            alt={entry.serviceName}
            width={80}
            height={80}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-lg">
            {entry.serviceName.charAt(0)}
          </div>
        )}
      </div>

      {/* Conteúdo principal */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2 pr-8 sm:pr-0">
          <h3 className="font-bold text-foreground text-sm sm:text-base transition-colors group-hover:text-primary leading-snug">
            {entry.serviceName}
          </h3>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
              STATUS_BADGE_CLASS[entry.status],
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {STATUS_LABEL[entry.status]}
          </span>
        </div>

        {/* Counterpart / Prestador */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">
            {entry.counterpartRole === "prestador" ? "Prestador: " : "Cliente: "}
            {entry.counterpartName}
          </span>
          {entry.category && (
            <>
              <span>•</span>
              <span className="text-[11px]">{entry.category}</span>
            </>
          )}
        </div>

        {/* Data e Horário */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {dateFormatter.format(new Date(entry.date))}
          </span>
          {entry.time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {entry.time}
            </span>
          )}
        </div>
      </div>

      {/* Preço e Ação */}
      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
        <div className="flex flex-col sm:items-end">
          <span className="text-[11px] text-muted-foreground">Valor do serviço</span>
          <span className="text-base sm:text-lg font-bold text-foreground">
            {currencyFormatter.format(entry.price)}
          </span>
        </div>

        <span className="flex items-center gap-0.5 text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Detalhes
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Botão de favorito */}
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(entry.id);
        }}
        whileTap={{ scale: 0.8 }}
        className="absolute right-3.5 top-3.5 rounded-full p-1.5 transition-colors hover:bg-muted/80 cursor-pointer"
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={isFavorite}
      >
        <Heart
          className={cn(
            "h-4.5 w-4.5 transition-colors",
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-muted-foreground hover:text-red-500",
          )}
        />
      </motion.button>
    </motion.div>
  );
}
