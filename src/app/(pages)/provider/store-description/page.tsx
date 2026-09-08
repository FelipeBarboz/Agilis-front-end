import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StoreDescriptionForm } from "./_components/store-description-form";

export default function StoreDescriptionPage() {
  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted pb-20">
      {/* Seta de voltar flutuante — padrão Agilis */}
      <Link
        href="/provider/create-store"
        aria-label="Voltar para criar loja"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Descrição da loja
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Conte mais sobre sua empresa e seus diferenciais
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b border-border px-6 py-5 md:px-10">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              Etapa 4 de 5
            </span>
          </div>
          <div className="px-6 pb-8 pt-6 md:px-10 md:pb-10">
            <StoreDescriptionForm />
          </div>
        </div>
      </main>
    </div>
  );
}
