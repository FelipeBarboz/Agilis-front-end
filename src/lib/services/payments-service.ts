import { api } from "@/lib/api";

export interface CreatePreferenceRequest {
  bookingId: string;
  frontendBaseUrl?: string | null;
  customSuccessUrl?: string | null;
  customFailureUrl?: string | null;
  customPendingUrl?: string | null;
}

export type CreatePaymentPreferenceDTO = CreatePreferenceRequest;

export interface PreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

export type PaymentPreferenceResponseDTO = PreferenceResponse;

export type PaymentStatusCode =
  | "NOT_CREATED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "REFUNDED"
  | "IN_PROCESS"
  | "IN_MEDIATION"
  | "CHARGED_BACK";

export interface PaymentStatus {
  id: string | null;
  bookingId: string;
  mercadoPagoPaymentId: string | null;
  mercadoPagoPreferenceId: string | null;
  status: PaymentStatusCode;
  amount: number;
  paymentMethod: string | null;
  paymentType: string | null;
  paidAt: string | null;
  createdAt: string | null;
}

/**
 * Cria a preferência de pagamento no Mercado Pago:
 * POST /api/v1/payments/preference
 */
export async function createPaymentPreference(
  payload: string | CreatePreferenceRequest
): Promise<PreferenceResponse> {
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL || "https://agilis.com.br");

  const body: CreatePreferenceRequest =
    typeof payload === "string"
      ? {
          bookingId: payload,
          frontendBaseUrl: origin,
          customSuccessUrl: null,
          customFailureUrl: null,
          customPendingUrl: null,
        }
      : {
          bookingId: payload.bookingId,
          frontendBaseUrl: payload.frontendBaseUrl ?? origin,
          customSuccessUrl: payload.customSuccessUrl ?? null,
          customFailureUrl: payload.customFailureUrl ?? null,
          customPendingUrl: payload.customPendingUrl ?? null,
        };

  return await api<PreferenceResponse>("/api/v1/payments/preference", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Consulta o status real do pagamento do agendamento:
 * GET /api/v1/payments/booking/{bookingId}
 */
export async function getPaymentStatus(bookingId: string): Promise<PaymentStatus> {
  return await api<PaymentStatus>(
    `/api/v1/payments/booking/${encodeURIComponent(bookingId)}`
  );
}
