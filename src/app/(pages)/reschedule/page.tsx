"use client";

import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RescheduleForm } from "./_components/reschedule-form";
import { PageTransition } from "@/components/ui/motion";

export default function ReschedulePage() {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-muted p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Top Back Nav */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/history"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-muted"
            aria-label="Voltar ao histórico"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Reagendar Serviço</h1>
            <p className="text-xs text-muted-foreground">
              Altere a data ou horário do seu atendimento
            </p>
          </div>
        </div>

        <PageTransition>
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Carregando...</p>
              </div>
            }
          >
            <RescheduleForm />
          </Suspense>
        </PageTransition>
      </div>
    </main>
  );
}
