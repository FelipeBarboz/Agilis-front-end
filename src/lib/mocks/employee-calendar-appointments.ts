import { offsetDate, today } from "@/app/(pages)/store/store-scheduling/_components/date-helper";

export type CalendarAppointmentStatus = "confirmed" | "pending" | "cancelled" | "done";

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

// TODO: Integrar com a API de atendimentos atribuídos ao funcionário quando o backend estiver pronto.
export function getMockEmployeeAppointments(): EmployeeCalendarAppointment[] {
  return [
    {
      id: "appt-p-1",
      serviceName: "Limpeza completa",
      clientName: "Patrícia Gomes",
      date: offsetDate(-5),
      startTime: "10:00",
      endTime: "12:00",
      duration: 120,
      status: "done",
      address: "Rua Cravo, 45 – Guarulhos",
    },
    {
      id: "appt-p-2",
      serviceName: "Manutenção preventiva",
      clientName: "Sérgio Matos",
      date: offsetDate(-3),
      startTime: "15:00",
      endTime: "16:00",
      duration: 60,
      status: "done",
      address: "Av. Tiradentes, 900 – Guarulhos",
    },
    {
      id: "appt-t-1",
      serviceName: "Limpeza de piscina",
      clientName: "Lucas Mendes",
      date: today,
      startTime: "09:00",
      endTime: "11:00",
      duration: 120,
      status: "confirmed",
      address: "Rua das Flores, 123 – Guarulhos",
    },
    {
      id: "appt-t-2",
      serviceName: "Tratamento de água",
      clientName: "Ana Paula Costa",
      date: today,
      startTime: "14:00",
      endTime: "15:00",
      duration: 60,
      status: "pending",
      address: "Av. Brasil, 456 – Guarulhos",
    },
    {
      id: "appt-t-3",
      serviceName: "Reparação de encanamento",
      clientName: "Roberto Silva",
      date: today,
      startTime: "16:30",
      endTime: "18:00",
      duration: 90,
      status: "cancelled",
      address: "Rua Ipê, 789 – Guarulhos",
    },
    {
      id: "appt-f-1",
      serviceName: "Instalação de bomba",
      clientName: "Carla Fernandes",
      date: offsetDate(1),
      startTime: "10:00",
      endTime: "11:00",
      duration: 60,
      status: "confirmed",
      address: "Rua Palmeiras, 22 – Guarulhos",
    },
    {
      id: "appt-f-2",
      serviceName: "Manutenção de aquecedor",
      clientName: "Marcos Oliveira",
      date: offsetDate(2),
      startTime: "08:30",
      endTime: "10:30",
      duration: 120,
      status: "pending",
      address: "Rua das Acácias, 55 – Guarulhos",
    },
    {
      id: "appt-f-3",
      serviceName: "Limpeza completa",
      clientName: "Patrícia Gomes",
      date: offsetDate(5),
      startTime: "15:00",
      endTime: "17:00",
      duration: 120,
      status: "confirmed",
      address: "Rua Cravo, 45 – Guarulhos",
    },
  ];
}
