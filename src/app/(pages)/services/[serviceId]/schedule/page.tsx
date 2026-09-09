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
    <main className="relative flex flex-1 flex-col overflow-y-auto bg-muted p-4 pt-14 sm:p-6 sm:pt-14 lg:p-8 lg:pt-8">
      {/* Seta de voltar no canto superior esquerdo — Padrão Agilis */}
      <Link
        href={`/services/${serviceId}`}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Top Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agendar Serviço</h1>
          <p className="text-sm text-muted-foreground">
            Preencha as informações para agendar seu atendimento
          </p>
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

