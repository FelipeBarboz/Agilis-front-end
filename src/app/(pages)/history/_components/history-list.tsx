"use client";

import { AnimatePresence, motion } from "motion/react";

import { type HistoryEntry } from "../types";
import { HistoryItem } from "./history-item";

interface HistoryListProps {
  entries: HistoryEntry[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
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

export function HistoryList({ entries, favorites, onToggleFavorite }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background py-16 text-center"
      >
        <p className="font-medium text-foreground">Nenhum registro encontrado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Os serviços que corresponderem a este filtro aparecerão aqui
        </p>
      </motion.div>
    );
  }

  const monthGroups = groupByMonth(entries);

  return (
    <div className="flex flex-col gap-6">
      {monthGroups.map(([month, monthEntries]) => (
        <div key={month} className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-foreground">{month}</h2>

          <AnimatePresence initial={false} mode="popLayout">
            {monthEntries.map((entry) => (
              <HistoryItem
                key={entry.id}
                entry={entry}
                isFavorite={favorites.has(entry.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
