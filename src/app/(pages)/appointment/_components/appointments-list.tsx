import { AppointmentCard } from "./appointment-card";
import type { Appointment } from "./types";

export function AppointmentsList({ appointments }: { appointments: Appointment[] }) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {appointments.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}