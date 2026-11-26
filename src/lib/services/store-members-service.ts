import { api, ApiError } from "@/lib/api";

// ==========================================
// Tipos retornados pelo backend
// ==========================================

export type MemberRole = "OWNER" | "ADMIN" | "EMPLOYEE";

export interface StoreMemberDTO {
  id: string;          // memberId
  storeId: string;
  providerId: string;  // userId do membro
  role: MemberRole;
  positionId?: string;
  invitedBy?: string;
  createdAt?: string;
  // Campos opcionais de perfil (podem vir enriquecidos pelo backend)
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export interface InviteMemberPayload {
  requesterId?: string;
  storeId: string;
  providerEmail: string;
  role: "ADMIN" | "EMPLOYEE";
}

export interface InviteMemberResponse {
  membershipId: string;
  providerId: string;
  name: string;
  email: string;
  role: MemberRole;
}

// ==========================================
// API Functions
// ==========================================

/**
 * Lista todos os membros de uma loja:
 * GET /api/v1/stores/{storeId}/members
 */
export async function getStoreMembers(
  storeId: string
): Promise<StoreMemberDTO[]> {
  try {
    const data = await api<StoreMemberDTO[]>(
      `/api/v1/stores/${encodeURIComponent(storeId)}/members`
    );
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("[Members] Falha ao listar membros:", err);
    return [];
  }
}

/**
 * Remove um membro da loja:
 * DELETE /api/v1/stores/{storeId}/members/{memberId}
 * O Swagger define {memberId} como o ID do vínculo (StoreMembership.id).
 * Fallback para providerId caso o backend rejeite com 400/404.
 */
export async function deleteStoreMember(
  storeId: string,
  memberId: string,   // StoreMembership.id (ID do vínculo — tenta primeiro)
  providerId?: string // userId do membro (fallback)
): Promise<void> {
  // 1ª tentativa: ID do vínculo (memberId), que é o esperado pelo Swagger
  try {
    await api(
      `/api/v1/stores/${encodeURIComponent(storeId)}/members/${encodeURIComponent(memberId)}`,
      { method: "DELETE" }
    );
    return;
  } catch (err) {
    const isRecoverable =
      err instanceof ApiError && (err.status === 400 || err.status === 404);
    if (!isRecoverable || !providerId || providerId === memberId) throw err;
  }

  // 2ª tentativa: providerId (userId do membro)
  await api(
    `/api/v1/stores/${encodeURIComponent(storeId)}/members/${encodeURIComponent(providerId!)}`,
    { method: "DELETE" }
  );
}

/**
 * Convida um membro para a loja por e-mail:
 * POST /api/v1/stores/{storeId}/members
 */
export async function inviteStoreMember(
  storeId: string,
  payload: InviteMemberPayload
): Promise<InviteMemberResponse> {
  return await api<InviteMemberResponse>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/members`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}
