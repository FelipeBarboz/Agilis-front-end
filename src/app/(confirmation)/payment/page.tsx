import { Suspense } from "react";
import { AppointmentConfirmationCard } from "./_components/appointment-confirmation-card";
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
          <Suspense
            fallback={
              <div className="flex w-full items-center justify-center rounded-2xl bg-background p-12 shadow-lg">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Carregando pagamento...</p>
                </div>
              </div>
            }
          >
            <AppointmentConfirmationCard appointmentId={id ?? ""} />
          </Suspense>
        </PageTransition>
      </main>
    </div>
  );
}