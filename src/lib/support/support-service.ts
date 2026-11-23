import { api, ApiError } from "@/lib/api";
import { faqs as defaultFaqs, type FaqItemData } from "@/app/(pages)/support/_components/faq-section/faq-data";
import type { SupportMessageDTO, SupportMessageResponse } from "@/lib/validations/support";

export async function fetchFaqs(): Promise<FaqItemData[]> {
  try {
    const data = await api<Array<{ question?: string; answer?: string; id?: string }>>(
      "/api/v1/support/faq"
    );

    if (Array.isArray(data) && data.length > 0) {
      return data.map((item, index) => ({
        id: item.id ?? String(index + 1),
        question: item.question ?? "",
        answer: item.answer ?? "",
      }));
    }

    return defaultFaqs;
  } catch (err) {
    console.warn("[Support] Não foi possível carregar FAQs da API, usando padrão:", err);
    return defaultFaqs;
  }
}

export async function fetchSupportMessages(): Promise<unknown[]> {
  try {
    const data = await api<unknown[]>("/api/v1/support/messages");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("[Support] Erro ao buscar mensagens de suporte:", err);
    return [];
  }
}

export async function sendSupportMessage(
  payload: SupportMessageDTO
): Promise<SupportMessageResponse> {
  const cleanPayload: Record<string, unknown> = {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    subject: payload.subject,
    message: payload.message.trim(),
  };

  // Enviar userId apenas se for um UUID válido e não-vazio
  if (payload.userId && payload.userId.trim().length > 0) {
    cleanPayload.userId = payload.userId.trim();
  }

  try {
    return await api<SupportMessageResponse>("/api/v1/support/messages", {
      method: "POST",
      body: JSON.stringify(cleanPayload),
    });
  } catch (err) {
    // Se o backend falhar com 500 e tivermos enviado userId (ex: usuário do Supabase ainda não sincronizado na tabela users), tenta novamente sem userId
    if (err instanceof ApiError && err.status === 500 && cleanPayload.userId) {
      const fallbackPayload = { ...cleanPayload };
      delete fallbackPayload.userId;

      try {
        return await api<SupportMessageResponse>("/api/v1/support/messages", {
          method: "POST",
          body: JSON.stringify(fallbackPayload),
        });
      } catch (retryErr) {
        throw retryErr;
      }
    }

    throw err;
  }
}
