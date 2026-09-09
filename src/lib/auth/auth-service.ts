import { mockUser, type MockUser } from "@/lib/mocks/user";

export const AUTH_COOKIE_NAME = "sb-access-token";
export const AUTH_USER_COOKIE_NAME = "sb-user-data";

export interface MockAuthSession {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: MockUser;
}

export interface MockAuthHeaders {
  Authorization: string;
  apikey: string;
  "x-supabase-auth": string;
  "Content-Type": string;
}

/**
 * Cria os cabeçalhos de autenticação mockados que simulam o Supabase Auth.
 */
export function createMockAuthHeaders(token?: string): MockAuthHeaders {
  const currentToken = token || getStoredToken() || "mock-sb-access-token-agilis";
  return {
    Authorization: `Bearer ${currentToken}`,
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "mock-anon-key",
    "x-supabase-auth": "simulated-session",
    "Content-Type": "application/json",
  };
}

/**
 * Helper para leitura de cookie no cliente
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = new RegExp(`(^|;\\s*)${name}=([^;]*)`).exec(document.cookie);
  return match ? decodeURIComponent(match[2] ?? "") : null;
}

/**
 * Helper para gravação de cookie no cliente
 */
export function setCookie(name: string, value: string, maxAgeDays = 7): void {
  if (typeof document === "undefined") return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Helper para exclusão de cookie no cliente
 */
export function removeCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Obtém o token armazenado (cookie ou localStorage)
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  const cookieToken = getCookie(AUTH_COOKIE_NAME);
  if (cookieToken) return cookieToken;
  return localStorage.getItem(AUTH_COOKIE_NAME);
}

/**
 * Obtém os dados do usuário armazenados
 */
export function getStoredUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const rawCookie = getCookie(AUTH_USER_COOKIE_NAME);
    if (rawCookie) {
      return JSON.parse(rawCookie) as MockUser;
    }
    const rawStorage = localStorage.getItem(AUTH_USER_COOKIE_NAME);
    if (rawStorage) {
      return JSON.parse(rawStorage) as MockUser;
    }
  } catch {
    // Caso de erro de parse
  }
  return null;
}

/**
 * Simula o processo de login do Supabase Auth.
 * Envia cabeçalhos mockados na simulação e persiste o token e a sessão.
 */
export async function simulateSupabaseLogin(
  email: string,
  _password?: string
): Promise<MockAuthSession> {
  // Simulação de latência de rede da chamada de autenticação
  await new Promise((resolve) => setTimeout(resolve, 600));

  const mockToken = `mock-sb-access-token-${Date.now()}`;
  
  // Headers que simulam o envio de autenticação para a API
  const headers = createMockAuthHeaders(mockToken);
  console.info("[Supabase Auth Mock] Login realizado com headers:", headers);

  const authenticatedUser: MockUser = {
    ...mockUser,
    email: email || mockUser.email,
  };

  const session: MockAuthSession = {
    accessToken: mockToken,
    tokenType: "Bearer",
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    user: authenticatedUser,
  };

  // Persiste sessão em cookies (para o middleware Next.js) e localStorage
  setCookie(AUTH_COOKIE_NAME, mockToken);
  setCookie(AUTH_USER_COOKIE_NAME, JSON.stringify(authenticatedUser));

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_COOKIE_NAME, mockToken);
    localStorage.setItem(AUTH_USER_COOKIE_NAME, JSON.stringify(authenticatedUser));
    // Dispara evento para sincronizar componentes na mesma aba
    window.dispatchEvent(new Event("auth-change"));
  }

  return session;
}

/**
 * Simula o logout do Supabase Auth.
 */
export async function simulateSupabaseLogout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  removeCookie(AUTH_COOKIE_NAME);
  removeCookie(AUTH_USER_COOKIE_NAME);

  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_COOKIE_NAME);
    localStorage.removeItem(AUTH_USER_COOKIE_NAME);
    window.dispatchEvent(new Event("auth-change"));
  }
}

/**
 * Simula a verificação assíncrona (await) de autenticação nas páginas protegidas.
 */
export async function verifyAuthSession(): Promise<{
  isAuthenticated: boolean;
  user: MockUser | null;
}> {
  // Pequeno delay assíncrono para validação da sessão (await com visual de carregamento)
  await new Promise((resolve) => setTimeout(resolve, 350));

  const token = getStoredToken();
  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  const user = getStoredUser() ?? mockUser;
  return { isAuthenticated: true, user };
}
