"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SettingsForm } from "./_components/settings-form";

export default function StoreSettingsPage() {
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
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Configurações da Loja</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Atualize as informações públicas, logotipo e canais de contato da sua loja
          </p>
        </div>

        {/* Formulário com Cards Modulares Padronizados */}
        <SettingsForm />
      </main>
    </div>
  );
}

