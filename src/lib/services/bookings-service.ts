import { api } from "@/lib/api";

// ==========================================
// Tipos e Enums
// ==========================================

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export type DisplayStatus = "AGENDADO" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO";

export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PIX";
export type BookingPaymentMethod = PaymentMethod;

export type RefundStatus = "PROCESSING" | "APPROVED" | "COMPLETED" | "DENIED";

export type DelayAction = "ACCEPT_NEW_TIME" | "REQUEST_REFUND" | "REQUEST_RESCHEDULE";

// 1. Criar Agendamento (POST /api/v1/bookings)
export interface CreateBookingPayload {
  serviceId: string;
  employeeId?: string | null;
  scheduledAt: string; // "YYYY-MM-DDTHH:mm:ss"
  notes?: string | null;
  paymentMethod?: PaymentMethod | null;
  couponCode?: string | null;

  // Campos complementares opcionais mantidos para compatibilidade
  clientId?: string;
  storeId?: string;
  unitId?: string;
  address?: string;
  price?: number;
  package?: string;
}

export type CreateBookingDTO = CreateBookingPayload;

export interface CreateBookingResponse {
  bookingId: string;
  clientId: string;
  serviceId: string;
  scheduledAt: string;
  notes?: string | null;
  paymentMethod?: string | null;
  status: BookingStatus | string;
  discountAmount?: number | null;
  finalPrice: number;

  // Compatibilidade
  id?: string;
  storeId?: string;
  amount?: number;
  createdAt?: string;
  [key: string]: unknown;
}

export type BookingResponseDTO = CreateBookingResponse;

// 2. Buscar Agendamento por ID (GET /api/v1/bookings/{id})
export interface BookingDetailDTO {
  bookingId: string;
  clientId: string;
  serviceId: string;
  scheduledAt: string;
  status: BookingStatus | string;
  serviceTitle?: string;
}

export type BookingSimpleResponse = BookingDetailDTO;

// 3. Detalhes Completos (GET /api/v1/bookings/{id}/detail)
export interface BookingDetailActions {
  canCancel: boolean;
  canReschedule: boolean;
  canReportIssue: boolean;
  refundStatus: RefundStatus | null;
  issueDescription: string | null;
}

export interface BookingDetailResponse {
  bookingId: string;
  status: DisplayStatus | BookingStatus | string;
  serviceTitle: string;
  category: string;
  thumbnailUrl?: string | null;
  price: number;
  date: string;
  time: string;
  durationMinutes: number;
  address?: string | null;
  serviceFee: number;
  total: number;
  paymentMethod?: PaymentMethod | string | null;
  notes?: string | null;
  storeName: string;
  clientName: string;
  actions: BookingDetailActions;
}

// 4. Meus Agendamentos (GET /api/v1/bookings/my)
export interface MyBookingItemDTO {
  bookingId: string;
  clientId: string;
  serviceId: string;
  scheduledAt: string;
  status: BookingStatus | string;
  serviceTitle?: string;
}

// 5. Histórico de Agendamentos (GET /api/v1/bookings/history)
export interface BookingHistoryItem {
  bookingId: string;
  serviceTitle: string;
  thumbnailUrl?: string | null;
  status: DisplayStatus | string;
  otherPartyName: string;
  category: string;
  date: string;
  time: string;
  price: number;
  isFavorited: boolean;
}

export interface BookingHistoryCounts {
  total: number;
  agendado: number;
  emAndamento: number;
  concluido: number;
  cancelado: number;
}

export interface BookingHistoryResponse {
  items: BookingHistoryItem[];
  counts: BookingHistoryCounts;
}

// 6. Agendamentos da Loja (GET /api/v1/bookings/store/{storeId})
export interface StoreBookingItemDTO {
  bookingId: string;
  clientId: string;
  serviceId: string;
  serviceTitle: string;
  scheduledAt: string;
  status: BookingStatus | string;
}

// 7. Visão Geral Diária da Loja (GET /api/v1/bookings/store/{storeId}/overview)
export interface StoreBookingOverviewItem {
  bookingId: string;
  clientId: string;
  clientName: string;
  employeeId?: string | null;
  employeeName: string;
  serviceId: string;
  serviceTitle: string;
  scheduledAt: string;
  startTime:
    | string
    | {
        hour: number;
        minute: number;
        second: number;
        nano: number;
      };
  endTime:
    | string
    | {
        hour: number;
        minute: number;
        second: number;
        nano: number;
      };
  durationMinutes: number;
  address?: string | null;
  status: BookingStatus | string;
}

export interface StoreBookingsOverviewDTO {
  date: string;
  metrics: {
    totalToday: number;
    pendingCount: number;
    confirmedCount: number;
    cancelledCount: number;
  };
  bookings: StoreBookingOverviewItem[];
}

export type StoreBookingsOverviewResponse = StoreBookingsOverviewDTO;

// 8. Calendário Mensal da Loja (GET /api/v1/bookings/store/{storeId}/calendar)
export interface StoreBookingsCalendarDTO {
  year: number;
  month: number;
  datesWithBookings: string[];
  daysWithBookings: number[];
}

export type StoreBookingsCalendarResponse = StoreBookingsCalendarDTO;

// 9. Agendamentos por Serviço (GET /api/v1/bookings/service/{serviceId})
export interface ServiceBookingItemDTO {
  bookingId: string;
  clientId: string;
  serviceId: string;
  scheduledAt: string;
  status: BookingStatus | string;
}

// 11. Atrasos (Delays)
export interface DeclareDelayPayload {
  storeId: string;
  employeeId?: string | null;
  date: string; // "YYYY-MM-DD"
  delayMinutes: number;
  reason?: string | null;
}

export interface DeclareDelayResponse {
  newDelaysCount: number;
  autoCancelledCount: number;
}

export interface PendingDelayItem {
  delayId: string;
  bookingId: string;
  originalScheduledAt: string;
  newScheduledAt: string;
  delayMinutes: number;
  reason?: string | null;
}

export interface RespondDelayPayload {
  action: DelayAction;
}

// ==========================================
// Funções do Serviço
// ==========================================

/**
 * 1. Cria um novo agendamento de serviço:
 * POST /api/v1/bookings
 */
export async function createBooking(
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> {
  const formattedPayload: Record<string, unknown> = {
    serviceId: payload.serviceId,
    scheduledAt: payload.scheduledAt,
  };

  if (payload.clientId && payload.clientId.trim().length > 0) {
    formattedPayload.clientId = payload.clientId.trim();
  }

  if (payload.employeeId && payload.employeeId.trim().length > 0) {
    formattedPayload.employeeId = payload.employeeId.trim();
  } else {
    formattedPayload.employeeId = null;
  }

  if (payload.notes && payload.notes.trim().length > 0) {
    formattedPayload.notes = payload.notes.trim();
  } else {
    formattedPayload.notes = null;
  }

  if (payload.paymentMethod) {
    formattedPayload.paymentMethod = payload.paymentMethod;
  }

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
 * 2. Busca agendamento simples por ID:
 * GET /api/v1/bookings/{id}
 */
export async function getBookingById(id: string): Promise<BookingDetailDTO> {
  return await api<BookingDetailDTO>(`/api/v1/bookings/${encodeURIComponent(id)}`);
}

/**
 * 3. Detalhes completos do agendamento (tela de detalhes):
 * GET /api/v1/bookings/{id}/detail
 */
export async function getBookingDetail(id: string): Promise<BookingDetailResponse> {
  return await api<BookingDetailResponse>(`/api/v1/bookings/${encodeURIComponent(id)}/detail`);
}

/**
 * 4. Lista os agendamentos simples do cliente logado:
 * GET /api/v1/bookings/my
 */
export async function getMyBookings(): Promise<MyBookingItemDTO[]> {
  return await api<MyBookingItemDTO[]>("/api/v1/bookings/my");
}

/**
 * 5. Histórico de agendamentos com filtros e métricas:
 * GET /api/v1/bookings/history?role=CLIENT&statusFilter=TODOS
 */
export async function getBookingHistory(params: {
  role: "CLIENT" | "PROVIDER";
  statusFilter?: "TODOS" | "AGENDADO" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO" | string;
}): Promise<BookingHistoryResponse> {
  const query = new URLSearchParams();
  query.set("role", params.role);
  if (params.statusFilter) {
    query.set("statusFilter", params.statusFilter);
  }

  return await api<BookingHistoryResponse>(`/api/v1/bookings/history?${query.toString()}`);
}

/**
 * 6. Lista todos os agendamentos de uma loja:
 * GET /api/v1/bookings/store/{storeId}?date=2025-03-15
 */
export async function getBookingsByStore(
  storeId: string,
  date?: string
): Promise<StoreBookingItemDTO[]> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return await api<StoreBookingItemDTO[]>(
    `/api/v1/bookings/store/${encodeURIComponent(storeId)}${query}`
  );
}

/**
 * 7. Visão geral diária dos agendamentos da loja:
 * GET /api/v1/bookings/store/{storeId}/overview?date=2025-03-15
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
 * 8. Calendário mensal de agendamentos da loja:
 * GET /api/v1/bookings/store/{storeId}/calendar?year=2025&month=3
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
 * 9. Lista os agendamentos associados a um serviço:
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
 * 10a. Confirma um agendamento (loja):
 * PATCH /api/v1/bookings/{id}/confirm
 */
export async function confirmBooking(id: string): Promise<void> {
  await api(`/api/v1/bookings/${encodeURIComponent(id)}/confirm`, {
    method: "PATCH",
  });
}

/**
 * 10b. Cancela um agendamento (cliente ou loja):
 * PATCH /api/v1/bookings/{id}/cancel
 */
export async function cancelBooking(id: string): Promise<void> {
  await api(`/api/v1/bookings/${encodeURIComponent(id)}/cancel`, {
    method: "PATCH",
  });
}

/**
 * 10c. Marca um agendamento como concluído (loja):
 * PATCH /api/v1/bookings/{id}/complete
 */
export async function completeBooking(id: string): Promise<void> {
  await api(`/api/v1/bookings/${encodeURIComponent(id)}/complete`, {
    method: "PATCH",
  });
}

/**
 * 11a. Declara atraso para agendamentos do dia (loja):
 * POST /api/v1/stores/{storeId}/delays
 */
export async function declareDelay(
  payload: DeclareDelayPayload
): Promise<DeclareDelayResponse> {
  const formattedPayload: Record<string, unknown> = {
    storeId: payload.storeId,
    date: payload.date,
    delayMinutes: payload.delayMinutes,
  };

  if (payload.employeeId && payload.employeeId.trim().length > 0) {
    formattedPayload.employeeId = payload.employeeId.trim();
  } else {
    formattedPayload.employeeId = null;
  }

  if (payload.reason && payload.reason.trim().length > 0) {
    formattedPayload.reason = payload.reason.trim();
  } else {
    formattedPayload.reason = null;
  }

  return await api<DeclareDelayResponse>(
    `/api/v1/stores/${encodeURIComponent(payload.storeId)}/delays`,
    {
      method: "POST",
      body: JSON.stringify(formattedPayload),
    }
  );
}

/**
 * 11b. Lista os avisos de atraso pendentes para o cliente:
 * GET /api/v1/bookings/delays/pending
 */
export async function getPendingDelays(): Promise<PendingDelayItem[]> {
  return await api<PendingDelayItem[]>("/api/v1/bookings/delays/pending");
}

/**
 * 11c. Cliente responde ao aviso de atraso:
 * PATCH /api/v1/bookings/delays/{delayId}/respond
 */
export async function respondToDelay(
  delayId: string,
  action: DelayAction
): Promise<void> {
  await api(`/api/v1/bookings/delays/${encodeURIComponent(delayId)}/respond`, {
    method: "PATCH",
    body: JSON.stringify({ delayId, action }),
  });
}

/**
 * 12. Reporta um problema / solicita reembolso após serviço concluído (cliente):
 * POST /api/v1/bookings/{bookingId}/report-issue
 */
export async function requestRefund(
  bookingId: string,
  description: string
): Promise<void> {
  await api(`/api/v1/bookings/${encodeURIComponent(bookingId)}/report-issue`, {
    method: "POST",
    body: JSON.stringify({ description }),
  });
}
