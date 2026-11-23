import { api } from "@/lib/api";

export type BookingPaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PIX";

export interface CreateBookingPayload {
  clientId: string;
  serviceId: string;
  employeeId?: string | null;
  scheduledAt: string; // ISO 8601
  notes?: string | null;
  paymentMethod?: BookingPaymentMethod | string;
  couponCode?: string | null;

  // Campos complementares opcionais para compatibilidade
  storeId?: string;
  unitId?: string;
  address?: string;
  price?: number;
  package?: string;
}

// Mantido alias para compatibilidade com chamadas existentes
export type CreateBookingDTO = CreateBookingPayload;

export interface CreateBookingResponse {
  bookingId: string;
  id?: string;
  clientId?: string;
  serviceId?: string;
  scheduledAt?: string;
  notes?: string;
  paymentMethod?: string;
  status?: string;
  discountAmount?: number;
  finalPrice?: number;
  storeId?: string;
  amount?: number;
  createdAt?: string;
  [key: string]: unknown;
}

export type BookingResponseDTO = CreateBookingResponse;

/**
 * Cria um novo agendamento de serviço:
 * POST /api/v1/bookings
 */
export async function createBooking(
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> {
  const formattedPayload = {
    clientId: payload.clientId,
    serviceId: payload.serviceId,
    employeeId: payload.employeeId || "",
    scheduledAt: payload.scheduledAt,
    notes: (payload.notes || "").trim(),
    paymentMethod: payload.paymentMethod || "CREDIT_CARD",
    couponCode: (payload.couponCode || "").trim(),
  };

  return await api<CreateBookingResponse>("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify(formattedPayload),
  });
}

/**
 * Cancela um agendamento:
 * PATCH /api/v1/bookings/{id}/cancel
 */
export async function cancelBooking(id: string): Promise<void> {
  await api(`/api/v1/bookings/${encodeURIComponent(id)}/cancel`, {
    method: "PATCH",
  });
}
