import { api } from "@/lib/api";

export interface ValidateCouponPayload {
  serviceId: string;
  code: string;
}

export interface ValidateCouponResponse {
  valid: boolean;
  reason?: string;
  discountAmount?: number;
  finalPrice?: number;
}

/**
 * Valida um cupom de desconto para um serviço específico:
 * POST /api/v1/coupons/validate
 */
export async function validateCoupon(
  payload: ValidateCouponPayload
): Promise<ValidateCouponResponse> {
  return await api<ValidateCouponResponse>("/api/v1/coupons/validate", {
    method: "POST",
    body: JSON.stringify({
      serviceId: payload.serviceId,
      code: payload.code.trim().toUpperCase(),
    }),
  });
}
