import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import {
  getStoredToken,
  getStoredUser,
  saveStoredSession,
  clearStoredSession,
  AUTH_COOKIE_NAME,
  AUTH_USER_COOKIE_NAME,
} from "./token-storage";

export {
  getStoredToken,
  getStoredUser,
  saveStoredSession,
  clearStoredSession,
  AUTH_COOKIE_NAME,
  AUTH_USER_COOKIE_NAME,
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpf: string | null;
  avatarUrl: string | null;
  role?: string;
  createdAt?: string;
}

export interface ValidateEmailResponse {
  valid: boolean;
  reason: string | null;
}

export interface RegisterClientData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

/**
 * Valida o e-mail antes de cadastrar.
 * Tenta a validação na API; caso indisponível, libera o fluxo para o Supabase Auth validar.
 */
export async function validateEmail(email: string): Promise<ValidateEmailResponse> {
  try {
    return await api<ValidateEmailResponse>(
      `/api/v1/auth/validate-email?email=${encodeURIComponent(email)}`
    );
  } catch (err) {
    console.warn("[Auth] Validação externa de e-mail ignorada ou indisponível:", err);
    return { valid: true, reason: null };
  }
}

/**
 * Cria ou sincroniza o perfil de cliente após confirmação do OTP ou login com Google:
 * Salva no Supabase (metadados do usuário) e tenta sincronizar com o backend.
 */
export async function registerClientProfile(
  data: RegisterClientData
): Promise<UserProfile> {
  // Atualiza metadados no Supabase Auth para garantir persistência imediata
  try {
    await supabase.auth.updateUser({
      data: {
        name: data.name,
        full_name: data.name,
        phone: data.phone,
        cpf: data.cpf,
      },
    });
  } catch (err) {
    console.warn("[Auth] Erro ao sincronizar metadados no Supabase:", err);
  }

  // Tenta persistir no backend remoto
  try {
    const res = await api<UserProfile>("/api/v1/auth/register/client", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res && res.id) return res;
  } catch (err) {
    console.warn("[Auth] Backend remoto /api/v1/auth/register/client indisponível:", err);
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const sessionUser = sessionData.session?.user;

  return {
    id: sessionUser?.id ?? `user_${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    cpf: data.cpf,
    avatarUrl: null,
    role: "Cliente",
  };
}

/**
 * Obtém o perfil do usuário logado:
 * Busca na API remota (/api/v1/users/me com Bearer token).
 * Salva no localStorage e cookies para garantir que a sessão fique persistida.
 * Se a API remota estiver indisponível, utiliza os dados em cache ou metadados do Supabase.
 */
export async function getCurrentUserProfile(): Promise<UserProfile> {
  let token = getStoredToken();
  let sessionUser = null;

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    sessionUser = sessionData.session?.user;
    if (!token && sessionData.session?.access_token) {
      token = sessionData.session.access_token;
    }
  } catch {}

  // 1. Tenta buscar no endpoint oficial da API: GET /api/v1/users/me
  if (token) {
    try {
      const apiProfile = await api<UserProfile>("/api/v1/users/me");
      if (apiProfile && (apiProfile.id || apiProfile.email)) {
        const fullProfile: UserProfile = {
          id: apiProfile.id || sessionUser?.id || "user",
          name:
            apiProfile.name ||
            (sessionUser?.user_metadata?.name as string | undefined) ||
            (sessionUser?.user_metadata?.full_name as string | undefined) ||
            apiProfile.email?.split("@")[0] ||
            "Usuário",
          email: apiProfile.email || sessionUser?.email || "",
          phone:
            apiProfile.phone ??
            (sessionUser?.user_metadata?.phone as string | undefined) ??
            null,
          cpf:
            apiProfile.cpf ??
            (sessionUser?.user_metadata?.cpf as string | undefined) ??
            null,
          avatarUrl:
            apiProfile.avatarUrl ??
            (sessionUser?.user_metadata?.avatar_url as string | undefined) ??
            null,
          role:
            apiProfile.role ??
            (sessionUser?.user_metadata?.role as string | undefined) ??
            "Cliente",
          createdAt: apiProfile.createdAt ?? sessionUser?.created_at,
        };

        saveStoredSession(token, fullProfile);
        return fullProfile;
      }
    } catch (err) {
      console.warn("[Auth] Erro ao consultar /api/v1/users/me:", err);
    }
  }

  // 2. Se a API falhou, tenta usar perfil em cache do localStorage / cookies
  const cachedUser = getStoredUser();
  if (cachedUser && (cachedUser.id || cachedUser.email)) {
    return cachedUser as UserProfile;
  }

  // 3. Fallback para metadados do Supabase
  if (!sessionUser) {
    throw new Error("Nenhum usuário autenticado no Supabase ou LocalStorage");
  }

  const fallbackProfile: UserProfile = {
    id: sessionUser.id,
    name:
      (sessionUser.user_metadata?.name as string | undefined) ??
      (sessionUser.user_metadata?.full_name as string | undefined) ??
      sessionUser.email?.split("@")[0] ??
      "Usuário",
    email: sessionUser.email ?? "",
    phone: (sessionUser.user_metadata?.phone as string | undefined) ?? null,
    cpf: (sessionUser.user_metadata?.cpf as string | undefined) ?? null,
    avatarUrl:
      (sessionUser.user_metadata?.avatar_url as string | undefined) ?? null,
    role: (sessionUser.user_metadata?.role as string | undefined) ?? "Cliente",
    createdAt: sessionUser.created_at,
  };

  if (token) {
    saveStoredSession(token, fallbackProfile);
  }

  return fallbackProfile;
}

/**
 * Atualiza o perfil do usuário autenticado no Supabase e tenta sincronizar com a API.
 */
export async function updateUserProfile(
  data: Partial<RegisterClientData & { avatarUrl?: string | null }>
): Promise<UserProfile> {
  const { data: updated, error } = await supabase.auth.updateUser({
    data: {
      ...(data.name ? { name: data.name, full_name: data.name } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.cpf !== undefined ? { cpf: data.cpf } : {}),
      ...(data.avatarUrl !== undefined ? { avatar_url: data.avatarUrl } : {}),
    },
  });

  if (error) {
    throw error;
  }

  try {
    await api<UserProfile>("/api/v1/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  } catch {
    // Silencia se a API remota não tiver o endpoint
  }

  const user = updated.user;
  return {
    id: user.id,
    name:
      (user.user_metadata?.name as string | undefined) ??
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "Usuário",
    email: user.email ?? "",
    phone: (user.user_metadata?.phone as string | undefined) ?? null,
    cpf: (user.user_metadata?.cpf as string | undefined) ?? null,
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    role: (user.user_metadata?.role as string | undefined) ?? "Cliente",
    createdAt: user.created_at,
  };
}

/**
 * Cria uma nova loja / prestador:
 * POST /api/v1/stores
 */
export async function createStore(storeData: unknown): Promise<unknown> {
  return await api("/api/v1/stores", {
    method: "POST",
    body: JSON.stringify(storeData),
  });
}

/**
 * Cadastro inicial no Supabase Auth:
 * Dispara o e-mail com o código de 8 dígitos.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { name?: string; phone?: string; cpf?: string }
) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: metadata?.name,
        full_name: metadata?.name,
        phone: metadata?.phone,
        cpf: metadata?.cpf,
      },
    },
  });
}

/**
 * Confirma o código de 8 dígitos no Supabase Auth:
 * type: 'signup' (para cadastro) ou 'recovery' (para redefinição de senha).
 */
export async function verifyOtpCode(
  email: string,
  token: string,
  type: "signup" | "recovery" = "signup"
) {
  return await supabase.auth.verifyOtp({
    email,
    token,
    type,
  });
}

/**
 * Login com email e senha no Supabase:
 */
export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Login com Google OAuth via Supabase:
 */
export async function signInWithGoogle(redirectPath?: string) {
  const redirectOrigin =
    typeof window !== "undefined" ? window.location.origin : "";
  const redirectTo = `${redirectOrigin}/auth/callback${
    redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""
  }`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error) {
    return { data, error };
  }

  // Garante o redirecionamento imediato no browser caso o Supabase não o tenha feito
  if (data?.url && typeof window !== "undefined") {
    window.location.assign(data.url);
  }

  return { data, error: null };
}

/**
 * Login com Google via ID Token (Google Identity Services):
 */
export async function signInWithGoogleIdToken(idToken: string) {
  return await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });
}

/**
 * Solicitação de redefinição de senha (envia código de 8 dígitos por email):
 */
export async function requestPasswordReset(email: string) {
  return await supabase.auth.resetPasswordForEmail(email);
}

/**
 * Atualiza a senha do usuário:
 */
export async function updateUserPassword(password: string) {
  return await supabase.auth.updateUser({ password });
}

/**
 * Logout no Supabase:
 */
export async function signOutUser() {
  return await supabase.auth.signOut();
}

/**
 * Helper para compatibilidade de tipos e headers de autorização
 */
export interface AuthHeaders {
  Authorization: string;
  apikey: string;
  "Content-Type": string;
}

export function createAuthHeaders(token?: string): AuthHeaders {
  return {
    Authorization: token ? `Bearer ${token}` : "",
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    "Content-Type": "application/json",
  };
}

export type MockAuthHeaders = AuthHeaders;
export const createMockAuthHeaders = createAuthHeaders;

/**
 * Validação assíncrona da sessão para componentes de guarda (AuthGuard).
 */
export async function verifyAuthSession(): Promise<{
  isAuthenticated: boolean;
  user: UserProfile | null;
}> {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const profile = await getCurrentUserProfile();
    return { isAuthenticated: true, user: profile };
  } catch {
    const sessionUser = data.session.user;
    const fallbackProfile: UserProfile = {
      id: sessionUser.id,
      name:
        (sessionUser.user_metadata?.name as string | undefined) ??
        (sessionUser.user_metadata?.full_name as string | undefined) ??
        sessionUser.email?.split("@")[0] ??
        "Usuário",
      email: sessionUser.email ?? "",
      phone: (sessionUser.user_metadata?.phone as string | undefined) ?? null,
      cpf: (sessionUser.user_metadata?.cpf as string | undefined) ?? null,
      avatarUrl:
        (sessionUser.user_metadata?.avatar_url as string | undefined) ?? null,
      role: (sessionUser.user_metadata?.role as string | undefined) ?? "Cliente",
      createdAt: sessionUser.created_at,
    };
    return { isAuthenticated: true, user: fallbackProfile };
  }
}
