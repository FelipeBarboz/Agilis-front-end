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
  em_andamento: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  agendado: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  concluido: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  cancelado: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};
