export interface ProfileAppointment {
  id: number;
  client: string;
  time: string;
  service: string;
  date: string;
}

export const mockProfileAppointments: ProfileAppointment[] = [
  { id: 1, client: "Jonathan", time: "14:00", service: "Limpeza de Piscina", date: "13 de Agosto" },
  { id: 2, client: "Maria Silva", time: "15:30", service: "Manutenção de Filtro", date: "13 de Agosto" },
  { id: 3, client: "Carlos Eduardo", time: "17:00", service: "Troca de Areia", date: "13 de Agosto" },
];
