import { AppointmentConfirmationCard } from "../../(confirmation)/payment/_components/appointment-confirmation-card";
import { PageTransition } from "@/components/ui/motion";

export default async function ConfirmAppointmentPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col gap-8 overflow-y-auto bg-muted p-6">
        <PageTransition className="flex flex-col gap-8">
          <AppointmentConfirmationCard appointmentId={id || ""} />
        </PageTransition>
      </main>
    </div>
  );
}