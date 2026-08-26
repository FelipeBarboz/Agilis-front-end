"use client";

import { useCallback, useMemo, useState } from "react";
import { MOCK_HISTORY } from "./mock-history";
import { HistoryFilters, type HistoryFilterValue } from "./history-filters";
import { HistoryList } from "./history-list";
import { HistoryDetailModal } from "./history-detail-modal";
import { type HistoryEntry, type HistoryStatus } from "../types";

export function HistorySection() {
  const [filter, setFilter] = useState<HistoryFilterValue>("todos");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  const filterCounts = useMemo(() => {
    const counts: Record<HistoryFilterValue, number> = {
      todos: MOCK_HISTORY.length,
      agendado: 0,
      em_andamento: 0,
      concluido: 0,
      cancelado: 0,
    };

    for (const entry of MOCK_HISTORY) {
      if (entry.status in counts) {
        counts[entry.status as HistoryStatus]++;
      }
    }

    return counts;
  }, []);

  const filteredEntries = useMemo(() => {
    if (filter === "todos") return MOCK_HISTORY;
    return MOCK_HISTORY.filter((entry) => entry.status === filter);
  }, [filter]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <HistoryFilters
        value={filter}
        onChange={setFilter}
        counts={filterCounts}
      />

      <HistoryList
        entries={filteredEntries}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onSelectEntry={setSelectedEntry}
        onClearFilter={() => setFilter("todos")}
      />

      <HistoryDetailModal
        open={!!selectedEntry}
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}
