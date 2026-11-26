import { api } from "@/lib/api";
import { getFallbackImagesForCategory } from "@/lib/services/services-service";
import type {
  FavoriteItemDTO,
  FavoriteCreateResponseDTO,
  FavoriteService,
} from "@/types/favorite-service";

// ---------------------------------------------------------------------------
// Cache client-side dos IDs de serviços favoritados
// ---------------------------------------------------------------------------
const favoritedIds = new Set<string>();
let cacheLoaded = false;
let cacheLoadingPromise: Promise<void> | null = null;

/** Inicializa o cache buscando GET /api/v1/favorites (chamado uma única vez). */
export async function initFavoritesCache(): Promise<void> {
  if (cacheLoaded) return;
  if (cacheLoadingPromise) return cacheLoadingPromise;

  cacheLoadingPromise = (async () => {
    try {
      const data = await api<FavoriteItemDTO[]>("/api/v1/favorites");
      if (Array.isArray(data)) {
        data.forEach((item) => {
          const rawItem = item as unknown as Record<string, unknown>;
          const serviceId =
            (typeof rawItem.serviceId === "string" ? rawItem.serviceId : undefined) ??
            item.id;
          if (serviceId) favoritedIds.add(serviceId);
        });
        dispatchFavoritesChanged();
      }
    } catch {
      // Falha silenciosa — cache fica vazio, não impede a UI
    } finally {
      cacheLoaded = true;
      cacheLoadingPromise = null;
    }
  })();

  return cacheLoadingPromise;
}

/** Retorna true se o serviço está nos favoritos do cache local. */
export function isServiceFavorite(serviceId: string): boolean {
  return favoritedIds.has(serviceId);
}

/** Evento customizado para notificar componentes sobre mudanças nos favoritos. */
const FAVORITES_CHANGED = "favorites-changed";

function dispatchFavoritesChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(FAVORITES_CHANGED));
  }
}

export { FAVORITES_CHANGED };

/**
 * Converte um item da API (/api/v1/favorites) para o modelo FavoriteService usado na UI
 */
export function normalizeFavoriteItem(item: FavoriteItemDTO): FavoriteService {
  const rawItem = item as unknown as Record<string, unknown>;
  const serviceObj =
    typeof rawItem.service === "object" && rawItem.service !== null
      ? (rawItem.service as Record<string, unknown>)
      : null;

  // Identifica de forma inteligente o serviceId e favoriteId
  const serviceId =
    (typeof rawItem.serviceId === "string" ? rawItem.serviceId : undefined) ??
    (typeof serviceObj?.id === "string" ? serviceObj.id : undefined) ??
    item.id;

  const favoriteId =
    (typeof rawItem.favoriteId === "string" ? rawItem.favoriteId : undefined) ??
    (typeof rawItem.favorite_id === "string" ? rawItem.favorite_id : undefined) ??
    (serviceId !== item.id ? item.id : undefined);

  const title =
    (typeof serviceObj?.title === "string" ? serviceObj.title : undefined) ??
    item.title;

  const category =
    (typeof serviceObj?.category === "string" ? serviceObj.category : undefined) ??
    item.category;

  const price =
    (typeof serviceObj?.price === "number" || typeof serviceObj?.price === "string"
      ? serviceObj.price
      : undefined) ?? item.price;

  const normalizedCategory = (category ?? "limpeza").toLowerCase();

  // Tratamento de imagem com fallback por categoria
  const categoryFallbacks = getFallbackImagesForCategory(normalizedCategory, serviceId);
  const fallbackUrl =
    categoryFallbacks[0]?.url ??
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800";

  let imageUrl = fallbackUrl;
  if (item.thumbnailUrl && item.thumbnailUrl.trim().length > 0) {
    imageUrl = item.thumbnailUrl.trim();
  } else if (item.imageUrl && item.imageUrl.trim().length > 0) {
    imageUrl = item.imageUrl.trim();
  } else if (Array.isArray(item.images) && item.images.length > 0) {
    const firstImg = item.images[0];
    if (typeof firstImg === "string" && firstImg.trim().length > 0) {
      imageUrl = firstImg.trim();
    } else if (typeof firstImg === "object" && firstImg && "url" in firstImg && firstImg.url) {
      imageUrl = firstImg.url.trim();
    }
  }

  const startingPrice =
    typeof price === "number" ? price : Number(price) || 0;

  const rating =
    typeof item.rating === "number"
      ? item.rating
      : typeof item.avgRating === "number"
        ? item.avgRating
        : 4.8;

  const reviewsCount =
    typeof item.reviewsCount === "number"
      ? item.reviewsCount
      : typeof item.reviewCount === "number"
        ? item.reviewCount
        : 12;

  const servicesCount =
    typeof item.totalServices === "number"
      ? item.totalServices
      : Math.max(reviewsCount, 15);

  const trimmedStoreName = item.storeName?.trim();
  const trimmedCompany = item.company?.trim();
  const providerName =
    (trimmedStoreName && trimmedStoreName.length > 0 ? trimmedStoreName : undefined) ??
    (trimmedCompany && trimmedCompany.length > 0 ? trimmedCompany : undefined) ??
    "Prestador Agilis";

  const providerAvatarUrl = item.storeProfileImgUrl?.trim() ?? "";

  const trimmedAvailability = item.availability?.trim();
  const trimmedNextSlot = item.nextAvailableSlot?.trim();
  const availabilityLabel =
    (trimmedAvailability && trimmedAvailability.length > 0 ? trimmedAvailability : undefined) ??
    (trimmedNextSlot && trimmedNextSlot.length > 0 ? trimmedNextSlot : undefined) ??
    "Disponível para agendamento";

  const trimmedTitle = title?.trim();
  const name =
    trimmedTitle && trimmedTitle.length > 0 ? trimmedTitle : "Serviço sem título";

  return {
    id: serviceId,
    favoriteId,
    serviceId,
    storeId: item.storeId,
    unitId: item.unitId,
    name,
    imageUrl,
    rating,
    reviewsCount,
    servicesCount,
    providerName,
    providerAvatarUrl,
    availabilityLabel,
    startingPrice,
    isFavorite: true,
    category: normalizedCategory,
    description: item.description ?? "",
    durationMinutes: item.durationMinutes ?? 60,
    priceType: item.priceType ?? "FIXED",
    createdAt: item.createdAt,
  };
}

/**
 * Busca a lista de serviços favoritados pelo usuário autenticado:
 * GET /api/v1/favorites
 */
export async function fetchFavorites(): Promise<FavoriteService[]> {
  const data = await api<FavoriteItemDTO[]>("/api/v1/favorites");

  if (!Array.isArray(data)) {
    favoritedIds.clear();
    cacheLoaded = true;
    dispatchFavoritesChanged();
    return [];
  }

  // Atualiza o cache diretamente a partir da resposta real da API
  favoritedIds.clear();
  const validItems = data.filter((item) => {
    const rawItem = item as unknown as Record<string, unknown>;
    const serviceId =
      (typeof rawItem.serviceId === "string" ? rawItem.serviceId : undefined) ??
      item.id;
    if (serviceId) favoritedIds.add(serviceId);
    return Boolean(serviceId);
  });

  cacheLoaded = true;
  dispatchFavoritesChanged();

  return validItems.map(normalizeFavoriteItem);
}

/**
 * Adiciona um serviço aos favoritos:
 * POST /api/v1/favorites/{serviceId}
 */
export async function addFavorite(
  serviceId: string
): Promise<FavoriteCreateResponseDTO> {
  const cleanId = serviceId.trim();
  if (!cleanId) {
    throw new Error("serviceId inválido para favoritar");
  }

  favoritedIds.add(cleanId);
  dispatchFavoritesChanged();
  try {
    const result = await api<FavoriteCreateResponseDTO>(
      `/api/v1/favorites/${encodeURIComponent(cleanId)}`,
      {
        method: "POST",
      }
    );
    return result;
  } catch (err) {
    // Reverte o cache em caso de falha
    favoritedIds.delete(cleanId);
    dispatchFavoritesChanged();
    throw err;
  }
}

/**
 * Remove um serviço dos favoritos:
 * DELETE /api/v1/favorites/{serviceId}
 */
export async function removeFavorite(serviceId: string): Promise<void> {
  const cleanId = serviceId.trim();
  if (!cleanId) return;

  favoritedIds.delete(cleanId);
  dispatchFavoritesChanged();

  try {
    await api<void>(`/api/v1/favorites/${encodeURIComponent(cleanId)}`, {
      method: "DELETE",
    });
  } catch (err) {
    // Reverte o cache em caso de falha
    favoritedIds.add(cleanId);
    dispatchFavoritesChanged();
    throw err;
  }
}
