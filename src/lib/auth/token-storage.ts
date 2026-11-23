export interface StoredUserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpf: string | null;
  avatarUrl: string | null;
  role?: string;
  createdAt?: string;
}

export const AUTH_COOKIE_NAME = "sb-access-token";
export const AUTH_USER_COOKIE_NAME = "sb-user";

/**
 * Retorna o token de autenticação armazenado.
 * Prioridade:
 * 1. localStorage ("sb-access-token")
 * 2. Cookie ("sb-access-token")
 * 3. Cookies chunked do Supabase (@supabase/ssr: sb-<ref>-auth-token ou sb-<ref>-auth-token.0)
 * 4. Chaves padrão do Supabase no localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1. Busca direta em localStorage
  try {
    const localToken = localStorage.getItem(AUTH_COOKIE_NAME);
    if (localToken && typeof localToken === "string" && localToken.length > 5) {
      return localToken;
    }
  } catch {}

  // 2. Busca no cookie sb-access-token
  try {
    const cookieMatch = /(?:^|;\s*)sb-access-token=([^;]*)/.exec(document.cookie);
    if (cookieMatch?.[1]) {
      const decoded = decodeURIComponent(cookieMatch[1]);
      if (decoded && decoded.length > 5) return decoded;
    }
  } catch {}

  // 3. Busca nos cookies chunked do Supabase (@supabase/ssr)
  try {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const supabaseTokenCookies = cookies
      .filter((c) => /^sb-[^=]+-auth-token(\.\d+)?=/.test(c))
      .sort((a, b) => {
        // Ordena por índice (.0, .1, etc.)
        const matchA = /\.([0-9]+)=/.exec(a);
        const matchB = /\.([0-9]+)=/.exec(b);
        const idxA = matchA?.[1] ? parseInt(matchA[1], 10) : 0;
        const idxB = matchB?.[1] ? parseInt(matchB[1], 10) : 0;
        return idxA - idxB;
      });

    if (supabaseTokenCookies.length > 0) {
      const combined = supabaseTokenCookies
        .map((c) => c.split("=").slice(1).join("="))
        .join("");

      let raw = decodeURIComponent(combined);
      if (raw.startsWith("base64-")) {
        try {
          raw = atob(raw.slice(7));
        } catch {}
      }

      if (raw.startsWith("{") || raw.startsWith("[")) {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null && "access_token" in parsed) {
          const accessToken = (parsed as { access_token?: unknown }).access_token;
          if (typeof accessToken === "string") return accessToken;
        }
        if (Array.isArray(parsed) && typeof parsed[0] === "string") {
          return parsed[0];
        }
      }
    }
  } catch {}

  // 4. Busca em chaves do Supabase no localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("sb-") || key.includes("supabase.auth.token"))) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed && typeof parsed.access_token === "string") {
            return parsed.access_token;
          }
        }
      }
    }
  } catch {}

  return null;
}

/**
 * Retorna os dados do usuário armazenados em cache (localStorage ou cookies).
 */
export function getStoredUser(): StoredUserProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const local = localStorage.getItem(AUTH_USER_COOKIE_NAME);
    if (local) {
      const parsed = JSON.parse(local) as Record<string, unknown>;
      if (parsed && (parsed.id || parsed.email)) {
        return {
          id: String(parsed.id || "user"),
          name: String(parsed.name || "Usuário"),
          email: String(parsed.email || ""),
          phone: typeof parsed.phone === "string" ? parsed.phone : null,
          cpf: typeof parsed.cpf === "string" ? parsed.cpf : null,
          avatarUrl: typeof parsed.avatarUrl === "string" ? parsed.avatarUrl : null,
          role: typeof parsed.role === "string" ? parsed.role : "Cliente",
          createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : undefined,
        };
      }
    }
  } catch {}

  try {
    const cookieMatch = /(?:^|;\s*)sb-user=([^;]*)/.exec(document.cookie);
    if (cookieMatch?.[1]) {
      const parsed = JSON.parse(decodeURIComponent(cookieMatch[1])) as Record<string, unknown>;
      if (parsed && (parsed.id || parsed.email)) {
        return {
          id: String(parsed.id || "user"),
          name: String(parsed.name || "Usuário"),
          email: String(parsed.email || ""),
          phone: typeof parsed.phone === "string" ? parsed.phone : null,
          cpf: typeof parsed.cpf === "string" ? parsed.cpf : null,
          avatarUrl: typeof parsed.avatarUrl === "string" ? parsed.avatarUrl : null,
          role: typeof parsed.role === "string" ? parsed.role : "Cliente",
          createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : undefined,
        };
      }
    }
  } catch {}

  return null;
}

/**
 * Salva o token e o perfil nos storages (localStorage e cookies) para sincronização completa.
 */
export function saveStoredSession(token: string, user: StoredUserProfile): void {
  if (typeof window === "undefined") return;

  try {
    if (token) {
      localStorage.setItem(AUTH_COOKIE_NAME, token);
      const maxAge = 60 * 60 * 24 * 7; // 7 dias
      document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    if (user) {
      localStorage.setItem(AUTH_USER_COOKIE_NAME, JSON.stringify(user));
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `${AUTH_USER_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    // Dispara evento para sincronizar componentes na mesma aba
    window.dispatchEvent(new Event("auth-change"));
  } catch (err) {
    console.warn("[Auth] Erro ao salvar sessão no storage:", err);
  }
}

/**
 * Limpa o token e o perfil de todos os storages.
 */
export function clearStoredSession(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(AUTH_COOKIE_NAME);
    localStorage.removeItem(AUTH_USER_COOKIE_NAME);
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${AUTH_USER_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    window.dispatchEvent(new Event("auth-change"));
  } catch (err) {
    console.warn("[Auth] Erro ao limpar sessão do storage:", err);
  }
}
