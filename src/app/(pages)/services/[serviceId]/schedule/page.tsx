import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ServiceScheduleForm } from "./_components/service-schedule-form";
import { PageTransition } from "@/components/ui/motion";

export default async function ServiceSchedulePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-muted p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/services/${serviceId}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-muted"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Agendar Serviço</h1>
            <p className="text-xs text-muted-foreground">
              Preencha as informações para agendar seu atendimento
            </p>
          </div>
        </div>

        <PageTransition>
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Carregando agendamento...</p>
              </div>
            }
          >
            <ServiceScheduleForm serviceId={serviceId} />
          </Suspense>
        </PageTransition>
      </div>
    </main>
  );
}
