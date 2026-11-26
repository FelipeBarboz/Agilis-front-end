import { supabase } from "@/lib/supabase";
import { api, ApiError } from "@/lib/api";
import { createStore as createStoreApi, type CreateStorePayload } from "@/lib/services/stores-service";
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
 * Garante que o CPF esteja estritamente no formato com pontuação exigido pelo backend:
 * 000.000.000-00 (Client.java valida regex: ^\d{3}\.\d{3}\.\d{3}-\d{2}$)
 */
export function formatCpf(value: string): string {
  const digits = (value || "").replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Garante que o telefone esteja estritamente no formato esperado pelo backend:
 * (11) 99999-9999 ou (11) 9999-9999
 */
export function formatPhone(value: string): string {
  let digits = (value || "").replace(/\D/g, "");
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    digits = digits.slice(2);
  }
  digits = digits.slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Decodifica o cabeçalho do token JWT do Supabase para diagnosticar o algoritmo (ES256 vs HS256).
 */
export function checkJwtAlgorithm(token: string): string | null {
  try {
    const headerPart = token.split(".")[0];
    if (!headerPart) return null;
    let base64 = headerPart.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const decodedStr =
      typeof window !== "undefined" && typeof window.atob === "function"
        ? window.atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    const decoded = JSON.parse(decodedStr);
    return (decoded.alg as string) ?? null;
  } catch {
    return null;
  }
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
 * Cria o usuário como cliente na API do backend:
 * POST /api/v1/auth/register/client
 * 
 * Payload esperado pelo backend:
 * {
 *   "name": "Nome Completo",
 *   "email": "usuario@exemplo.com",
 *   "phone": "(11) 99999-9999",
 *   "cpf": "000.000.000-00"
 * }
 * 
 * Requer Bearer token para extrair o userId:
 * String userId = getCurrentUserId();
 */
export async function registerClient(
  data: RegisterClientData,
  token?: string
): Promise<UserProfile> {
  const formattedCpf = formatCpf(data.cpf);
  const formattedPhone = formatPhone(data.phone);

  const payload = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: formattedPhone,
    cpf: formattedCpf,
  };

  let authToken = token || getStoredToken();
  if (!authToken) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      authToken = sessionData.session?.access_token ?? null;
    } catch {}
  }

  if (!authToken) {
    throw new Error(
      "Usuário não autenticado. O cadastro de cliente na API exige uma sessão ativa do Supabase."
    );
  }

  try {
    return await api<UserProfile>("/api/v1/auth/register/client", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        const alg = checkJwtAlgorithm(authToken);
        console.error(
          `[Auth] Backend 401 Unauthorized ao registrar cliente. Algoritmo do JWT: "${alg}". Mensagem: "${err.message}". Verifique se o backend espera ES256 via JWKS e o Supabase está emitindo token compatível.`
        );
        throw new Error(
          `Falha de autenticação no backend (401: ${err.message}). Algoritmo do token: ${alg ?? "desconhecido"}. Verifique a configuração JWT do Supabase/Backend.`
        );
      }
      if (err.status === 400) {
        if (err.message.toLowerCase().includes("email already registered")) {
          throw new Error("Este e-mail já está cadastrado no sistema.");
        }
        if (err.message.toLowerCase().includes("cpf already registered")) {
          throw new Error("Este CPF já está cadastrado no sistema.");
        }
        if (err.message.toLowerCase().includes("invalid cpf")) {
          throw new Error("CPF inválido. O formato esperado é 000.000.000-00.");
        }
        throw new Error(err.message);
      }
      if (err.status === 409) {
        throw new Error(err.message || "Usuário ou cliente já cadastrado.");
      }
    }
    throw err;
  }
}

/**
 * Cria ou sincroniza o perfil de cliente após confirmação do OTP ou login com Google:
 * Salva no Supabase (metadados do usuário) e persiste no backend (/api/v1/auth/register/client).
 */
export async function registerClientProfile(
  data: RegisterClientData,
  token?: string
): Promise<UserProfile> {
  const formattedCpf = formatCpf(data.cpf);
  const formattedPhone = formatPhone(data.phone);

  // 1. Atualiza metadados no Supabase Auth para garantir persistência imediata
  try {
    await supabase.auth.updateUser({
      data: {
        name: data.name.trim(),
        full_name: data.name.trim(),
        phone: formattedPhone,
        cpf: formattedCpf,
        role: "Cliente",
      },
    });
  } catch (err) {
    console.warn("[Auth] Erro ao sincronizar metadados no Supabase:", err);
  }

  // 2. Persistir no backend remoto
  const res = await registerClient(
    {
      ...data,
      phone: formattedPhone,
      cpf: formattedCpf,
    },
    token
  );

  if (res?.id) {
    return res;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const sessionUser = sessionData.session?.user;

  return {
    id: sessionUser?.id ?? `user_${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: formattedPhone,
    cpf: formattedCpf,
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
  const formattedPhone = data.phone !== undefined ? formatPhone(data.phone) : undefined;
  const formattedCpf = data.cpf !== undefined ? formatCpf(data.cpf) : undefined;

  const { data: updated, error } = await supabase.auth.updateUser({
    data: {
      ...(data.name ? { name: data.name.trim(), full_name: data.name.trim() } : {}),
      ...(formattedPhone !== undefined ? { phone: formattedPhone } : {}),
      ...(formattedCpf !== undefined ? { cpf: formattedCpf } : {}),
      ...(data.avatarUrl !== undefined ? { avatar_url: data.avatarUrl } : {}),
    },
  });

  if (error) {
    throw error;
  }

  const user = updated.user;

  try {
    await api<UserProfile>("/api/v1/users/me", {
      method: "PUT",
      body: JSON.stringify({
        userId: user.id,
        name:
          data.name?.trim() ??
          (user.user_metadata?.name as string | undefined) ??
          (user.user_metadata?.full_name as string | undefined) ??
          "",
        phone:
          formattedPhone ??
          (user.user_metadata?.phone as string | undefined) ??
          "",
        email: data.email?.trim() ?? user.email ?? "",
      }),
    });
  } catch (apiErr) {
    console.warn("[Auth] Falha ao sincronizar perfil via PUT /api/v1/users/me:", apiErr);
  }
  return {
    id: user.id,
    name:
      (user.user_metadata?.name as string | undefined) ??
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "Usuário",
    email: user.email ?? "",
    phone: formattedPhone ?? (user.user_metadata?.phone as string | undefined) ?? null,
    cpf: formattedCpf ?? (user.user_metadata?.cpf as string | undefined) ?? null,
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    role: (user.user_metadata?.role as string | undefined) ?? "Cliente",
    createdAt: user.created_at,
  };
}

/**
 * Cria uma nova loja / prestador:
 * POST /api/v1/stores
 */
export async function createStore(storeData: CreateStorePayload | unknown): Promise<unknown> {
  return await createStoreApi(storeData as CreateStorePayload);
}

/**
 * Cadastro inicial no Supabase Auth:
 * Dispara o e-mail com o código de 8 dígitos.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { name?: string; phone?: string; cpf?: string; role?: string }
) {
  const formattedCpf = metadata?.cpf ? formatCpf(metadata.cpf) : undefined;
  const formattedPhone = metadata?.phone ? formatPhone(metadata.phone) : undefined;

  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: metadata?.name?.trim(),
        full_name: metadata?.name?.trim(),
        phone: formattedPhone,
        cpf: formattedCpf,
        role: metadata?.cpf ? "Cliente" : (metadata?.role ?? "Cliente"),
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
  let redirectOrigin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL || "https://agilisservices.vercel.app");

  redirectOrigin = redirectOrigin.replace(/\/$/, "");

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
