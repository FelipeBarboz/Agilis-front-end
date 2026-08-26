"use client";

import { Calendar, Heart } from "lucide-react";
import { motion } from "motion/react";

import { type HistoryEntry, STATUS_BADGE_CLASS, STATUS_LABEL } from "../types";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

interface HistoryItemProps {
  entry: HistoryEntry;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect?: (entry: HistoryEntry) => void;
}

export function HistoryItem({ entry, isFavorite, onToggleFavorite, onSelect }: HistoryItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect?.(entry)}
      className="group relative flex cursor-pointer gap-4 rounded-xl border border-border bg-background p-4 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
    >
      {/* Foto do serviço */}
      {entry.imageUrl && entry.imageUrl.trim() !== "" ? (
        <img
          src={entry.imageUrl}
          alt={entry.serviceName}
          className="h-24 w-24 shrink-0 rounded-lg object-cover transition-transform group-hover:scale-[1.02]"
        />
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground font-bold">
          {entry.serviceName.charAt(0)}
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="flex flex-col gap-1">
          <p className="truncate pr-8 font-semibold text-foreground group-hover:text-primary transition-colors">
            {entry.serviceName}
          </p>
          <p className="text-sm text-muted-foreground">
            {entry.counterpartRole === "prestador" ? "Prestador: " : "Cliente: "}
            {entry.counterpartName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {dateFormatter.format(new Date(entry.date))}
          </span>
          <span
            className={`ml-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[entry.status]}`}
          >
            {STATUS_LABEL[entry.status]}
          </span>
        </div>
      </div>

      {/* Valor */}
      <div className="flex shrink-0 flex-col items-end justify-end gap-0.5 py-0.5 text-right">
        <span className="text-xs text-muted-foreground">Valor do serviço</span>
        <span className="text-lg font-bold text-foreground">
          {currencyFormatter.format(entry.price)}
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
        className="absolute right-4 top-4 rounded-full p-1 transition-colors hover:bg-muted/80"
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={isFavorite}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isFavorite ? "fill-red-500 text-red-500" : "text-red-400 hover:text-red-500"
          }`}
        />
      </motion.button>
    </motion.div>
  );
}
