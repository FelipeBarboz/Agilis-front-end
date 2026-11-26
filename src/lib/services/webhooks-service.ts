import { api } from "@/lib/api";

export const WEBHOOK_EVENT_TYPES = [
  { value: "BOOKING_CREATED", label: "Agendamento criado" },
  { value: "BOOKING_CONFIRMED", label: "Agendamento confirmado" },
  { value: "BOOKING_CANCELLED", label: "Agendamento cancelado" },
  { value: "BOOKING_COMPLETED", label: "Agendamento concluído" },
  { value: "BOOKING_RESCHEDULED", label: "Agendamento reagendado" },
  { value: "DELAY_DECLARED", label: "Atraso declarado" },
  { value: "REFUND_REQUESTED", label: "Reembolso solicitado" },
  { value: "RESCHEDULE_PRIORITY_GRANTED", label: "Prioridade de reagendamento" },
  { value: "NEGOTIATION_CREATED", label: "Negociação criada" },
  { value: "NEGOTIATION_ACCEPTED", label: "Negociação aceita" },
  { value: "NEGOTIATION_REJECTED", label: "Negociação recusada" },
  { value: "NEGOTIATION_COUNTERED", label: "Contraproposta enviada" },
  { value: "MESSAGE_RECEIVED", label: "Mensagem recebida" },
  { value: "REVIEW_CREATED", label: "Avaliação criada" },
  { value: "STORE_MEMBER_INVITED", label: "Membro convidado" },
  { value: "STORE_MEMBER_REMOVED", label: "Membro removido" },
] as const;

export type WebhookEventType = (typeof WEBHOOK_EVENT_TYPES)[number]["value"];

export interface StoreWebhookDTO {
  webhookId: string;
  storeId: string;
  url: string;
  events: string[];
  active: boolean;
}

export interface CreateStoreWebhookResponse extends StoreWebhookDTO {
  secret: string;
}

export interface CreateStoreWebhookPayload {
  url: string;
  events: string[];
}

/**
 * Lista os webhooks configurados da loja:
 * GET /api/v1/stores/{storeId}/webhooks
 */
export async function getStoreWebhooks(
  storeId: string
): Promise<StoreWebhookDTO[]> {
  const data = await api<StoreWebhookDTO[]>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/webhooks`
  );
  return Array.isArray(data) ? data : [];
}

/**
 * Cria uma assinatura de webhook para a loja:
 * POST /api/v1/stores/{storeId}/webhooks
 */
export async function createStoreWebhook(
  storeId: string,
  payload: CreateStoreWebhookPayload
): Promise<CreateStoreWebhookResponse> {
  return await api<CreateStoreWebhookResponse>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/webhooks`,
    {
      method: "POST",
      body: JSON.stringify({
        url: payload.url.trim(),
        events: payload.events,
      }),
    }
  );
}

/**
 * Remove uma assinatura de webhook da loja:
 * DELETE /api/v1/stores/{storeId}/webhooks/{webhookId}
 */
export async function deleteStoreWebhook(
  storeId: string,
  webhookId: string
): Promise<void> {
  await api<void>(
    `/api/v1/stores/${encodeURIComponent(storeId)}/webhooks/${encodeURIComponent(webhookId)}`,
    {
      method: "DELETE",
    }
  );
}
