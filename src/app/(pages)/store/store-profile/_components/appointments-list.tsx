import { Clock, User } from "lucide-react";
import { mockProfileAppointments } from "@/lib/mocks/profile-appointments";

export function AppointmentsList() {
  const appointments = mockProfileAppointments;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-foreground">Agendamentos de Hoje</h2>
      <div className="flex flex-col gap-3">
        {appointments.map((appt) => (
          <div key={appt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-white shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-foreground flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                {appt.client}
              </span>
              <span className="text-sm text-muted-foreground ml-6">{appt.service}</span>
            </div>
            
            <div className="flex items-center gap-4 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-border">
              <span className="text-sm font-semibold text-primary">{appt.date}</span>
              <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-sm font-medium">
                <Clock className="size-4" />
                {appt.time}
              </div>
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
            Nenhum agendamento para hoje.
          </div>
        )}
      </div>
    </div>
  );
}
