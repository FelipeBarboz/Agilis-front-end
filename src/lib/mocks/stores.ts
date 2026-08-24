import { type Service, mockServices } from "./services";

export interface Store {
  id: string;
  slug: string;
  name: string;
  initials: string;
  category: string;
  distance: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  availabilityText: string;
  bannerUrl?: string;
  logoUrl?: string;
  about: {
    description: string;
    foundedYear: number;
    completedServices: number;
    specialties: string[];
    openingHours: {
      days: string;
      hours: string;
    }[];
    address: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
      cep: string;
    };
    contact: {
      phone: string;
      whatsapp: string;
      email: string;
    };
  };
}

export const mockStores: Store[] = [
  {
    id: "store-super-pinturas",
    slug: "super-pinturas",
    name: "Super Pinturas",
    initials: "SP",
    category: "Pintura e Acabamento",
    distance: "9,4km",
    rating: 4.9,
    reviewCount: 128,
    isAvailable: false,
    availabilityText: "Indisponível no momento",
    bannerUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1400&auto=format&fit=crop&q=80",
    about: {
      description:
        "A Super Pinturas é especializada em pintura residencial, comercial e acabamentos decorativos de alto padrão. Atuamos há mais de 10 anos trazendo cor, proteção e modernidade para casas e empresas com profissionais certificados e materiais de primeira linha.",
      foundedYear: 2014,
      completedServices: 1420,
      specialties: [
        "Pintura Decorativa & Efeitos Especiais",
        "Pintura Residencial Interna e Externa",
        "Pintura Comercial e Predial",
        "Tratamento e Envernizamento de Madeiras",
        "Impermeabilização e Restauração de Fachadas",
      ],
      openingHours: [
        { days: "Segunda a Sexta", hours: "08:00 - 18:00" },
        { days: "Sábado", hours: "08:00 - 13:00" },
        { days: "Domingo e Feriados", hours: "Fechado" },
      ],
      address: {
        street: "Av. das Nações Unidas",
        number: "12551",
        neighborhood: "Brooklin Novo",
        city: "São Paulo",
        state: "SP",
        cep: "04578-903",
      },
      contact: {
        phone: "(11) 3456-7890",
        whatsapp: "(11) 98765-4321",
        email: "contato@superpinturas.com.br",
      },
    },
  },
  {
    id: "store-1",
    slug: "e-clean",
    name: "E-Clean",
    initials: "EC",
    category: "Tecnologia e Hidráulica",
    distance: "3,2km",
    rating: 4.8,
    reviewCount: 96,
    isAvailable: true,
    availabilityText: "Disponível agora",
    bannerUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&auto=format&fit=crop&q=80",
    about: {
      description:
        "E-Clean oferece soluções inteligentes e modernas em automação residencial e reparos hidráulicos com rapidez e garantia.",
      foundedYear: 2019,
      completedServices: 850,
      specialties: ["Automação Residencial", "Caça Vazamentos", "Reparos Rápidos"],
      openingHours: [
        { days: "Segunda a Sábado", hours: "08:00 - 20:00" },
        { days: "Domingo", hours: "09:00 - 14:00" },
      ],
      address: {
        street: "Rua Vergueiro",
        number: "2010",
        neighborhood: "Vila Mariana",
        city: "São Paulo",
        state: "SP",
        cep: "04101-000",
      },
      contact: {
        phone: "(11) 3123-4567",
        whatsapp: "(11) 99123-4567",
        email: "contato@eclean.com.br",
      },
    },
  },
];

export const superPinturasServices: Service[] = [
  {
    id: "sp-1",
    storeId: "store-super-pinturas",
    title: "Pintura Decorativa Texturizada",
    description:
      "Aplicação profissional de textura projetada, grafiato, cimento queimado e efeitos marmorizados para salas, quartos e paredes de destaque.",
    price: { inicial: 250, medio: 400, alto: 650 },
    priceType: "FROM",
    durationMinutes: 180,
    createdAt: "2026-08-01T10:00:00.000Z",
    rating: 4.8,
    reviewCount: 96,
    totalServices: 103,
    company: "Super Pinturas",
    city: "São Paulo",
    state: "SP",
    availability: "Amanhã, 15:00 disponível",
    category: "pintura",
    packages: [
      { label: "Básico", description: "Até 1 parede (12m²)", price: 250 },
      { label: "Médio", description: "Até 2 paredes (25m²)", price: 400 },
      { label: "Completo", description: "Cômodo completo (40m²)", price: 650 },
    ],
    images: [
      {
        id: "img-sp-1",
        serviceId: "sp-1",
        url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "img-sp-1b",
        serviceId: "sp-1",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "sp-2",
    storeId: "store-super-pinturas",
    title: "Pintura Externa - Fachada",
    description:
      "Pintura completa de fachadas residenciais e prediais com tintas emborrachadas e acabamento de alta resistência climática.",
    price: { inicial: 400, medio: 750, alto: 1300 },
    priceType: "FROM",
    durationMinutes: 360,
    createdAt: "2026-08-02T10:00:00.000Z",
    rating: 4.8,
    reviewCount: 96,
    totalServices: 103,
    company: "Super Pinturas",
    city: "São Paulo",
    state: "SP",
    availability: "Amanhã, 15:00 disponível",
    category: "pintura",
    packages: [
      { label: "Básico", description: "Fachada até 30m²", price: 400 },
      { label: "Médio", description: "Fachada até 70m²", price: 750 },
      { label: "Completo", description: "Fachada até 150m² com impermeabilização", price: 1300 },
    ],
    images: [
      {
        id: "img-sp-2",
        serviceId: "sp-2",
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "sp-3",
    storeId: "store-super-pinturas",
    title: "Pintura Comercial",
    description:
      "Serviço rápido e limpo para lojas, escritórios, consultórios e galpões. Horários flexíveis para não interromper suas atividades.",
    price: { inicial: 500, medio: 950, alto: 1800 },
    priceType: "FROM",
    durationMinutes: 300,
    createdAt: "2026-08-03T10:00:00.000Z",
    rating: 4.8,
    reviewCount: 96,
    totalServices: 103,
    company: "Super Pinturas",
    city: "São Paulo",
    state: "SP",
    availability: "Amanhã, 15:00 disponível",
    category: "pintura",
    packages: [
      { label: "Sala Comercial", description: "Até 35m²", price: 500 },
      { label: "Escritório Médio", description: "Até 80m²", price: 950 },
      { label: "Andar Comercial", description: "Acima de 150m²", price: 1800 },
    ],
    images: [
      {
        id: "img-sp-3",
        serviceId: "sp-3",
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "sp-4",
    storeId: "store-super-pinturas",
    title: "Pintura de Madeira",
    description:
      "Lixamento, calafetação, pintura esmalte acetinado/brilhante para portas, janelas, decks, pergolados e móveis de madeira.",
    price: { inicial: 180, medio: 320, alto: 550 },
    priceType: "FROM",
    durationMinutes: 120,
    createdAt: "2026-08-04T10:00:00.000Z",
    rating: 4.8,
    reviewCount: 96,
    totalServices: 103,
    company: "Super Pinturas",
    city: "São Paulo",
    state: "SP",
    availability: "Amanhã, 15:00 disponível",
    category: "pintura",
    packages: [
      { label: "Porta / Janela", description: "Até 2 unidades", price: 180 },
      { label: "Deck Pequeno", description: "Até 10m²", price: 320 },
      { label: "Deck Completo / Pergolado", description: "Acima de 20m²", price: 550 },
    ],
    images: [
      {
        id: "img-sp-4",
        serviceId: "sp-4",
        url: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "sp-5",
    storeId: "store-super-pinturas",
    title: "Pintura Residencial",
    description:
      "Pintura geral de paredes internas, tetos e rodapés com preparação de superfície, emassamento e acabamento acetinado de alta lavabilidade.",
    price: { inicial: 350, medio: 600, alto: 1100 },
    priceType: "FROM",
    durationMinutes: 240,
    createdAt: "2026-08-05T10:00:00.000Z",
    rating: 4.8,
    reviewCount: 96,
    totalServices: 103,
    company: "Super Pinturas",
    city: "São Paulo",
    state: "SP",
    availability: "Amanhã, 15:00 disponível",
    category: "pintura",
    packages: [
      { label: "1 Cômodo", description: "Até 20m² de piso", price: 350 },
      { label: "2 Cômodos", description: "Até 45m² de piso", price: 600 },
      { label: "Apartamento Completo", description: "Até 75m² de piso", price: 1100 },
    ],
    images: [
      {
        id: "img-sp-5",
        serviceId: "sp-5",
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "sp-6",
    storeId: "store-super-pinturas",
    title: "Envernizamento",
    description:
      "Aplicação de verniz marítimo, poliuretano e stain preservativo para máxima proteção contra sol, chuva e umidade.",
    price: { inicial: 200, medio: 380, alto: 600 },
    priceType: "FROM",
    durationMinutes: 150,
    createdAt: "2026-08-06T10:00:00.000Z",
    rating: 4.8,
    reviewCount: 96,
    totalServices: 103,
    company: "Super Pinturas",
    city: "São Paulo",
    state: "SP",
    availability: "Amanhã, 15:00 disponível",
    category: "pintura",
    packages: [
      { label: "Básico", description: "Até 5m²", price: 200 },
      { label: "Médio", description: "Até 15m²", price: 380 },
      { label: "Completo", description: "Acima de 25m²", price: 600 },
    ],
    images: [
      {
        id: "img-sp-6",
        serviceId: "sp-6",
        url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
];

const DEFAULT_STORE: Store = mockStores[0]!;

export function getStoreById(idOrSlug?: string | null): Store {
  if (!idOrSlug) return DEFAULT_STORE;
  const found = mockStores.find(
    (s) => s.id === idOrSlug || s.slug === idOrSlug || s.name.toLowerCase() === idOrSlug.toLowerCase()
  );
  return found ?? DEFAULT_STORE;
}

export function getServicesByStore(store: Store): Service[] {
  if (store.id === "store-super-pinturas" || store.slug === "super-pinturas") {
    return superPinturasServices;
  }
  const filtered = mockServices.filter(
    (s) => s.storeId === store.id || s.company.toLowerCase() === store.name.toLowerCase()
  );
  return filtered.length > 0 ? filtered : superPinturasServices;
}
