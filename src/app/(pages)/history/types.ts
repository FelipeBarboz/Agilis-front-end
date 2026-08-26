export type HistoryStatus = "concluido" | "cancelado" | "em_andamento" | "agendado";

export interface HistoryEntry {
  id: string;
  serviceName: string;
  imageUrl: string;
  counterpartName: string;
  counterpartRole: "cliente" | "prestador";
  counterpartAvatarUrl?: string;
  date: string; // ISO date
  time?: string;
  duration?: string;
  price: number;
  bookingFee?: number;
  status: HistoryStatus;
  category?: string;
  address?: string;
  paymentMethod?: string;
  notes?: string;
  cancellationReason?: string;
}

export const STATUS_LABEL: Record<HistoryStatus, string> = {
  em_andamento: "Em andamento",
  agendado: "Agendado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const STATUS_BADGE_CLASS: Record<HistoryStatus, string> = {
  em_andamento: "bg-amber-100 text-amber-800 border-amber-200",
  agendado: "bg-blue-100 text-blue-700 border-blue-200",
  concluido: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelado: "bg-red-100 text-red-700 border-red-200",
};
