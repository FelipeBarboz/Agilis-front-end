import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { getStoredUser } from "@/lib/auth/token-storage";
import { type Store } from "@/lib/mocks/stores";

export interface CreateStorePayload {
  userId: string;
  cnpj: string;
  storeName: string;
  slug: string;
  description: string;
  profileImgUrl: string;
}

export interface StoreResponse {
  id?: string;
  storeId?: string;
  userId?: string;
  cnpj?: string;
  storeName?: string;
  slug?: string;
  description?: string;
  profileImgUrl?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export type AttendanceType = "FIXED_LOCATION" | "ON_CLIENT" | "BOTH";
export type ValidRadiusKm = 5 | 10 | 20 | 50;

export interface ServiceAreaCity {
  city: string;
  state: string;
}

export interface UnitCity {
  city: string;
  state: string;
}

export interface CreateStoreUnitPayload {
  cnpj: string;
  name: string;
  attendanceType: AttendanceType;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  city?: string | null;
  state?: string | null;
  cep?: string | null;
}

export interface UpdateStoreUnitPayload {
  cnpj: string;
  name: string;
  attendanceType: AttendanceType;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  city?: string | null;
  state?: string | null;
  cep?: string | null;
}

export interface StoreUnitResponse {
  unitId?: string;
  id?: string;
  storeId?: string;
  cnpj?: string;
  name?: string;
  attendanceType?: AttendanceType;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  city?: string | null;
  state?: string | null;
  cep?: string | null;
  [key: string]: unknown;
}

export interface ConfigureServiceAreaPayload {
  attendanceType: AttendanceType;
  radiusKm: ValidRadiusKm | null;
  cities: ServiceAreaCity[];
}

export interface ServiceAreaResponse {
  id?: string;
  attendanceType: AttendanceType;
  radiusKm: ValidRadiusKm | null;
  cities: ServiceAreaCity[];
}

export interface MyStore {
  storeId: string;
  storeName: string;
  slug: string;
  profileImgUrl: string;
  role: string;
}

/**
 * GET /api/v1/stores/my
 * Retorna as lojas associadas ao usuário logado (proprietário ou funcionário)
 */
export async function getMyStores(): Promise<MyStore[]> {
  const data = await api<MyStore[]>("/api/v1/stores/my");
  return Array.isArray(data) ? data : [];
}

/**
 * Garante que o CNPJ esteja estritamente no formato exigido pelo backend:
 * 00.000.000/0000-00 (Regex: ^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$)
 */
export function formatCnpj(value: string): string {
  const digits = (value || "").replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

/**
 * Garante que o CEP esteja estritamente no formato exigido pelo backend:
 * 00000-000 (Regex: ^\d{5}-\d{3}$)
 */
export function formatCep(value: string): string {
  const digits = (value || "").replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/**
 * Obtém o userId do usuário autenticado no Supabase ou no storage local
 */
export async function getAuthenticatedUserId(): Promise<string> {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user?.id) {
      return data.session.user.id;
    }
  } catch {}

  const stored = getStoredUser();
  if (stored?.id) {
    return stored.id;
  }

  return "";
}

/**
 * Cria a loja na API:
 * POST /api/v1/stores
 */
export async function createStore(
  payload: CreateStorePayload
): Promise<StoreResponse> {
  const formattedCnpj = formatCnpj(payload.cnpj);
  const formattedPayload = {
    userId: payload.userId,
    cnpj: formattedCnpj,
    storeName: payload.storeName.trim(),
    slug: payload.slug.trim(),
    description: payload.description.trim(),
    profileImgUrl: payload.profileImgUrl.trim(),
  };

  return await api<StoreResponse>("/api/v1/stores", {
    method: "POST",
    body: JSON.stringify(formattedPayload),
  });
}

/**
 * POST /api/v1/stores/{storeId}/units
 * Cadastra uma nova unidade da loja
 */
export async function createStoreUnit(
  storeId: string,
  payload: CreateStoreUnitPayload
): Promise<StoreUnitResponse> {
  const isAddressRequired = payload.attendanceType !== "ON_CLIENT";

  const formattedPayload = {
    cnpj: formatCnpj(payload.cnpj),
    name: payload.name.trim(),
    attendanceType: payload.attendanceType,
    street: payload.street?.trim() || (isAddressRequired ? "" : null),
    number: payload.number?.trim() || (isAddressRequired ? "" : null),
    complement: payload.complement?.trim() || null,
    city: payload.city?.trim() || (isAddressRequired ? "" : null),
    state: payload.state?.trim() ? payload.state.trim().toUpperCase().slice(0, 2) : (isAddressRequired ? "" : null),
    cep: payload.cep?.trim() ? formatCep(payload.cep) : (isAddressRequired ? "" : null),
  };

  return await api<StoreUnitResponse>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/units`,
    {
      method: "POST",
      body: JSON.stringify(formattedPayload),
    }
  );
}

/**
 * PUT /api/v1/stores/{storeId}/units/{unitId}
 * Atualiza os dados cadastrais da unidade
 */
export async function updateStoreUnit(
  storeId: string,
  unitId: string,
  payload: UpdateStoreUnitPayload
): Promise<StoreUnitResponse> {
  const isAddressRequired = payload.attendanceType !== "ON_CLIENT";

  const formattedPayload = {
    cnpj: formatCnpj(payload.cnpj),
    name: payload.name.trim(),
    attendanceType: payload.attendanceType,
    street: payload.street?.trim() || (isAddressRequired ? "" : null),
    number: payload.number?.trim() || (isAddressRequired ? "" : null),
    complement: payload.complement?.trim() || null,
    city: payload.city?.trim() || (isAddressRequired ? "" : null),
    state: payload.state?.trim() ? payload.state.trim().toUpperCase().slice(0, 2) : (isAddressRequired ? "" : null),
    cep: payload.cep?.trim() ? formatCep(payload.cep) : (isAddressRequired ? "" : null),
  };

  return await api<StoreUnitResponse>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/units/${encodeURIComponent(unitId)}`,
    {
      method: "PUT",
      body: JSON.stringify(formattedPayload),
    }
  );
}

/**
 * GET /api/v1/stores/{storeId}/units
 * Lista as unidades cadastradas da loja
 */
export async function getStoreUnits(
  storeId: string
): Promise<StoreUnitResponse[]> {
  const data = await api<StoreUnitResponse[]>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/units`
  );
  return Array.isArray(data) ? data : [];
}

/**
 * DELETE /api/v1/stores/{storeId}/units/{unitId}
 * Remove uma unidade da loja
 */
export async function deleteStoreUnit(
  storeId: string,
  unitId: string
): Promise<void> {
  await api(
    `/api/v1/stores/${encodeURIComponent(storeId)}/units/${encodeURIComponent(unitId)}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * GET /api/v1/stores/{storeId}/service-area
 * Consulta a área de atendimento da loja
 */
export async function getStoreServiceArea(
  storeId: string
): Promise<ServiceAreaResponse | null> {
  try {
    return await api<ServiceAreaResponse>(
      `/api/v1/stores/${encodeURIComponent(storeId)}/service-area`
    );
  } catch (err) {
    console.warn("[getStoreServiceArea] Erro ao consultar área de atendimento:", err);
    return null;
  }
}

/**
 * PUT /api/v1/stores/{storeId}/service-area
 * Configura (cria ou atualiza) a área de atendimento da loja (Upsert)
 */
export async function configureStoreServiceArea(
  storeId: string,
  payload: ConfigureServiceAreaPayload
): Promise<ServiceAreaResponse> {
  const isRadiusApplicable = payload.attendanceType !== "FIXED_LOCATION";
  let radiusKm: ValidRadiusKm | null = null;

  if (isRadiusApplicable) {
    const rawRadius = Number(payload.radiusKm);
    radiusKm = [5, 10, 20, 50].includes(rawRadius) ? (rawRadius as ValidRadiusKm) : 10;
  }

  const formattedPayload = {
    attendanceType: payload.attendanceType,
    radiusKm,
    cities: Array.isArray(payload.cities)
      ? payload.cities.map((c) => ({
          city: c.city.trim(),
          state: (c.state || "SP").trim().toUpperCase().slice(0, 2),
        }))
      : [],
  };

  return await api<ServiceAreaResponse>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/service-area`,
    {
      method: "PUT",
      body: JSON.stringify(formattedPayload),
    }
  );
}

export interface StoreProfileDTO {
  id: string;
  cnpj: string;
  storeName: string;
  slug: string;
  description: string;
  profileImgUrl: string;
  allowEmployeeSelection?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

/**
 * GET /api/v1/stores/{storeId}
 * Consulta o perfil da loja pelo ID
 */
export async function getStoreById(storeId: string): Promise<StoreProfileDTO> {
  return await api<StoreProfileDTO>(
    `/api/v1/stores/${encodeURIComponent(storeId)}`
  );
}

/**
 * GET /api/v1/stores/slug/{slug}
 * Consulta o perfil público da loja pelo slug
 */
export async function getStoreBySlug(slug: string): Promise<StoreProfileDTO> {
  return await api<StoreProfileDTO>(
    `/api/v1/stores/slug/${encodeURIComponent(slug)}`
  );
}

export interface UpdateStoreProfilePayload {
  requesterId: string;
  storeId: string;
  storeName: string;
  description: string;
  slug: string;
  profileImgUrl: string;
}

/**
 * PUT /api/v1/stores/{storeId}
 * Atualiza as informações do perfil da loja
 */
export async function updateStoreProfile(
  storeId: string,
  payload: UpdateStoreProfilePayload
): Promise<StoreProfileDTO> {
  const formattedPayload = {
    requesterId: payload.requesterId,
    storeId: payload.storeId,
    storeName: payload.storeName.trim(),
    description: payload.description.trim(),
    slug: payload.slug.trim(),
    profileImgUrl: payload.profileImgUrl.trim(),
  };

  return await api<StoreProfileDTO>(
    `/api/v1/stores/${encodeURIComponent(storeId)}`,
    {
      method: "PUT",
      body: JSON.stringify(formattedPayload),
    }
  );
}

export interface StoreSearchCity {
  city: string;
  state: string;
}

export interface StoreSearchItem {
  id: string;
  attendanceType: string;
  radiusKm: number;
  cities: StoreSearchCity[];
  storeName?: string;
  name?: string;
  slug?: string;
  description?: string;
  profileImgUrl?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  [key: string]: unknown;
}

export interface SearchStoresParams {
  city?: string;
  state?: string;
  category?: string;
  search?: string;
  q?: string;
}

/**
 * GET /api/v1/stores/search
 * Pesquisa lojas por cidade, estado ou categoria
 */
export async function fetchStoresSearch(
  params: SearchStoresParams = {}
): Promise<StoreSearchItem[]> {
  const query = new URLSearchParams();

  if (params.city && params.city.trim().length > 0) {
    query.set("city", params.city.trim());
  }

  if (params.state && params.state.trim().length > 0) {
    query.set("state", params.state.trim().toUpperCase());
  }

  if (params.category && params.category !== "todos") {
    query.set("category", params.category.trim().toUpperCase());
  }

  const searchTerm = (params.search ?? params.q ?? "").trim();
  if (searchTerm) {
    query.set("q", searchTerm);
    query.set("search", searchTerm);
  }

  const queryString = query.toString();
  const endpoint = `/api/v1/stores/search${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await api<StoreSearchItem[]>(endpoint);
    if (Array.isArray(res)) {
      return res;
    }
    return [];
  } catch (err) {
    console.warn("[Stores] Erro ao buscar lojas na API:", err);
    return [];
  }
}

/**
 * Converte um item de busca retornado por /api/v1/stores/search
 * para o modelo de dados padrão Store utilizado pelos componentes visuais.
 */
export function normalizeStoreSearchToStore(
  item: StoreSearchItem,
  profile?: StoreProfileDTO | null
): Store {
  const name =
    profile?.storeName ||
    item.storeName ||
    item.name ||
    `Loja ${item.id.slice(0, 8)}`;
  const description =
    profile?.description ||
    item.description ||
    "Loja e prestadora de serviços cadastrada na plataforma.";
  const slug = profile?.slug || item.slug || item.id;
  const logoUrl = profile?.profileImgUrl || item.profileImgUrl || "";

  const words = name.trim().split(/\s+/).filter(Boolean);
  const firstWord = words[0] || "";
  const secondWord = words[1] || "";
  const initials =
    firstWord && secondWord
      ? `${firstWord[0] || ""}${secondWord[0] || ""}`.toUpperCase()
      : name.slice(0, 2).toUpperCase() || "SP";

  const firstCity = item.cities?.[0];
  const cityName = firstCity?.city || "";
  const stateName = firstCity?.state || "";

  return {
    id: item.id,
    slug,
    name,
    initials,
    category: item.category || "Serviços Gerais",
    distance: item.radiusKm ? `${item.radiusKm}km` : "Disponível",
    rating: typeof item.rating === "number" ? item.rating : 5.0,
    reviewCount: typeof item.reviewCount === "number" ? item.reviewCount : 0,
    isAvailable: true,
    availabilityText: "Disponível",
    bannerUrl: undefined,
    logoUrl: logoUrl || undefined,
    about: {
      description,
      foundedYear: 2024,
      completedServices: 0,
      specialties: [],
      openingHours: [
        {
          days: "Segunda a Sexta",
          hours: "08:00 - 18:00",
        },
      ],
      address: {
        street: "",
        number: "",
        neighborhood: "",
        city: cityName,
        state: stateName,
        cep: "",
      },
      contact: {
        phone: "",
        whatsapp: "",
        email: "",
      },
    },
  };
}
