import { api } from "@/lib/api";
import type { MemberRole } from "@/lib/services/store-members-service";

// ==========================================
// Tipos de Convites da Loja
// ==========================================

export type InviteRole = "ADMIN" | "EMPLOYEE";

export interface StoreInviteDTO {
  id: string;
  storeId: string;
  code: string;
  role: MemberRole;
  createdBy?: string;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
  status: string;
  createdAt: string;
  valid: boolean;
}

export interface CreateStoreInvitePayload {
  role: InviteRole;
  expirationDays?: number;
  maxUses?: number;
}

export interface CreateStoreInviteResponse {
  inviteId: string;
  storeId: string;
  code: string;
  invitePath: string;
  role: InviteRole;
  expiresAt: string;
  maxUses: number;
}

export interface PublicStoreInviteDTO {
  code: string;
  storeId: string;
  storeName: string;
  storeSlug?: string;
  storeProfileImgUrl?: string;
  storeDescription?: string;
  role: MemberRole;
  expiresAt: string;
}

export interface AcceptStoreInviteResponse {
  membershipId: string;
  storeId: string;
  userId: string;
  name: string;
  email: string;
  role: MemberRole;
}

// ==========================================
// Helpers
// ==========================================

/**
 * Extrai o código do convite a partir de uma URL completa ou código direto.
 * Ex: "https://agilis.com.br/invite/ABC123" -> "ABC123"
 */
export function extractInviteCode(tokenOrUrl: string): string {
  const trimmed = tokenOrUrl.trim();
  if (!trimmed) return "";
  if (trimmed.includes("/invite/")) {
    const afterInvite = trimmed.split("/invite/").pop() ?? "";
    return afterInvite.split("?")[0]?.split("#")[0]?.trim() ?? "";
  }
  return trimmed;
}

// ==========================================
// API Functions
// ==========================================

/**
 * Lista os convites de uma loja:
 * GET /api/v1/stores/{storeId}/invites
 */
export async function getStoreInvites(
  storeId: string
): Promise<StoreInviteDTO[]> {
  try {
    const data = await api<StoreInviteDTO[]>(
      `/api/v1/stores/${encodeURIComponent(storeId)}/invites`
    );
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("[Invites] Falha ao listar convites da loja:", err);
    return [];
  }
}

/**
 * Cria um novo convite para a loja:
 * POST /api/v1/stores/{storeId}/invites
 */
export async function createStoreInvite(
  storeId: string,
  payload: CreateStoreInvitePayload
): Promise<CreateStoreInviteResponse> {
  return await api<CreateStoreInviteResponse>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/invites`,
    {
      method: "POST",
      body: JSON.stringify({
        role: payload.role,
        expirationDays: payload.expirationDays ?? 7,
        maxUses: payload.maxUses ?? 10,
      }),
    }
  );
}

/**
 * Revoga um convite existente:
 * DELETE /api/v1/stores/{storeId}/invites/{inviteId}
 */
export async function revokeStoreInvite(
  storeId: string,
  inviteId: string
): Promise<void> {
  await api(
    `/api/v1/stores/${encodeURIComponent(storeId)}/invites/${encodeURIComponent(inviteId)}`,
    { method: "DELETE" }
  );
}

/**
 * Busca informações públicas de um convite pelo código:
 * GET /api/v1/store-invites/{code}
 */
export async function getPublicStoreInvite(
  code: string
): Promise<PublicStoreInviteDTO> {
  const cleanCode = extractInviteCode(code);
  return await api<PublicStoreInviteDTO>(
    `/api/v1/store-invites/${encodeURIComponent(cleanCode)}`
  );
}

/**
 * Aceita um convite e vincula o usuário autenticado à loja:
 * POST /api/v1/store-invites/{code}/accept
 */
export async function acceptStoreInvite(
  code: string
): Promise<AcceptStoreInviteResponse> {
  const cleanCode = extractInviteCode(code);
  return await api<AcceptStoreInviteResponse>(
    `/api/v1/store-invites/${encodeURIComponent(cleanCode)}/accept`,
    { method: "POST" }
  );
}
