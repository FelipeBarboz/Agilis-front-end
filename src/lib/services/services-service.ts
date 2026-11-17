import { api } from "@/lib/api";
import { type Service, mockServices } from "@/lib/mocks/services";

export interface ServiceSearchItem {
  serviceId: string;
  storeId: string;
  unitId?: string;
  title: string;
  description: string;
  price: number;
  priceType: string;
  durationMinutes: number;
  category: string;
  hasPriceTiers: boolean;
  avgRating: number;
  reviewCount: number;
  city: string;
  state: string;
  thumbnailUrl: string;
  storeName: string;
  storeProfileImgUrl?: string;
  nextAvailableSlot?: string;
}

export interface ServicesSearchResponse {
  items: ServiceSearchItem[];
  totalElements: number;
  totalPages: number;
}

export interface ServiceDetailDTO {
  id: string;
  storeId: string;
  unitId?: string;
  title: string;
  description: string;
  price: number;
  priceType: string;
  durationMinutes: number;
  category: string;
  createdAt?: string;
  hasPriceTiers?: boolean;
  avgRating?: number;
  rating?: number;
  reviewCount?: number;
  totalServices?: number;
  city?: string;
  state?: string;
  thumbnailUrl?: string;
  images?: Array<{ id: string; serviceId: string; url: string }> | string[];
  storeName?: string;
  company?: string;
  storeProfileImgUrl?: string;
  nextAvailableSlot?: string;
  availability?: string;
  packages?: Array<{ label: string; description: string; price: number }>;
}

export interface SearchServicesParams {
  search?: string;
  q?: string;
  category?: string;
  state?: string;
  city?: string;
  minPrice?: number | "";
  maxPrice?: number | "";
  rating?: number;
  page?: number;
  size?: number;
  limit?: number;
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string[]> = {
  limpeza: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800",
  ],
  eletrica: [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
  ],
  hidraulica: [
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
  ],
  pintura: [
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800",
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800",
  ],
  tecnologia: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
  ],
  reparos: [
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
  ],
  construcao: [
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
  ],
  marcenaria: [
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
  ],
  climatizacao: [
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
  ],
};

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800";

export function getFallbackImagesForCategory(
  category: string,
  serviceId: string
): Array<{ id: string; serviceId: string; url: string }> {
  const normalizedCategory = (category || "").toLowerCase();
  const list = CATEGORY_FALLBACK_IMAGES[normalizedCategory] ?? [DEFAULT_FALLBACK_IMAGE];
  return list.map((url, i) => ({
    id: `img-${serviceId}-${i + 1}`,
    serviceId,
    url,
  }));
}

/**
 * Converte um item de busca retornado por /api/v1/services/search
 * para o modelo de dados padrão Service utilizado pelos componentes visuais.
 */
export function normalizeSearchItemToService(item: ServiceSearchItem): Service {
  const priceInicial = Number(item.price) || 0;
  const pType: "FIXED" | "FROM" =
    String(item.priceType).toUpperCase() === "FIXED" ? "FIXED" : "FROM";
  const normalizedCat = (item.category || "").toLowerCase();

  const images = item.thumbnailUrl && item.thumbnailUrl.trim().length > 0
    ? [{ id: `img-${item.serviceId}`, serviceId: item.serviceId, url: item.thumbnailUrl.trim() }]
    : getFallbackImagesForCategory(normalizedCat, item.serviceId);

  return {
    id: item.serviceId,
    storeId: item.storeId,
    title: item.title,
    description: item.description,
    price: {
      inicial: priceInicial,
      medio: Math.round(priceInicial * 1.5),
      alto: Math.round(priceInicial * 2.2),
    },
    priceType: pType,
    durationMinutes: item.durationMinutes || 60,
    createdAt: new Date().toISOString(),
    rating: typeof item.avgRating === "number" && item.avgRating > 0 ? item.avgRating : 4.8,
    reviewCount: typeof item.reviewCount === "number" ? item.reviewCount : 0,
    totalServices: typeof item.reviewCount === "number" && item.reviewCount > 0
      ? Math.max(item.reviewCount, Math.round(item.reviewCount * 1.2))
      : 10,
    company: item.storeName || "Prestador Agilis",
    city: item.city || "",
    state: item.state || "",
    availability: item.nextAvailableSlot ?? "Disponível para agendamento",
    category: normalizedCat,
    packages: [
      { label: "Básico", description: "Atendimento padrão", price: priceInicial },
      ...(item.hasPriceTiers
        ? [
            { label: "Médio", description: "Atendimento intermediário", price: Math.round(priceInicial * 1.5) },
            { label: "Completo", description: "Atendimento completo e avançado", price: Math.round(priceInicial * 2.2) },
          ]
        : []),
    ],
    images,
  };
}

/**
 * Converte os dados detalhados retornados por /api/v1/services/{id}
 * para o modelo de dados padrão Service.
 */
export function normalizeDetailToService(detail: ServiceDetailDTO): Service {
  const priceInicial = Number(detail.price) || 0;
  const pType: "FIXED" | "FROM" =
    String(detail.priceType).toUpperCase() === "FIXED" ? "FIXED" : "FROM";
  const normalizedCat = (detail.category || "limpeza").toLowerCase();

  // Tratamento robusto para imagens
  let images: Array<{ id: string; serviceId: string; url: string }> = [];
  if (Array.isArray(detail.images) && detail.images.length > 0) {
    images = detail.images.map((img, i) => {
      if (typeof img === "string") {
        return { id: `img-${detail.id}-${i + 1}`, serviceId: detail.id, url: img };
      }
      return img;
    });
  } else if (detail.thumbnailUrl && detail.thumbnailUrl.trim().length > 0) {
    images = [{ id: `img-${detail.id}`, serviceId: detail.id, url: detail.thumbnailUrl.trim() }];
  } else {
    images = getFallbackImagesForCategory(normalizedCat, detail.id);
  }

  // Tratamento de pacotes
  let packages = detail.packages;
  if (!packages || packages.length === 0) {
    packages = [
      { label: "Básico", description: "Atendimento e escopo padrão", price: priceInicial },
      ...(pType !== "FIXED"
        ? [
            { label: "Médio", description: "Atendimento intermediário", price: Math.round(priceInicial * 1.5) },
            { label: "Completo", description: "Atendimento completo premium", price: Math.round(priceInicial * 2.2) },
          ]
        : []),
    ];
  }

  const rating = detail.rating ?? detail.avgRating ?? 4.8;
  const reviewCount = detail.reviewCount ?? 12;
  const totalServices = detail.totalServices ?? Math.max(reviewCount, 15);
  const company = detail.company ?? detail.storeName ?? "Prestador Agilis";
  const city = detail.city ?? "São Paulo";
  const state = detail.state ?? "SP";
  const availability = detail.availability ?? detail.nextAvailableSlot ?? "Disponível para agendamento";

  return {
    id: detail.id,
    storeId: detail.storeId,
    title: detail.title,
    description: detail.description,
    price: {
      inicial: priceInicial,
      medio: Math.round(priceInicial * 1.5),
      alto: Math.round(priceInicial * 2.2),
    },
    priceType: pType,
    durationMinutes: detail.durationMinutes || 60,
    createdAt: detail.createdAt ?? new Date().toISOString(),
    rating,
    reviewCount,
    totalServices,
    company,
    city,
    state,
    availability,
    category: normalizedCat,
    packages,
    images,
  };
}

/**
 * Busca de serviços com filtros:
 * GET /api/v1/services/search
 */
export async function fetchServicesSearch(
  params: SearchServicesParams = {}
): Promise<ServicesSearchResponse> {
  const query = new URLSearchParams();

  const searchTerm = (params.search ?? params.q ?? "").trim();
  if (searchTerm) {
    query.set("q", searchTerm);
    query.set("search", searchTerm);
  }

  if (params.category && params.category !== "todos") {
    // A API documenta categorias em maiúsculas (ex: LIMPEZA)
    query.set("category", params.category.trim().toUpperCase());
  }

  if (params.state && params.state.trim().length > 0) {
    query.set("state", params.state.trim().toUpperCase());
  }

  if (params.city && params.city.trim().length > 0) {
    query.set("city", params.city.trim());
  }

  if (typeof params.minPrice === "number" && !isNaN(params.minPrice) && params.minPrice > 0) {
    query.set("minPrice", String(params.minPrice));
  }

  if (typeof params.maxPrice === "number" && !isNaN(params.maxPrice) && params.maxPrice > 0) {
    query.set("maxPrice", String(params.maxPrice));
  }

  if (typeof params.rating === "number" && !isNaN(params.rating) && params.rating > 0) {
    query.set("rating", String(params.rating));
  }

  if (typeof params.page === "number" && params.page >= 0) {
    query.set("page", String(params.page));
  }

  const limit = params.size ?? params.limit ?? 15;
  query.set("size", String(limit));

  const queryString = query.toString();
  const endpoint = `/api/v1/services/search${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await api<ServicesSearchResponse>(endpoint);
    if (res && Array.isArray(res.items)) {
      return res;
    }
    // Caso a API retorne diretamente um array de itens
    if (Array.isArray(res)) {
      return {
        items: res as ServiceSearchItem[],
        totalElements: (res as ServiceSearchItem[]).length,
        totalPages: Math.ceil((res as ServiceSearchItem[]).length / limit),
      };
    }
    return {
      items: [],
      totalElements: 0,
      totalPages: 0,
    };
  } catch (err) {
    console.warn("[Services] Erro ao buscar serviços na API real, usando fallback de mock:", err);

    // Fallback gracioso para dados locais caso o backend esteja temporariamente indisponível
    const filteredMock = mockServices.filter((s) => {
      const matchSearch =
        !searchTerm ||
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat =
        !params.category ||
        params.category === "todos" ||
        s.category.toLowerCase() === params.category.toLowerCase();

      const matchState =
        !params.state ||
        s.state.toLowerCase() === params.state.toLowerCase();

      const matchCity =
        !params.city ||
        s.city.toLowerCase().includes(params.city.toLowerCase());

      const minP = typeof params.minPrice === "number" ? params.minPrice : 0;
      const maxP = typeof params.maxPrice === "number" ? params.maxPrice : Infinity;
      const matchPrice = s.price.inicial >= minP && s.price.inicial <= maxP;

      const matchRating = !params.rating || s.rating >= params.rating;

      return matchSearch && matchCat && matchState && matchCity && matchPrice && matchRating;
    });

    const mockItems: ServiceSearchItem[] = filteredMock.map((s) => ({
      serviceId: s.id,
      storeId: s.storeId,
      unitId: s.storeId,
      title: s.title,
      description: s.description,
      price: s.price.inicial,
      priceType: s.priceType,
      durationMinutes: s.durationMinutes,
      category: s.category.toUpperCase(),
      hasPriceTiers: s.packages.length > 1,
      avgRating: s.rating,
      reviewCount: s.reviewCount,
      city: s.city,
      state: s.state,
      thumbnailUrl: s.images[0]?.url ?? "",
      storeName: s.company,
      nextAvailableSlot: s.availability,
    }));

    return {
      items: mockItems,
      totalElements: mockItems.length,
      totalPages: Math.ceil(mockItems.length / limit),
    };
  }
}

/**
 * Busca os dados de um serviço por ID:
 * GET /api/v1/services/{id}
 */
export async function fetchServiceById(id: string): Promise<ServiceDetailDTO> {
  try {
    const res = await api<ServiceDetailDTO>(`/api/v1/services/${id}`);
    if (res?.id) {
      return res;
    }
    throw new Error("Formato inválido retornado pela API");
  } catch (err) {
    console.warn(`[Services] Falha ao consultar /api/v1/services/${id}, buscando fallback local:`, err);
    const mock = mockServices.find((s) => s.id === id);
    if (mock) {
      return {
        id: mock.id,
        storeId: mock.storeId,
        unitId: mock.storeId,
        title: mock.title,
        description: mock.description,
        price: mock.price.inicial,
        priceType: mock.priceType,
        durationMinutes: mock.durationMinutes,
        category: mock.category.toUpperCase(),
        createdAt: mock.createdAt,
        hasPriceTiers: mock.packages.length > 1,
        avgRating: mock.rating,
        rating: mock.rating,
        reviewCount: mock.reviewCount,
        totalServices: mock.totalServices,
        city: mock.city,
        state: mock.state,
        thumbnailUrl: mock.images[0]?.url ?? "",
        images: mock.images,
        storeName: mock.company,
        company: mock.company,
        availability: mock.availability,
        packages: mock.packages,
      };
    }
    throw err;
  }
}

/**
 * Função utilitária que busca e converte para o modelo Service do frontend.
 */
export async function getServiceById(id: string): Promise<Service> {
  const detail = await fetchServiceById(id);
  return normalizeDetailToService(detail);
}
