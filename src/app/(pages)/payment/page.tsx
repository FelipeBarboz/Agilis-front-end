import { Suspense } from "react";
import { AppointmentConfirmationCard } from "./_components/card/appointment-confirmation-card";
import { PageTransition } from "@/components/ui/motion";

export default async function ConfirmAppointmentPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col">
      <main className="relative flex flex-1 flex-col overflow-y-auto bg-muted p-4 pt-14 sm:p-6 sm:pt-14 lg:p-8 lg:pt-8">
        <PageTransition className="mx-auto w-full max-w-5xl">
          <Suspense
            fallback={
              <div className="flex w-full items-center justify-center rounded-2xl bg-card border border-border p-12 shadow-xs">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground font-medium">Carregando pagamento...</p>
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
