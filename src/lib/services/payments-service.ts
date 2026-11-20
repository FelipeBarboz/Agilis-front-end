import { api } from "@/lib/api";
import type {
  CreatePaymentPreferenceDTO,
  PaymentPreferenceResponseDTO,
} from "@/types/payment";

/**
 * Gera a preferência de pagamento no Mercado Pago para o Checkout Pro:
 * POST /api/v1/payments/preference
 *
 * Headers:
 * Content-Type: application/json
 * Authorization: Bearer <TOKEN_CLIENTE>
 *
 * Body:
 * {
 *   "bookingId": string,
 *   "frontendBaseUrl": string
 * }
 */
export async function createPaymentPreference(
  payload: CreatePaymentPreferenceDTO
): Promise<PaymentPreferenceResponseDTO> {
  return await api<PaymentPreferenceResponseDTO>("/api/v1/payments/preference", {
    method: "POST",
    body: JSON.stringify({
      bookingId: payload.bookingId,
      frontendBaseUrl: payload.frontendBaseUrl,
    }),
  });
}
