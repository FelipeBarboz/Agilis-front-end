"use client";

import { AnimatePresence, motion } from "motion/react";
import { Clock } from "lucide-react";
import { type HistoryEntry } from "../types";
import { HistoryItem } from "./history-item";
import { Button } from "@/components/ui/button";

interface HistoryListProps {
  entries: HistoryEntry[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onSelectEntry?: (entry: HistoryEntry) => void;
  onClearFilter?: () => void;
}

function getMonthLabel(dateIso: string) {
  const label = new Date(dateIso).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  // "julho de 2026" -> "Julho de 2026"
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function groupByMonth(entries: HistoryEntry[]) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groups = new Map<string, HistoryEntry[]>();
  for (const entry of sorted) {
    const label = getMonthLabel(entry.date);
    const existing = groups.get(label) ?? [];
    existing.push(entry);
    groups.set(label, existing);
  }

  return Array.from(groups.entries());
}

export function HistoryList({
  entries,
  favorites,
  onToggleFavorite,
  onSelectEntry,
  onClearFilter,
}: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4 shadow-xs">
          <Clock className="h-8 w-8" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Nenhum registro encontrado</h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Nenhum serviço corresponde ao filtro selecionado no momento.
        </p>
        {onClearFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilter}
            className="mt-4"
          >
            Ver todos os registros
          </Button>
        )}
      </motion.div>
    );
  }

  const monthGroups = groupByMonth(entries);

  return (
    <div className="flex flex-col gap-6">
      {monthGroups.map(([month, monthEntries]) => (
        <div key={month} className="flex flex-col gap-3">
          {/* Divisor estático de mês */}
          <div className="flex items-center gap-3 py-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {month}
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="flex flex-col gap-2.5">
            <AnimatePresence initial={false} mode="popLayout">
              {monthEntries.map((entry) => (
                <HistoryItem
                  key={entry.id}
                  entry={entry}
                  isFavorite={favorites.has(entry.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectEntry}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
