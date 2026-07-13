import { AppointmentConfirmationCard } from "./_components/appointment-confirmation-card";
import { PageTransition } from "@/components/ui/motion";

export default function ConfirmAppointmentPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col gap-8 overflow-y-auto bg-muted p-6">
        <PageTransition className="flex flex-col gap-8">
          <AppointmentConfirmationCard appointmentId={params.id} />
        </PageTransition>
      </main>
    </div>
  );
}