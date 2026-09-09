export interface Appointment {
  id: string;
  time: string;
  employee: string;
  service: string;
  client: string;
}

// Map dates to appointments (YYYY-MM-DD)
// Using dynamically generated dates based on today for testing
const today = new Date();
const y = today.getFullYear();
const m = String(today.getMonth() + 1).padStart(2, "0");
const d = String(today.getDate()).padStart(2, "0");
export const todayStr = `${y}-${m}-${d}`;

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tm_y = tomorrow.getFullYear();
const tm_m = String(tomorrow.getMonth() + 1).padStart(2, "0");
const tm_d = String(tomorrow.getDate()).padStart(2, "0");
export const tomorrowStr = `${tm_y}-${tm_m}-${tm_d}`;

export const mockAppointments: Record<string, Appointment[]> = {
  [todayStr]: [
    { id: "1", time: "14:00", employee: "Rafael", service: "Reparação de encanamento", client: "João Carlos" },
    { id: "2", time: "15:30", employee: "Ana", service: "Manutenção de Aquecedor", client: "Maria Silva" },
  ],
  [tomorrowStr]: [
    { id: "3", time: "09:00", employee: "Carlos", service: "Limpeza de filtro", client: "Eduardo" },
    { id: "4", time: "11:00", employee: "Rafael", service: "Instalação de Bomba", client: "Fernanda" },
    { id: "5", time: "14:00", employee: "Ana", service: "Vistoria Técnica", client: "Roberto" },
  ],
};
