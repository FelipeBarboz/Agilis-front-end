import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type {
  StorePosition,
  CreateStorePositionPayload,
  UpdateStorePositionPayload,
  UpdateMemberPositionPayload,
  PositionCity,
} from "@/types/store-position";

/**
 * Utilitário para extrair { city, state } a partir de string "Cidade - UF"
 */
export function parseCityString(cityStr: string): PositionCity {
  if (!cityStr) return { city: "", state: "" };
  const parts = cityStr.split(" - ");
  const city = parts[0]?.trim() ?? "";
  const state = parts[1]?.trim() ?? "";
  return { city, state };
}

/**
 * Utilitário para formatar { city, state } para "Cidade - UF"
 */
export function formatCityString(city: PositionCity | string): string {
  if (typeof city === "string") return city;
  if (!city) return "";
  return city.state ? `${city.city} - ${city.state}` : city.city;
}

/**
 * Obtém o ID do usuário atualmente autenticado
 */
async function getCurrentUserId(): Promise<string> {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user?.id) {
      return data.session.user.id;
    }
  } catch {}
  return "";
}

/**
 * GET /api/v1/stores/{storeId}/positions/{positionId}
 * Retorna os dados da posição (área de atendimento) especificada.
 */
export async function getStorePosition(
  storeId: string,
  positionId: string
): Promise<StorePosition[]> {
  const data = await api<StorePosition[] | StorePosition>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/positions/${encodeURIComponent(positionId)}`
  );

  if (Array.isArray(data)) {
    return data;
  }
  return data ? [data] : [];
}

/**
 * GET /api/v1/stores/{storeId}/positions (ou com positionId)
 * Lista posições ou obtém uma posição específica de uma loja.
 */
export async function fetchStorePositions(
  storeId: string,
  positionId?: string
): Promise<StorePosition[]> {
  const endpoint = positionId
    ? `/api/v1/stores/${encodeURIComponent(storeId)}/positions/${encodeURIComponent(positionId)}`
    : `/api/v1/stores/${encodeURIComponent(storeId)}/positions`;

  const data = await api<StorePosition[] | StorePosition>(endpoint);
  if (Array.isArray(data)) {
    return data;
  }
  return data ? [data] : [];
}

/**
 * POST /api/v1/stores/{storeId}/positions
 * Cria uma nova posição / área de atendimento para a loja.
 */
export async function createStorePosition(
  payload: CreateStorePositionPayload
): Promise<StorePosition | StorePosition[]> {
  const currentUserId = await getCurrentUserId();
  const requesterId = payload.requesterId ?? currentUserId;

  const body = {
    requesterId,
    storeId: payload.storeId,
    attendanceType: payload.attendanceType,
    radiusKm: Number(payload.radiusKm) || 0,
    referenceAddress: payload.referenceAddress ?? "",
    cities: payload.cities ?? [],
  };

  return await api<StorePosition | StorePosition[]>(
    `/api/v1/stores/${encodeURIComponent(payload.storeId)}/positions`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
}

/**
 * PUT /api/v1/stores/{storeId}/positions/{positionId}
 * Atualiza uma posição / área de atendimento existente.
 */
export async function updateStorePosition(
  storeId: string,
  positionId: string,
  payload: UpdateStorePositionPayload
): Promise<StorePosition | StorePosition[]> {
  const currentUserId = await getCurrentUserId();
  const requesterId = payload.requesterId ?? currentUserId;

  const body = {
    requesterId,
    storeId: payload.storeId || storeId,
    attendanceType: payload.attendanceType,
    radiusKm: Number(payload.radiusKm) || 0,
    referenceAddress: payload.referenceAddress ?? "",
    cities: payload.cities ?? [],
  };

  return await api<StorePosition | StorePosition[]>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/positions/${encodeURIComponent(positionId)}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    }
  );
}

/**
 * DELETE /api/v1/stores/{storeId}/positions/{positionId}
 * Remove uma posição / área de atendimento da loja.
 */
export async function deleteStorePosition(
  storeId: string,
  positionId: string
): Promise<void> {
  await api<void>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/positions/${encodeURIComponent(positionId)}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * PATCH /api/v1/stores/{storeId}/positions/members/{memberId}
 * Atribui ou atualiza o positionId de um membro / funcionário da loja.
 */
export async function updateMemberPosition(
  storeId: string,
  memberId: string,
  positionId: string
): Promise<unknown> {
  const body: UpdateMemberPositionPayload = {
    positionId,
  };

  return await api<unknown>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/positions/members/${encodeURIComponent(memberId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  );
}
