import { supabase } from "./supabase";
import { getStoredToken } from "./auth/token-storage";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  let token: string | undefined | null = getStoredToken();
  if (!token) {
    try {
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token;
    } catch {}
  }
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    "";

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/$/, "");
  let normalizedPath = path.trim().startsWith("/") ? path.trim() : `/${path.trim()}`;

  // Se baseUrl já termina com /api/v1 e o path também inicia com /api/v1, remove a duplicação
  if (baseUrl.endsWith("/api/v1") && normalizedPath.startsWith("/api/v1")) {
    normalizedPath = normalizedPath.slice(7);
  }

  const url = `${baseUrl}${normalizedPath}`;

  // Envia Content-Type apenas quando houver corpo na requisição
  const hasBody = init.body !== undefined && init.body !== null;

  const res = await fetch(url, {
    ...init,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(anonKey ? { apikey: anonKey } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    let errorMessage = `Erro HTTP ${res.status}`;
    let errorData: unknown = undefined;

    try {
      const text = await res.text();
      if (text && text.trim().length > 0) {
        try {
          const parsed: unknown = JSON.parse(text);
          errorData = parsed;
          if (typeof parsed === "object" && parsed !== null) {
            const errorRecord = parsed as Record<string, unknown>;
            const msg = errorRecord.message ?? errorRecord.reason ?? errorRecord.error;
            if (typeof msg === "string") {
              errorMessage = msg;
            } else {
              errorMessage = JSON.stringify(parsed);
            }
          } else if (typeof parsed === "string") {
            errorMessage = parsed;
          }
        } catch {
          errorMessage = text;
        }
      }
    } catch {}

    throw new ApiError(res.status, errorMessage, errorData);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text || text.trim() === "") {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}
