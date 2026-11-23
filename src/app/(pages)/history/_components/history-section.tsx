"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HistoryFilters, type HistoryFilterValue } from "./history-filters";
import { HistoryList } from "./history-list";
import { HistoryDetailModal } from "./history-detail-modal";
import { type HistoryEntry, type HistoryStatus } from "../../../../types/history";
import { getMyBookings, type MyBookingItemDTO } from "@/lib/services/bookings-service";
import { getServiceById } from "@/lib/services/services-service";
import { Loader2 } from "lucide-react";

function mapBookingStatus(status: string): HistoryStatus {
  const s = (status ?? "").toUpperCase();
  if (s.includes("CANCEL")) return "cancelado";
  if (s.includes("COMPLET") || s.includes("CONCLU")) return "concluido";
  if (s.includes("PROGRESS") || s.includes("EXEC") || s.includes("ANDAMENTO")) return "em_andamento";
  return "agendado"; // PENDING, CONFIRMED, etc.
}

export function HistorySection() {
  const [filter, setFilter] = useState<HistoryFilterValue>("todos");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadClientBookings() {
      setIsLoading(true);
      try {
        const bookings: MyBookingItemDTO[] = await getMyBookings();

        if (Array.isArray(bookings)) {
          const enriched: HistoryEntry[] = await Promise.all(
            bookings.map(async (b) => {
              let serviceTitle = b.serviceTitle ?? "Serviço";
              let companyName = "Prestador Agilis";
              let imageUrl =
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800";
              let price = 120;
              let category = "Geral";

              if (b.serviceId) {
                try {
                  const s = await getServiceById(b.serviceId);
                  if (s) {
                    serviceTitle = s.title;
                    companyName = s.company ?? companyName;
                    imageUrl = s.images[0]?.url ?? imageUrl;
                    price = s.price.inicial ?? price;
                    category = s.category ?? category;
                  }
                } catch {
                  // Fallback se o serviço específico não puder ser carregado
                }
              }

              const dateObj = new Date(b.scheduledAt);
              const timeStr = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "14:00";

              return {
                id: b.bookingId,
                serviceName: serviceTitle,
                imageUrl,
                counterpartName: companyName,
                counterpartRole: "prestador" as const,
                date: b.scheduledAt,
                time: timeStr,
                price,
                bookingFee: 10,
                status: mapBookingStatus(b.status),
                category,
              };
            })
          );

          if (!isCancelled) {
            setEntries(enriched);
          }
        }
      } catch (err) {
        console.warn("[History] Erro ao buscar agendamentos do cliente:", err);
        if (!isCancelled) {
          setEntries([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadClientBookings();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filterCounts = useMemo(() => {
    const counts: Record<HistoryFilterValue, number> = {
      todos: entries.length,
      agendado: 0,
      em_andamento: 0,
      concluido: 0,
      cancelado: 0,
    };

    for (const entry of entries) {
      if (entry.status in counts) {
        counts[entry.status]++;
      }
    }

    return counts;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (filter === "todos") return entries;
    return entries.filter((entry) => entry.status === filter);
  }, [entries, filter]);

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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-semibold text-foreground">Carregando agendamentos...</p>
          <p className="text-xs text-muted-foreground mt-0.5">Buscando seu histórico no servidor</p>
        </div>
      ) : (
        <HistoryList
          entries={filteredEntries}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onSelectEntry={setSelectedEntry}
          onClearFilter={() => setFilter("todos")}
        />
      )}

      <HistoryDetailModal
        open={Boolean(selectedEntry)}
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}
