import { api } from "@/lib/api";

export type NegotiationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COUNTERED";

export type NegotiationAction = "ACCEPT" | "REJECT" | "COUNTER";

export interface NegotiationDTO {
  id?: string;
  negotiationId?: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  amount: number;
  status: NegotiationStatus | (string & {});
  createdAt?: string;
}

export interface CreateNegotiationPayload {
  bookingId: string;
  senderId: string;
  receiverId: string;
  amount: number;
}

export interface RespondNegotiationPayload {
  action: NegotiationAction;
  counterAmount?: number;
}

export function getNegotiationId(n: NegotiationDTO): string {
  return n.negotiationId ?? n.id ?? "";
}

/**
 * Busca todas as negociações vinculadas a um agendamento:
 * GET /api/v1/negotiations/booking/{bookingId}
 */
export async function getNegotiationsByBooking(
  bookingId: string
): Promise<NegotiationDTO[]> {
  const data = await api<NegotiationDTO[]>(
    `/api/v1/negotiations/booking/${encodeURIComponent(bookingId)}`
  );
  return Array.isArray(data) ? data : [];
}

/**
 * Cria uma nova proposta de valor para o agendamento:
 * POST /api/v1/negotiations
 */
export async function createNegotiation(
  payload: CreateNegotiationPayload
): Promise<NegotiationDTO> {
  return await api<NegotiationDTO>("/api/v1/negotiations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Responde a uma proposta existente (ACCEPT, REJECT ou COUNTER):
 * PATCH /api/v1/negotiations/{id}/respond
 */
export async function respondToNegotiation(
  negotiationId: string,
  payload: RespondNegotiationPayload
): Promise<NegotiationDTO> {
  const body: Record<string, unknown> = {
    action: payload.action,
  };
  if (payload.action === "COUNTER" && payload.counterAmount !== undefined) {
    body.counterAmount = payload.counterAmount;
  }

  return await api<NegotiationDTO>(
    `/api/v1/negotiations/${encodeURIComponent(negotiationId)}/respond`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  );
}
