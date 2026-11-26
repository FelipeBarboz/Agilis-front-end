"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import {
  getBookingDetail,
  getBookingHistory,
  type BookingDetailResponse,
} from "@/lib/services/bookings-service";
import {
  mapBookingDetailToHistoryEntry,
  mapRefundStatusToTracker,
} from "@/lib/utils/booking-detail-mapper";
import type { HistoryEntry } from "@/types/history";
import { CancelledServiceCard } from "./cancelled-service-card";
import { RefundTracker } from "./refund-tracker";
import { CancellationDetailsCard } from "./cancellation-details-card";
import { CancelledActions } from "./cancelled-actions";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CancelledContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [detail, setDetail] = useState<BookingDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCancelledBooking() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        let targetId = id;

        if (!targetId) {
          const history = await getBookingHistory({
            role: "CLIENT",
            statusFilter: "CANCELADO",
          });
          targetId = history.items?.[0]?.bookingId ?? null;
        }

        if (!targetId) {
          if (isMounted) {
            setEntry(null);
            setDetail(null);
          }
          return;
        }

        const bookingDetail = await getBookingDetail(targetId);
        if (!isMounted) return;

        setDetail(bookingDetail);
        setEntry(mapBookingDetailToHistoryEntry(bookingDetail));
      } catch (err) {
        if (!isMounted) return;
        const msg =
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os detalhes do cancelamento.";
        setErrorMessage(msg);
        setEntry(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadCancelledBooking();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background p-12 text-muted-foreground">
        <Loader2 className="size-7 animate-spin text-primary" />
        <p className="text-sm">Carregando detalhes do cancelamento...</p>
      </div>
    );
  }

  if (errorMessage || !entry) {
    return (
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-background p-8 text-center space-y-4">
        {errorMessage ? (
          <div className="flex items-center justify-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Serviço cancelado não encontrado.
          </p>
        )}
        <CancelledActions />
      </div>
    );
  }

  const bookingFee = entry.bookingFee ?? 0;
  const totalPrice =
    detail?.total && detail.total > 0 ? detail.total : entry.price + bookingFee;
  const protocol = `AGL-${entry.id.slice(0, 8).toUpperCase()}`;
  const refundStatus = mapRefundStatusToTracker(detail?.actions?.refundStatus);

  return (
    <div className="w-full max-w-2xl space-y-6">
      <CancelledServiceCard
        entry={entry}
        formattedTotal={currencyFormatter.format(totalPrice)}
      />

      <RefundTracker
        paymentMethod={entry.paymentMethod ?? "Cartão de Crédito"}
        refundStatus={refundStatus}
      />

      <CancellationDetailsCard
        protocol={protocol}
        cancellationReason={entry.cancellationReason}
        servicePrice={currencyFormatter.format(entry.price)}
        bookingFee={currencyFormatter.format(bookingFee)}
        totalPrice={currencyFormatter.format(totalPrice)}
        paymentMethod={entry.paymentMethod ?? "Cartão de Crédito"}
        date={entry.date}
      />

      <CancelledActions />
    </div>
  );
}
