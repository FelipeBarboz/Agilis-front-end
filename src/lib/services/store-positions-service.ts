import { api } from "@/lib/api";
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
 * GET /api/v1/stores/{storeId}/positions/{positionId}
 * Retorna os dados do cargo especificado.
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
 * Lista cargos da loja.
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
 * Cria um novo cargo da loja.
 */
export async function createStorePosition(
  payload: CreateStorePositionPayload
): Promise<StorePosition> {
  const body = {
    title: payload.title.trim(),
    description: payload.description.trim(),
    canManageBookings: Boolean(payload.canManageBookings),
    canAccessChats: Boolean(payload.canAccessChats),
    canManageStoreSettings: Boolean(payload.canManageStoreSettings),
    canViewReports: Boolean(payload.canViewReports),
  };

  return await api<StorePosition>(
    `/api/v1/stores/${encodeURIComponent(payload.storeId)}/positions`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
}

/**
 * PUT /api/v1/stores/{storeId}/positions/{positionId}
 * Atualiza um cargo existente da loja.
 */
export async function updateStorePosition(
  storeId: string,
  positionId: string,
  payload: UpdateStorePositionPayload
): Promise<StorePosition> {
  const body = {
    title: payload.title.trim(),
    description: payload.description.trim(),
    canManageBookings: Boolean(payload.canManageBookings),
    canAccessChats: Boolean(payload.canAccessChats),
    canManageStoreSettings: Boolean(payload.canManageStoreSettings),
    canViewReports: Boolean(payload.canViewReports),
  };

  return await api<StorePosition>(
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
