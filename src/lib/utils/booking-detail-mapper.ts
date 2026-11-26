import type { BookingDetailResponse, RefundStatus } from "@/lib/services/bookings-service";
import { getFallbackImagesForCategory } from "@/lib/services/services-service";
import type { HistoryEntry, HistoryStatus } from "@/types/history";

export function formatPaymentMethodLabel(method?: string | null): string {
  const upper = (method ?? "").toUpperCase();
  if (upper === "PIX") return "PIX";
  if (upper === "CREDIT_CARD") return "Cartão de Crédito";
  if (upper === "DEBIT_CARD") return "Cartão de Débito";
  return method && method.trim().length > 0 ? method : "Cartão de Crédito";
}

export function mapDetailStatusToHistoryStatus(status: string): HistoryStatus {
  const upper = (status ?? "").toUpperCase();
  if (upper === "CANCELADO" || upper === "CANCELLED") return "cancelado";
  if (upper === "CONCLUIDO" || upper === "COMPLETED") return "concluido";
  if (upper === "EM_ANDAMENTO" || upper === "IN_PROGRESS") return "em_andamento";
  return "agendado";
}

export function mapRefundStatusToTracker(
  refundStatus?: RefundStatus | null
): "completed" | "processing" | "review" {
  if (refundStatus === "COMPLETED" || refundStatus === "APPROVED") {
    return "completed";
  }
  if (refundStatus === "PROCESSING") {
    return "processing";
  }
  if (refundStatus === "DENIED") {
    return "review";
  }
  return "processing";
}

export function mapBookingDetailToHistoryEntry(
  detail: BookingDetailResponse
): HistoryEntry {
  const fallbackImg =
    getFallbackImagesForCategory(detail.category ?? "", detail.bookingId)[0]?.url ??
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800";

  return {
    id: detail.bookingId,
    serviceName: detail.serviceTitle,
    imageUrl: detail.thumbnailUrl || fallbackImg,
    counterpartName: detail.storeName || "Prestador Agilis",
    counterpartRole: "prestador",
    date: detail.date,
    time: detail.time ? detail.time.slice(0, 5) : undefined,
    duration: detail.durationMinutes
      ? `${detail.durationMinutes} min`
      : undefined,
    price: Number(detail.price) || 0,
    bookingFee: Number(detail.serviceFee) || 0,
    status: mapDetailStatusToHistoryStatus(String(detail.status)),
    category: detail.category,
    address: detail.address ?? undefined,
    paymentMethod: formatPaymentMethodLabel(
      typeof detail.paymentMethod === "string" ? detail.paymentMethod : null
    ),
    notes: detail.notes ?? undefined,
    cancellationReason: detail.actions?.issueDescription ?? detail.notes ?? undefined,
  };
}
