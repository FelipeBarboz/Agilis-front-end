"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HistoryFilters, type HistoryFilterValue } from "./history-filters";
import { HistoryList } from "./history-list";
import { HistoryDetailModal } from "./history-detail-modal";
import { ReviewModal } from "./review-modal";
import { type HistoryEntry, type HistoryStatus } from "../../../../types/history";
import {
  getBookingHistory,
  getMyBookings,
  type BookingHistoryResponse,
} from "@/lib/services/bookings-service";
import { getServiceById } from "@/lib/services/services-service";
import { fetchReviewByBookingId, type ReviewDTO } from "@/lib/services/reviews-service";
import { Loader2 } from "lucide-react";

function mapBookingStatus(status: string): HistoryStatus {
  const s = (status ?? "").toUpperCase();
  if (s.includes("CANCEL")) return "cancelado";
  if (s.includes("COMPLET") || s.includes("CONCLU")) return "concluido";
  if (s.includes("PROGRESS") || s.includes("EXEC") || s.includes("ANDAMENTO")) return "em_andamento";
  return "agendado"; // PENDING, CONFIRMED, AGENDADO, etc.
}

export function HistorySection() {
  const [filter, setFilter] = useState<HistoryFilterValue>("todos");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [reviewEntry, setReviewEntry] = useState<HistoryEntry | null>(null);
  const [reviewedMap, setReviewedMap] = useState<Record<string, ReviewDTO>>({});
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [backendCounts, setBackendCounts] = useState<{
    total: number;
    agendado: number;
    emAndamento: number;
    concluido: number;
    cancelado: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadClientBookings() {
      setIsLoading(true);
      try {
        // Tenta buscar pelo endpoint rico GET /api/v1/bookings/history?role=CLIENT&statusFilter=TODOS
        const historyData: BookingHistoryResponse = await getBookingHistory({
          role: "CLIENT",
          statusFilter: "TODOS",
        });

        if (!isCancelled && historyData?.items) {
          setBackendCounts(historyData.counts);

          const mapped: HistoryEntry[] = historyData.items.map((item) => {
            const timeFormatted = item.time ? item.time.slice(0, 5) : "14:00";
            return {
              id: item.bookingId,
              serviceName: item.serviceTitle,
              imageUrl:
                item.thumbnailUrl ||
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
              counterpartName: item.otherPartyName || "Prestador Agilis",
              counterpartRole: "prestador" as const,
              date: item.date,
              time: timeFormatted,
              price: item.price,
              bookingFee: 5,
              status: mapBookingStatus(item.status),
              category: item.category || "Geral",
            };
          });

          // Inicializa favoritos retornados pelo backend
          const favSet = new Set<string>();
          historyData.items.forEach((it) => {
            if (it.isFavorited) favSet.add(it.bookingId);
          });
          setFavorites(favSet);

          setEntries(mapped);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("[History] Erro na API rica de histórico, tentando fallback my bookings:", err);
      }

      // Fallback para getMyBookings caso a rota de histórico ainda não esteja disponível no backend local
      try {
        const bookings = await getMyBookings();
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
                } catch {}
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
                serviceId: b.serviceId,
                serviceName: serviceTitle,
                imageUrl,
                counterpartName: companyName,
                counterpartRole: "prestador" as const,
                date: b.scheduledAt,
                time: timeStr,
                price,
                bookingFee: 5,
                status: mapBookingStatus(b.status),
                category,
              };
            })
          );

          if (!isCancelled) {
            setEntries(enriched);
          }
        }
      } catch (fallbackErr) {
        console.warn("[History] Erro no fallback de agendamentos:", fallbackErr);
        if (!isCancelled) setEntries([]);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    void loadClientBookings();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filterCounts = useMemo(() => {
    if (backendCounts) {
      return {
        todos: backendCounts.total,
        agendado: backendCounts.agendado,
        em_andamento: backendCounts.emAndamento,
        concluido: backendCounts.concluido,
        cancelado: backendCounts.cancelado,
      };
    }

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
  }, [entries, backendCounts]);

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

  const reviewedIds = useMemo(() => new Set(Object.keys(reviewedMap)), [reviewedMap]);

  useEffect(() => {
    const completedEntries = entries.filter((e) => e.status === "concluido");
    if (completedEntries.length === 0) return;

    let isCancelled = false;

    async function checkCompletedReviews() {
      const results = await Promise.all(
        completedEntries.map(async (entry) => {
          const review = await fetchReviewByBookingId(entry.id);
          return review ? ([entry.id, review] as const) : null;
        })
      );

      if (isCancelled) return;

      setReviewedMap((prev) => {
        const next = { ...prev };
        for (const item of results) {
          if (item) {
            next[item[0]] = item[1];
          }
        }
        return next;
      });
    }

    void checkCompletedReviews();

    return () => {
      isCancelled = true;
    };
  }, [entries]);

  const handleReviewSubmitted = useCallback((bookingId: string, review: ReviewDTO) => {
    setReviewedMap((prev) => ({ ...prev, [bookingId]: review }));
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
          reviewedIds={reviewedIds}
          onToggleFavorite={toggleFavorite}
          onSelectEntry={setSelectedEntry}
          onOpenReview={setReviewEntry}
          onClearFilter={() => setFilter("todos")}
        />
      )}

      <HistoryDetailModal
        open={Boolean(selectedEntry)}
        entry={selectedEntry}
        existingReview={selectedEntry ? reviewedMap[selectedEntry.id] ?? null : null}
        onClose={() => setSelectedEntry(null)}
        onOpenReview={setReviewEntry}
      />

      <ReviewModal
        open={Boolean(reviewEntry)}
        entry={reviewEntry}
        onClose={() => setReviewEntry(null)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
