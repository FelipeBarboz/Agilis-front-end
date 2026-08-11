import { LocationBar } from "./_components/location-bar";
import { EmptyAppointments } from "./_components/empty-appointments";
import { AppointmentsList } from "./_components/appointments-list";
import { PageTransition } from "@/components/ui/motion";
import type { Appointment } from "./_components/types";
// import { api } from "@/trpc/react"; // TODO: trocar pelos dados reais

// TODO: substituir por await api.appointment.listByUser()
const mockAppointments: Appointment[] = [
  {
    id: "1",
    serviceName: "Limpeza de Piscina Residencial",
    scheduledFor: "30/04/26 · 16:00",
    providerName: "Carlão Piscinas",
    providerAvatarUrl: "",
    price: 363,
    imageUrl: "",
    status: "in-progress",
  },
  {
    id: "2",
    serviceName: "Corte Masculino Padrão - Adulto",
    scheduledFor: "05/05/26 · 14:30",
    providerName: "Barbearia gorilla",
    providerAvatarUrl: "",
    price: 45,
    imageUrl: "",
    status: "scheduled",
  },
];

export default function AppointmentPage() {
  const appointments = mockAppointments;

  return (
    <div className="flex min-h-screen flex-col">
      <LocationBar address="Guarulhos 07190-065" />

      <main className="flex flex-1 flex-col overflow-y-auto bg-muted">
        <PageTransition className="flex flex-1 flex-col">
          {appointments.length === 0 ? (
            <EmptyAppointments />
          ) : (
            <AppointmentsList appointments={appointments} />
          )}
        </PageTransition>
      </main>
    </div>
  );
}