import { api } from "@/lib/api";
import { getBookingHistory } from "@/lib/services/bookings-service";
import type { ChatConversation } from "@/app/(pages)/chats/_components/chat-list-item/chat-list-item";

// ==========================================
// Tipos de Mensagens (por Booking)
// ==========================================

export interface BookingMessageDTO {
  messageId: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
}

export interface SendMessagePayload {
  bookingId: string;
  senderId: string;
  receiverId: string;
  content: string;
}

// ==========================================
// API Functions
// ==========================================

/**
 * Lista todas as mensagens de um agendamento:
 * GET /api/v1/messages/booking/{bookingId}
 */
export async function getMessagesByBooking(
  bookingId: string
): Promise<BookingMessageDTO[]> {
  try {
    const data = await api<BookingMessageDTO[]>(
      `/api/v1/messages/booking/${encodeURIComponent(bookingId)}`
    );
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`[Messages] Falha ao buscar mensagens do booking ${bookingId}:`, err);
    return [];
  }
}

/**
 * Envia uma mensagem vinculada a um agendamento:
 * POST /api/v1/messages
 */
export async function sendBookingMessage(
  payload: SendMessagePayload
): Promise<BookingMessageDTO> {
  return await api<BookingMessageDTO>("/api/v1/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function formatMessageTime(isoDate?: string): string {
  if (!isoDate) return "";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate.slice(0, 5);
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/**
 * Carrega a lista de conversas reais baseadas nos agendamentos do usuário
 * (como CLIENT ou PROVIDER) e enriquece com a última mensagem de cada booking.
 */
export async function loadConversationsByRole(
  role: "CLIENT" | "PROVIDER"
): Promise<ChatConversation[]> {
  try {
    const history = await getBookingHistory({ role, statusFilter: "TODOS" });
    const items = (history.items ?? []).slice(0, 20);
    if (items.length === 0) return [];

    const messagesResults = await Promise.allSettled(
      items.map((item) => getMessagesByBooking(item.bookingId))
    );

    return items.map((item, idx) => {
      const msgRes = messagesResults[idx];
      const msgs =
        msgRes && msgRes.status === "fulfilled" ? msgRes.value : [];
      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      const upperStatus = (item.status ?? "").toUpperCase();
      const isFinished =
        upperStatus === "CONCLUIDO" ||
        upperStatus === "CANCELADO" ||
        upperStatus === "COMPLETED" ||
        upperStatus === "CANCELLED";

      return {
        id: item.bookingId,
        providerName: item.otherPartyName || "Contato",
        serviceName: item.serviceTitle || "Serviço agendado",
        lastMessage: lastMsg
          ? lastMsg.content
          : "Toque para enviar uma mensagem",
        lastMessageAt: lastMsg
          ? formatMessageTime(lastMsg.sentAt)
          : item.time || item.date || "",
        unreadCount: 0,
        isFinished,
        isRead: true,
      };
    });
  } catch (err) {
    console.warn(`[Messages] Falha ao carregar conversas (${role}):`, err);
    return [];
  }
}
