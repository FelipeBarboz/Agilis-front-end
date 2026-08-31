"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase } from "lucide-react";
import { PositionsList } from "./_components/positions-list";

export default function StorePositionsPage() {
  const router = useRouter();

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">

      {/* Botão de voltar flutuante — padrão das outras telas */}
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col space-y-6 px-4 pt-14 pb-8 sm:px-6 sm:py-8 lg:px-8">

        {/* Header da página */}
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Cargos &amp; Estrutura</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Defina os cargos e hierarquias da sua equipe
          </p>
        </div>

        {/* Card principal */}
        <div className="flex flex-col rounded-3xl border border-border bg-card shadow-sm overflow-hidden">

          {/* Ícone + título da seção */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-4 sm:px-8 sm:pt-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Briefcase className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Cargos</h2>
              <p className="text-xs text-muted-foreground">
                Crie e edite os cargos disponíveis na loja
              </p>
            </div>
          </div>

          <div className="border-t border-border px-5 pb-5 pt-4 sm:px-8 sm:pb-8">
            <PositionsList />
          </div>

        </div>

      </main>
    </div>
  );
}
