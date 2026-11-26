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

export type CouponDiscountType = "PERCENTAGE" | "FIXED";

export interface RawCouponDTO {
  couponId?: string;
  id?: string;
  code: string;
  discountType?: CouponDiscountType | (string & {});
  discountPercentage?: number | null;
  discountAmount?: number | null;
  discountValue?: number | null;
  maxUses?: number | null;
  usedCount?: number | null;
  currentUses?: number | null;
  expiresAt?: string | null;
  validUntil?: string | null;
  active?: boolean;
  isActive?: boolean;
  storeId?: string | null;
  createdAt?: string;
}

export interface CouponDTO {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  storeId: string | null;
  createdAt: string | null;
}

export interface CreateCouponPayload {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxUses?: number | null;
  expiresAt?: string | null;
  storeId?: string | null;
}

function normalizeCoupon(raw: RawCouponDTO): CouponDTO {
  const hasPercentage =
    typeof raw.discountPercentage === "number" && raw.discountPercentage > 0;
  const hasAmount =
    typeof raw.discountAmount === "number" && raw.discountAmount > 0;

  let discountType: CouponDiscountType = "PERCENTAGE";
  if (raw.discountType === "FIXED" || (!hasPercentage && hasAmount)) {
    discountType = "FIXED";
  }

  const discountValue =
    discountType === "PERCENTAGE"
      ? (raw.discountPercentage ?? raw.discountValue ?? 0)
      : (raw.discountAmount ?? raw.discountValue ?? 0);

  return {
    id: raw.couponId ?? raw.id ?? raw.code,
    code: raw.code,
    discountType,
    discountValue,
    maxUses: raw.maxUses ?? null,
    usedCount: raw.usedCount ?? raw.currentUses ?? 0,
    expiresAt: raw.expiresAt ?? raw.validUntil ?? null,
    active: raw.active ?? raw.isActive ?? true,
    storeId: raw.storeId ?? null,
    createdAt: raw.createdAt ?? null,
  };
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

/**
 * Lista todos os cupons cadastrados:
 * GET /api/v1/coupons
 */
export async function getAllCoupons(): Promise<CouponDTO[]> {
  const res = await api<RawCouponDTO[]>("/api/v1/coupons");
  if (!Array.isArray(res)) return [];
  return res.map(normalizeCoupon);
}

/**
 * Cria um novo cupom de desconto:
 * POST /api/v1/coupons
 */
export async function createCoupon(
  payload: CreateCouponPayload
): Promise<CouponDTO> {
  const body: Record<string, unknown> = {
    code: payload.code.trim().toUpperCase(),
    discountType: payload.discountType,
    discountValue: payload.discountValue,
  };

  if (payload.discountType === "PERCENTAGE") {
    body.discountPercentage = payload.discountValue;
  } else {
    body.discountAmount = payload.discountValue;
  }

  if (typeof payload.maxUses === "number" && payload.maxUses > 0) {
    body.maxUses = payload.maxUses;
  }

  if (payload.expiresAt && payload.expiresAt.trim().length > 0) {
    body.expiresAt = payload.expiresAt.trim();
  }

  if (payload.storeId && payload.storeId.trim().length > 0) {
    body.storeId = payload.storeId.trim();
  }

  const created = await api<RawCouponDTO>("/api/v1/coupons", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return normalizeCoupon(created);
}

/**
 * Desativa um cupom de desconto existente:
 * PATCH /api/v1/coupons/{couponId}/deactivate
 */
export async function deactivateCoupon(couponId: string): Promise<void> {
  await api<void>(`/api/v1/coupons/${encodeURIComponent(couponId)}/deactivate`, {
    method: "PATCH",
  });
}
