export type HistoryStatus = "concluido" | "cancelado" | "em_andamento";

export interface HistoryEntry {
  id: string;
  serviceName: string;
  imageUrl: string;
  counterpartName: string;
  counterpartRole: "cliente" | "prestador";
  date: string; // ISO date
  price: number;
  status: HistoryStatus;
}

export const STATUS_LABEL: Record<HistoryStatus, string> = {
  concluido: "Concluído",
  cancelado: "Cancelado",
  em_andamento: "Em andamento",
};

export const STATUS_BADGE_CLASS: Record<HistoryStatus, string> = {
  concluido: "bg-emerald-100 text-emerald-700",
  cancelado: "bg-red-100 text-red-700",
  em_andamento: "bg-amber-100 text-amber-700",
};
