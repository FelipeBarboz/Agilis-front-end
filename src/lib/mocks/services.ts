export type ServicePackage = {
  label: string;
  description: string;
  price: number;
};

export type Service = {
  id: string;
  storeId: string;
  title: string;
  description: string;
  price: {
    inicial: number;
    medio: number;
    alto: number;
  };
  priceType: "FIXED" | "FROM";
  durationMinutes: number;
  createdAt: string;
  rating: number;
  reviewCount: number;
  totalServices: number;
  company: string;
  availability: string;
  category: string;
  packages: ServicePackage[];
  images: { id: string; serviceId: string; url: string }[];
};

export const mockServices: Service[] = [
  {
    id: "1",
    storeId: "store-1",
    title: "Automação residencial",
    description: "Instalação e configuração de dispositivos inteligentes para sua casa, incluindo lâmpadas, tomadas, câmeras e assistentes virtuais.",
    price: { inicial: 150, medio: 250, alto: 400 },
    priceType: "FROM",
    durationMinutes: 120,
    createdAt: "2026-07-13T19:01:12.659Z",
    rating: 4.8,
    reviewCount: 96,
    totalServices: 103,
    company: "E-Clean",
    availability: "Amanhã, 15:00 disponível",
    category: "tecnologia",
    packages: [
      { label: "Básico",    description: "Até 3 dispositivos",     price: 150 },
      { label: "Médio",     description: "Até 8 dispositivos",     price: 250 },
      { label: "Completo",  description: "Acima de 8 dispositivos", price: 400 },
    ],
    images: [
      { id: "img-1a", serviceId: "1", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800" },
      { id: "img-1b", serviceId: "1", url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800" },
    ],
  },
  {
    id: "2",
    storeId: "store-1",
    title: "Caça vazamentos",
    description: "Detecção e reparo de vazamentos com equipamentos modernos e tecnologia de ponta sem necessidade de quebrar paredes.",
    price: { inicial: 150, medio: 220, alto: 350 },
    priceType: "FROM",
    durationMinutes: 90,
    createdAt: "2026-07-13T19:01:12.659Z",
    rating: 4.8,
    reviewCount: 96,
    totalServices: 103,
    company: "E-Clean",
    availability: "Amanhã, 15:00 disponível",
    category: "hidraulica",
    packages: [
      { label: "Simples",   description: "1 ponto de vazamento",   price: 150 },
      { label: "Médio",     description: "Até 3 pontos",           price: 220 },
      { label: "Complexo",  description: "Acima de 3 pontos",      price: 350 },
    ],
    images: [
      { id: "img-2a", serviceId: "2", url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800" },
      { id: "img-2b", serviceId: "2", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800" },
    ],
  },
  {
    id: "3",
    storeId: "store-1",
    title: "Conserto chuveiro",
    description: "Manutenção e troca de resistência, registro e duchas com peças de qualidade e garantia de serviço.",
    price: { inicial: 90, medio: 140, alto: 200 },
    priceType: "FROM",
    durationMinutes: 60,
    createdAt: "2026-07-13T19:01:12.659Z",
    rating: 4.8,
    reviewCount: 96,
    totalServices: 103,
    company: "E-Clean",
    availability: "Amanhã, 15:00 disponível",
    category: "hidraulica",
    packages: [
      { label: "Básico",    description: "Troca de resistência",   price: 90  },
      { label: "Médio",     description: "Troca de registro",      price: 140 },
      { label: "Completo",  description: "Revisão completa",       price: 200 },
    ],
    images: [
      { id: "img-3a", serviceId: "3", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800" },
    ],
  },
  {
    id: "4",
    storeId: "store-2",
    title: "Desentupimento de pia",
    description: "Desentupimento rápido com equipamento profissional e higienização do encanamento.",
    price: { inicial: 120, medio: 180, alto: 280 },
    priceType: "FROM",
    durationMinutes: 60,
    createdAt: "2026-07-13T19:01:12.659Z",
    rating: 4.7,
    reviewCount: 84,
    totalServices: 98,
    company: "HidroFix",
    availability: "Hoje, 18:00 disponível",
    category: "hidraulica",
    packages: [
      { label: "Simples",  description: "1 pia",         price: 120 },
      { label: "Médio",    description: "Até 3 pias",    price: 180 },
      { label: "Completo", description: "Casa completa", price: 280 },
    ],
    images: [
      { id: "img-4a", serviceId: "4", url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800" },
    ],
  },
  {
    id: "5",
    storeId: "store-2",
    title: "Instalação de tomadas",
    description: "Instalação e troca de tomadas e interruptores com segurança, seguindo as normas da ABNT.",
    price: { inicial: 80, medio: 130, alto: 200 },
    priceType: "FROM",
    durationMinutes: 45,
    createdAt: "2026-07-13T19:01:12.659Z",
    rating: 4.9,
    reviewCount: 112,
    totalServices: 145,
    company: "EletroMax",
    availability: "Amanhã, 09:00 disponível",
    category: "eletrica",
    packages: [
      { label: "Básico",   description: "Até 3 tomadas",  price: 80  },
      { label: "Médio",    description: "Até 6 tomadas",  price: 130 },
      { label: "Completo", description: "Acima de 6",     price: 200 },
    ],
    images: [
      { id: "img-5a", serviceId: "5", url: "https://images.unsplash.com/photo-1621905251189-08b45249ff78?w=800" },
    ],
  },
  {
    id: "6",
    storeId: "store-3",
    title: "Envernizamento",
    description: "Envernizamento de móveis e pisos com acabamento profissional e produtos de alta durabilidade.",
    price: { inicial: 200, medio: 320, alto: 500 },
    priceType: "FROM",
    durationMinutes: 180,
    createdAt: "2026-07-13T19:01:12.659Z",
    rating: 4.6,
    reviewCount: 73,
    totalServices: 89,
    company: "PinturaTop",
    availability: "Sexta, 10:00 disponível",
    category: "pintura",
    packages: [
      { label: "Básico",   description: "Até 5m²",    price: 200 },
      { label: "Médio",    description: "Até 15m²",   price: 320 },
      { label: "Completo", description: "Acima de 15m²", price: 500 },
    ],
    images: [
      { id: "img-6a", serviceId: "6", url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800" },
    ],
  },
  {
    id: "7",
    storeId: "store-3",
    title: "Limpeza pós-obra",
    description: "Limpeza completa após reformas e construções, incluindo remoção de entulho e limpeza de pisos e vidros.",
    price: { inicial: 300, medio: 450, alto: 700 },
    priceType: "FROM",
    durationMinutes: 240,
    createdAt: "2026-07-13T19:01:12.659Z",
    rating: 4.9,
    reviewCount: 58,
    totalServices: 67,
    company: "LimpaFácil",
    availability: "Sábado, 08:00 disponível",
    category: "limpeza",
    packages: [
      { label: "Básico",   description: "Até 50m²",    price: 300 },
      { label: "Médio",    description: "Até 100m²",   price: 450 },
      { label: "Completo", description: "Acima de 100m²", price: 700 },
    ],
    images: [
      { id: "img-7a", serviceId: "7", url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800" },
    ],
  },
  {
    id: "8",
    storeId: "store-4",
    title: "Pintura de fachada",
    description: "Pintura externa com tinta de alta durabilidade e resistência às intempéries.",
    price: { inicial: 500, medio: 800, alto: 1200 },
    priceType: "FROM",
    durationMinutes: 480,
    createdAt: "2026-07-13T19:01:12.659Z",
    rating: 4.7,
    reviewCount: 41,
    totalServices: 52,
    company: "PinturaTop",
    availability: "Segunda, 07:00 disponível",
    category: "pintura",
    packages: [
      { label: "Básico",   description: "Até 30m²",    price: 500  },
      { label: "Médio",    description: "Até 60m²",    price: 800  },
      { label: "Completo", description: "Acima de 60m²", price: 1200 },
    ],
    images: [
      { id: "img-8a", serviceId: "8", url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800" },
    ],
  },
  {
    id: "9",
    storeId: "store-4",
    title: "Instalação de ar-condicionado",
    description: "Instalação e manutenção de aparelhos split e janela com garantia de serviço.",
    price: { inicial: 250, medio: 380, alto: 550 },
    priceType: "FROM",
    durationMinutes: 150,
    createdAt: "2026-07-13T19:01:12.659Z",
    rating: 4.8,
    reviewCount: 89,
    totalServices: 112,
    company: "ClimaTech",
    availability: "Amanhã, 14:00 disponível",
    category: "tecnologia",
    packages: [
      { label: "Split 9k",  description: "Até 9.000 BTUs",  price: 250 },
      { label: "Split 12k", description: "Até 12.000 BTUs", price: 380 },
      { label: "Split 18k", description: "Acima de 12k",    price: 550 },
    ],
    images: [
      { id: "img-9a", serviceId: "9", url: "https://images.unsplash.com/photo-1631916028899-c294eeeba18a?w=800" },
    ],
  },
];

export const categories = [
  { id: "todos", label: "Todos" },
  { id: "limpeza", label: "Limpeza" },
  { id: "eletrica", label: "Elétrica" },
  { id: "hidraulica", label: "Hidráulica" },
  { id: "pintura", label: "Pintura" },
  { id: "tecnologia", label: "Tecnologia e TV" },
  { id: "reparos", label: "Reparos" },
  { id: "construcao", label: "Construção" },
  { id: "marcenaria", label: "Marcenaria" },
  { id: "climatizacao", label: "Climatização" },
] as const;