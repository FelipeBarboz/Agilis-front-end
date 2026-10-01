import type { PermissionId } from "@/lib/mocks/positions";

// Status de um vínculo de funcionário com a loja
export type EmployeeStoreStatus = "pending" | "active" | "rejected";

// Representa um vínculo do usuário com uma loja (como funcionário ou provedor)
export interface UserStoreAssociation {
  id: string;
  storeId: string;
  storeName: string;
  storeInitials: string;
  storeLogoUrl?: string;
  storeBannerUrl?: string;
  storeCategory: string;
  role: "owner" | "employee";
  positionTitle: string;
  permissions: PermissionId[];
  status: EmployeeStoreStatus;
  joinedAt?: string;
}

// Representa um link de convite gerado pelo provedor para um cargo
export interface InviteLink {
  token: string;
  storeId: string;
  storeName: string;
  storeInitials: string;
  storeCategory?: string;
  storeLogoUrl?: string;
  positionId: string;
  positionTitle: string;
  permissions: PermissionId[];
  generatedAt: string;
  expiresAt: string;
  isUsed: boolean;
}

// Mock: Loja própria do usuário logado (ele é o PROPRIETÁRIO)
export const OWNER_STORE_DEFAULT: UserStoreAssociation = {
  id: "assoc-owner-1",
  storeId: "store-super-pinturas",
  storeName: "Super Pinturas",
  storeInitials: "SP",
  storeCategory: "Pintura e Acabamento",
  storeBannerUrl:
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80",
  role: "owner",
  positionTitle: "Proprietário",
  permissions: ["manage_appointments", "access_chats", "access_reports", "store_settings"],
  status: "active",
  joinedAt: "2024-01-15T10:00:00.000Z",
};

export const mockUserStoreAssociations: UserStoreAssociation[] = [
  OWNER_STORE_DEFAULT,
];

// Mock: Links de convite para OUTRA loja (onde ele ingressa como FUNCIONÁRIO)
// Exemplo: Loja "E-Clean Soluções Técnicas"
export const EXTERNAL_STORE_INVITE: InviteLink = {
  token: "inv-atendente-xyz789",
  storeId: "store-1",
  storeName: "E-Clean",
  storeInitials: "EC",
  storeCategory: "Tecnologia e Manutenção",
  positionId: "3",
  positionTitle: "Atendente Operacional",
  permissions: ["manage_appointments", "access_chats"],
  generatedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  isUsed: false,
};

export const mockInviteLinks: InviteLink[] = [
  EXTERNAL_STORE_INVITE,
  {
    token: "inv-gerente-abc123",
    storeId: "store-1",
    storeName: "E-Clean",
    storeInitials: "EC",
    storeCategory: "Tecnologia e Manutenção",
    positionId: "1",
    positionTitle: "Gerente Operacional",
    permissions: ["manage_appointments", "access_chats", "access_reports"],
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isUsed: false,
  },
  {
    token: "inv-tecnico-tec456",
    storeId: "store-1",
    storeName: "E-Clean",
    storeInitials: "EC",
    storeCategory: "Tecnologia e Manutenção",
    positionId: "2",
    positionTitle: "Técnico Especialista",
    permissions: ["manage_appointments"],
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isUsed: false,
  },
];

// Resolve um token de convite para o seu InviteLink
export function resolveInviteToken(tokenOrUrl: string): InviteLink | null {
  const token = tokenOrUrl.includes("/invite/")
    ? tokenOrUrl.split("/invite/").pop()?.split("?")[0] ?? tokenOrUrl
    : tokenOrUrl.trim();

  // Procura na lista cadastrada
  const found = mockInviteLinks.find((l) => l.token === token);
  if (found) return found;

  // Se o token foi gerado dinamicamente para um cargo da loja do proprietário
  if (token.startsWith("inv-")) {
    return {
      token,
      storeId: "store-1",
      storeName: "E-Clean",
      storeInitials: "EC",
      storeCategory: "Tecnologia e Manutenção",
      positionId: "3",
      positionTitle: "Atendente de Loja",
      permissions: ["manage_appointments", "access_chats"],
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isUsed: false,
    };
  }

  return null;
}

// Chave usada no localStorage para persistir associações do usuário
export const EMPLOYEE_STORES_KEY = "agilis_employee_stores_v2";

export function getEmployeeStoresFromStorage(): UserStoreAssociation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EMPLOYEE_STORES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UserStoreAssociation[];
    
    // Garante que a loja proprietária sempre esteja presente
    const hasOwner = parsed.some((a) => a.role === "owner" && a.storeId === OWNER_STORE_DEFAULT.storeId);
    if (!hasOwner) {
      return [OWNER_STORE_DEFAULT, ...parsed.filter((a) => a.storeId !== OWNER_STORE_DEFAULT.storeId)];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function saveEmployeeStoresToStorage(associations: UserStoreAssociation[]): void {
  if (typeof window === "undefined") return;
  // Garante que a loja de proprietário nunca seja deletada acidentalmente
  const hasOwner = associations.some((a) => a.role === "owner");
  const finalAssocs = hasOwner ? associations : [OWNER_STORE_DEFAULT, ...associations];
  localStorage.setItem(EMPLOYEE_STORES_KEY, JSON.stringify(finalAssocs));
}
