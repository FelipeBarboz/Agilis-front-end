import type { StoreBookingOverviewItem } from "@/lib/services/bookings-service";
import type { StoreAppointment } from "@/app/(pages)/store/store-scheduling/_components/store-appointment-card";

export type CalendarAppointmentStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "done";

export interface EmployeeCalendarAppointment {
  id: string;
  serviceName: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  duration: number; // minutes
  status: CalendarAppointmentStatus;
  address: string;
}

/** Formata Date local como "YYYY-MM-DD" */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Extrai "HH:MM" de string ou objeto Time do backend */
export function formatBookingTime(
  time:
    | string
    | { hour: number; minute: number; second?: number; nano?: number }
    | null
    | undefined,
  fallback = "09:00"
): string {
  if (!time) return fallback;
  if (typeof time === "string") {
    return time.slice(0, 5);
  }
  if (typeof time === "object" && "hour" in time) {
    const h = String(time.hour ?? 0).padStart(2, "0");
    const m = String(time.minute ?? 0).padStart(2, "0");
    return `${h}:${m}`;
  }
  return fallback;
}

/** Converte status do backend para status visual */
export function mapBookingStatus(
  status: string
): CalendarAppointmentStatus {
  const upper = (status ?? "").toUpperCase();
  if (upper === "CONFIRMED") return "confirmed";
  if (upper === "COMPLETED" || upper === "DONE") return "done";
  if (upper === "CANCELLED" || upper === "CANCELED") return "cancelled";
  return "pending";
}

/** Converte item do overview da loja para StoreAppointment */
export function mapOverviewToStoreAppointment(
  item: StoreBookingOverviewItem
): StoreAppointment {
  const datePart = item.scheduledAt
    ? item.scheduledAt.slice(0, 10)
    : toDateKey(new Date());

  return {
    id: item.bookingId,
    serviceName: item.serviceTitle,
    clientName: item.clientName,
    employeeName: item.employeeName || "Equipe",
    date: datePart,
    time: formatBookingTime(item.startTime),
    duration: Number(item.durationMinutes) || 60,
    status: mapBookingStatus(item.status),
    address: item.address ?? "Endereço não informado",
  };
}

/** Converte item do overview da loja para EmployeeCalendarAppointment */
export function mapOverviewToCalendarAppointment(
  item: StoreBookingOverviewItem
): EmployeeCalendarAppointment {
  const datePart = item.scheduledAt
    ? item.scheduledAt.slice(0, 10)
    : toDateKey(new Date());

  return {
    id: item.bookingId,
    serviceName: item.serviceTitle,
    clientName: item.clientName,
    date: datePart,
    startTime: formatBookingTime(item.startTime, "09:00"),
    endTime: formatBookingTime(item.endTime, "10:00"),
    duration: Number(item.durationMinutes) || 60,
    status: mapBookingStatus(item.status),
    address: item.address ?? "Endereço não informado",
  };
}
