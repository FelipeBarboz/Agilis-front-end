"use client";

import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DelayResolutionContent } from "./_components/delay-resolution-content";
import { PageTransition } from "@/components/ui/motion";

export default function DelayResolutionPage() {
  return (
    <main className="relative flex flex-1 flex-col bg-muted p-4 pt-14 sm:p-6 sm:pt-14 lg:p-8 lg:pt-8">
      {/* Seta de voltar */}
      <Link
        href="/history"
        aria-label="Voltar ao histórico"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-background cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Top Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Resolução de Atraso
          </h1>
          <p className="text-sm text-muted-foreground">
            O prestador comunicou um atraso no atendimento. Escolha a melhor opção para você.
          </p>
        </div>

        <PageTransition>
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Carregando informações do agendamento...</p>
              </div>
            }
          >
            <DelayResolutionContent />
          </Suspense>
        </PageTransition>
      </div>
    </main>
  );
}
