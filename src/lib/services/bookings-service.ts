import { api } from "@/lib/api";

export type BookingPaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PIX";

export interface CreateBookingPayload {
  clientId: string;
  serviceId: string;
  employeeId?: string | null;
  scheduledAt: string; // ISO 8601
  notes?: string | null;
  paymentMethod?: BookingPaymentMethod;
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
  clientId: string;
  serviceId: string;
  scheduledAt: string;
  notes?: string;
  paymentMethod?: string;
  status: string;
  discountAmount?: number;
  finalPrice?: number;
  id?: string;
  storeId?: string;
  amount?: number;
  createdAt?: string;
  [key: string]: unknown;
}

export type BookingResponseDTO = CreateBookingResponse;

export interface BookingDetailDTO {
  bookingId: string;
  clientId: string;
  serviceId: string;
  serviceTitle?: string;
  scheduledAt: string;
  status: string;
}

export interface StoreBookingItemDTO {
  bookingId: string;
  clientId: string;
  serviceId: string;
  serviceTitle: string;
  scheduledAt: string;
  status: string;
}

export interface StoreBookingsOverviewDTO {
  date: string;
  metrics: {
    totalToday: number;
    pendingCount: number;
    confirmedCount: number;
    cancelledCount: number;
  };
  bookings: Array<{
    bookingId: string;
    clientId: string;
    clientName: string;
    employeeId: string;
    employeeName: string;
    serviceId: string;
    serviceTitle: string;
    scheduledAt: string;
    startTime: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    endTime: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    durationMinutes: number;
    address: string;
    status: string;
  }>;
}

export interface StoreBookingsCalendarDTO {
  year: number;
  month: number;
  datesWithBookings: string[];
  daysWithBookings: number[];
}

export interface ServiceBookingItemDTO {
  bookingId: string;
  clientId: string;
  serviceId: string;
  scheduledAt: string;
  status: string;
}

export interface MyBookingItemDTO {
  bookingId: string;
  clientId: string;
  serviceId: string;
  serviceTitle?: string;
  scheduledAt: string;
  status: string;
}

/**
 * Cria um novo agendamento de serviço:
 * POST /api/v1/bookings
 */
export async function createBooking(
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> {
  const formattedPayload: Record<string, unknown> = {
    clientId: payload.clientId,
    serviceId: payload.serviceId,
    scheduledAt: payload.scheduledAt,
    paymentMethod: payload.paymentMethod ?? "CREDIT_CARD",
  };

  // Se employeeId for fornecido e não-vazio, envia; se não, envia null para evitar erro de parse de UUID no backend
  if (payload.employeeId && payload.employeeId.trim().length > 0) {
    formattedPayload.employeeId = payload.employeeId.trim();
  } else {
    formattedPayload.employeeId = null;
  }

  // Se notes for fornecido, envia trimmed; caso contrário null
  if (payload.notes && payload.notes.trim().length > 0) {
    formattedPayload.notes = payload.notes.trim();
  } else {
    formattedPayload.notes = null;
  }

  // Se couponCode for fornecido, envia trimmed; caso contrário null
  if (payload.couponCode && payload.couponCode.trim().length > 0) {
    formattedPayload.couponCode = payload.couponCode.trim();
  } else {
    formattedPayload.couponCode = null;
  }

  return await api<CreateBookingResponse>("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify(formattedPayload),
  });
}

/**
 * Confirma um agendamento:
 * PATCH /api/v1/bookings/{id}/confirm
 */
export async function confirmBooking(id: string): Promise<void> {
  await api(`/api/v1/bookings/${encodeURIComponent(id)}/confirm`, {
    method: "PATCH",
  });
}

/**
 * Marca um agendamento como concluído:
 * PATCH /api/v1/bookings/{id}/complete
 */
export async function completeBooking(id: string): Promise<void> {
  await api(`/api/v1/bookings/${encodeURIComponent(id)}/complete`, {
    method: "PATCH",
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

/**
 * Busca detalhes de um agendamento pelo ID:
 * GET /api/v1/bookings/{id}
 */
export async function getBookingById(id: string): Promise<BookingDetailDTO> {
  return await api<BookingDetailDTO>(`/api/v1/bookings/${encodeURIComponent(id)}`);
}

/**
 * Lista todos os agendamentos de uma loja:
 * GET /api/v1/bookings/store/{storeId}
 */
export async function getBookingsByStore(storeId: string): Promise<StoreBookingItemDTO[]> {
  return await api<StoreBookingItemDTO[]>(`/api/v1/bookings/store/${encodeURIComponent(storeId)}`);
}

/**
 * Visão geral diária dos agendamentos da loja:
 * GET /api/v1/bookings/store/{storeId}/overview
 */
export async function getStoreBookingsOverview(
  storeId: string,
  date?: string
): Promise<StoreBookingsOverviewDTO> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return await api<StoreBookingsOverviewDTO>(
    `/api/v1/bookings/store/${encodeURIComponent(storeId)}/overview${query}`
  );
}

/**
 * Calendário mensal de agendamentos da loja:
 * GET /api/v1/bookings/store/{storeId}/calendar
 */
export async function getStoreBookingsCalendar(
  storeId: string,
  params?: { year?: number; month?: number }
): Promise<StoreBookingsCalendarDTO> {
  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.set("year", String(params.year));
  if (params?.month) queryParams.set("month", String(params.month));
  const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
  return await api<StoreBookingsCalendarDTO>(
    `/api/v1/bookings/store/${encodeURIComponent(storeId)}/calendar${query}`
  );
}

/**
 * Lista os agendamentos associados a um serviço:
 * GET /api/v1/bookings/service/{serviceId}
 */
export async function getBookingsByService(
  serviceId: string
): Promise<ServiceBookingItemDTO[]> {
  return await api<ServiceBookingItemDTO[]>(
    `/api/v1/bookings/service/${encodeURIComponent(serviceId)}`
  );
}

/**
 * Lista os agendamentos do cliente logado:
 * GET /api/v1/bookings/my
 */
export async function getMyBookings(): Promise<MyBookingItemDTO[]> {
  return await api<MyBookingItemDTO[]>("/api/v1/bookings/my");
}
