import {
  getPendingDelays,
  getBookingHistory,
  type BookingHistoryItem,
  type PendingDelayItem,
} from "@/lib/services/bookings-service";
import { getMyStores } from "@/lib/services/stores-service";

export interface NotificationStore {
  name: string;
  avatarUrl?: string;
  initials: string;
  category: string;
}

export type NotificationType =
  | "appointment"
  | "payment"
  | "promotion"
  | "message"
  | "system"
  | "delay";

export interface AppNotification {
  id: string;
  store?: NotificationStore;
  title: string;
  message: string;
  time: string;
  date: string;
  isRead: boolean;
  type: NotificationType;
  actionUrl?: string;
}

const READ_STORAGE_KEY = "agilis_read_notifications";

function getReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.map(String)) : new Set();
  } catch {
    return new Set();
  }
}

export function markNotificationIdAsRead(id: string): void {
  if (typeof window === "undefined") return;
  const set = getReadIds();
  set.add(id);
  try {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...set]));
  } catch {}
}

export function markNotificationIdsAsRead(ids: string[]): void {
  if (typeof window === "undefined") return;
  const set = getReadIds();
  for (const id of ids) set.add(id);
  try {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...set]));
  } catch {}
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AG";
  if (parts.length === 1) return (parts[0] ?? "AG").slice(0, 2).toUpperCase();
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
}

function formatDateLabel(isoOrDateStr: string): string {
  if (!isoOrDateStr) return "Recentes";
  const parsed = new Date(isoOrDateStr);
  if (isNaN(parsed.getTime())) return isoOrDateStr;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  const targetStr = parsed.toISOString().slice(0, 10);

  if (targetStr === todayStr) return "Hoje";
  if (targetStr === yesterdayStr) return "Ontem";

  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
}

function formatTimeLabel(isoStr: string): string {
  if (!isoStr) return "";
  const parsed = new Date(isoStr);
  if (isNaN(parsed.getTime())) return "";
  return parsed.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapDelayToNotification(
  delay: PendingDelayItem,
  readIds: Set<string>
): AppNotification {
  const id = `delay-${delay.delayId}`;
  const newTime = formatTimeLabel(delay.newScheduledAt);
  const reasonText = delay.reason ? ` Motivo: ${delay.reason}.` : "";

  return {
    id,
    title: "Aviso de Atraso no Atendimento",
    message: `O prestador informou um atraso de ${delay.delayMinutes} min.${newTime ? ` Novo horário sugerido: ${newTime}.` : ""}${reasonText} Clique para responder.`,
    time: formatTimeLabel(delay.originalScheduledAt) || "Agora",
    date: formatDateLabel(delay.originalScheduledAt) || "Hoje",
    isRead: readIds.has(id),
    type: "delay",
    actionUrl: `/delay-resolution?id=${encodeURIComponent(delay.bookingId)}`,
  };
}

function getBookingStatusCopy(
  status: string,
  item: BookingHistoryItem,
  isProvider: boolean
): { title: string; message: string } {
  const normalized = status.toUpperCase();
  const party = item.otherPartyName || (isProvider ? "Cliente" : "Prestador");
  const when = `${item.date} às ${item.time}`;

  if (normalized === "CANCELADO" || normalized === "CANCELLED") {
    return {
      title: isProvider ? "Agendamento cancelado pelo cliente" : "Agendamento cancelado",
      message: `${item.serviceTitle} com ${party} (${when}) foi cancelado.`,
    };
  }
  if (normalized === "CONCLUIDO" || normalized === "COMPLETED") {
    return {
      title: "Serviço concluído",
      message: `${item.serviceTitle} com ${party} foi finalizado em ${item.date}.`,
    };
  }
  if (normalized === "EM_ANDAMENTO" || normalized === "IN_PROGRESS") {
    return {
      title: "Atendimento em andamento",
      message: `${item.serviceTitle} com ${party} está em execução.`,
    };
  }
  return {
    title: isProvider ? "Novo agendamento na loja" : "Agendamento confirmado",
    message: `${item.serviceTitle} com ${party} agendado para ${when}.`,
  };
}

function mapBookingToNotification(
  item: BookingHistoryItem,
  isProvider: boolean,
  readIds: Set<string>
): AppNotification {
  const id = `booking-${isProvider ? "prov" : "cli"}-${item.bookingId}-${item.status}`;
  const copy = getBookingStatusCopy(String(item.status), item, isProvider);
  const storeName = item.otherPartyName || "Agilis";

  return {
    id,
    store: {
      name: storeName,
      initials: getInitials(storeName),
      category: item.category || "Serviço",
    },
    title: copy.title,
    message: copy.message,
    time: item.time || "",
    date: formatDateLabel(item.date),
    isRead: readIds.has(id),
    type: "appointment",
    actionUrl: isProvider ? "/store/store-scheduling" : "/history",
  };
}

/**
 * Busca notificações reais do usuário a partir dos endpoints do backend:
 * - GET /api/v1/bookings/delays/pending (avisos de atraso pendentes)
 * - GET /api/v1/bookings/history?role=CLIENT&status=TODOS (agendamentos do cliente)
 * - GET /api/v1/bookings/history?role=PROVIDER&status=TODOS (agendamentos da loja, se possuir loja)
 */
export async function fetchUserNotifications(): Promise<AppNotification[]> {
  const readIds = getReadIds();

  const [delaysResult, clientHistoryResult, storesResult] =
    await Promise.allSettled([
      getPendingDelays(),
      getBookingHistory({ role: "CLIENT", statusFilter: "TODOS" }),
      getMyStores(),
    ]);

  const notifications: AppNotification[] = [];

  if (delaysResult.status === "fulfilled" && Array.isArray(delaysResult.value)) {
    for (const delay of delaysResult.value) {
      notifications.push(mapDelayToNotification(delay, readIds));
    }
  }

  if (
    clientHistoryResult.status === "fulfilled" &&
    Array.isArray(clientHistoryResult.value?.items)
  ) {
    for (const item of clientHistoryResult.value.items.slice(0, 10)) {
      notifications.push(mapBookingToNotification(item, false, readIds));
    }
  }

  if (
    storesResult.status === "fulfilled" &&
    Array.isArray(storesResult.value) &&
    storesResult.value.length > 0
  ) {
    try {
      const providerHistory = await getBookingHistory({
        role: "PROVIDER",
        statusFilter: "TODOS",
      });
      if (Array.isArray(providerHistory?.items)) {
        for (const item of providerHistory.items.slice(0, 10)) {
          notifications.push(mapBookingToNotification(item, true, readIds));
        }
      }
    } catch {
      // Usuário pode não ter permissão de agenda em alguma loja
    }
  }

  return notifications;
}
