"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/motion";

export default function SchedulePage() {
  const router = useRouter();

  return (
    <main className="relative flex flex-1 flex-col overflow-y-auto bg-muted p-4 pt-14 sm:p-6 sm:pt-14 lg:p-8 lg:pt-8">
      {/* Botão de voltar flutuante */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Agendamentos</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe e gerencie seus serviços agendados
            </p>
          </div>
          <Button asChild variant="primary" size="lg">
            <Link href="/services" className="flex items-center gap-2">
              <Plus size={16} />
              Novo Agendamento
            </Link>
          </Button>
        </div>

        <PageTransition className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-xs">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Calendar className="size-7" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Nenhum agendamento pendente no momento
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Você pode explorar nossa lista de prestadores e agendar um novo serviço quando desejar.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="primary">
                <Link href="/services">Explorar Serviços</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/history">Ver Histórico</Link>
              </Button>
            </div>
          </div>
        </PageTransition>
      </div>
    </main>
  );
}
