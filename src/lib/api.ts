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

function defaultStatusMessage(status: number, statusText?: string): string {
  if (status === 401) return "Sessão expirada ou não autorizada. Faça login novamente.";
  if (status === 403) return "Você não tem permissão para realizar esta ação.";
  if (status === 404) return "Recurso não encontrado.";
  if (status === 422) return "Não foi possível processar esta solicitação.";
  if (status >= 500) return "Erro interno no servidor.";
  const trimmedStatus = statusText?.trim();
  return trimmedStatus && trimmedStatus.length > 0 ? trimmedStatus : `Erro HTTP ${status}`;
}

function extractErrorDetails(
  text: string,
  status: number,
  statusText?: string
): { errorMessage: string; errorData: unknown } {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      errorMessage: defaultStatusMessage(status, statusText),
      errorData: undefined,
    };
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (typeof parsed === "object" && parsed !== null) {
      const record = parsed as Record<string, unknown>;
      const candidate =
        record.message ??
        record.reason ??
        record.error_description ??
        record.detail ??
        record.msg ??
        record.error;

      if (typeof candidate === "string" && candidate.trim().length > 0) {
        return { errorMessage: candidate.trim(), errorData: parsed };
      }

      const serialized = JSON.stringify(parsed);
      return {
        errorMessage:
          serialized && serialized !== "{}"
            ? serialized
            : defaultStatusMessage(status, statusText),
        errorData: parsed,
      };
    }

    if (typeof parsed === "string" && parsed.trim().length > 0) {
      return { errorMessage: parsed.trim(), errorData: parsed };
    }
  } catch {
    // Resposta em texto puro (ex: "Token inválido ou expirado" do JwtFilter)
    return { errorMessage: trimmed, errorData: undefined };
  }

  return {
    errorMessage: defaultStatusMessage(status, statusText),
    errorData: undefined,
  };
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
    let errorMessage = defaultStatusMessage(res.status, res.statusText);
    let errorData: unknown = undefined;

    try {
      const text = await res.text();
      const extracted = extractErrorDetails(text, res.status, res.statusText);
      errorMessage = extracted.errorMessage;
      errorData = extracted.errorData;
    } catch {
      // Mantém mensagem padrão do status
    }

    console.warn(`[API ERROR ${res.status}] ${init.method ?? "GET"} ${url}:`, {
      errorMessage,
      errorData,
    });

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
