import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BasicInformationsForm } from "./_components/basic-informations-form";

export default function BasicInformationsPage() {
  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      {/* Seta de voltar flutuante — padrão Agilis */}
      <Link
        href="/provider/create-store"
        aria-label="Voltar para criar loja"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-white cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Informações básicas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Nome da loja e URL personalizada no Agilis
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-3xl bg-primary shadow-xl">
          <div className="px-6 py-5 md:px-10 md:py-7">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/50">
              Etapa 1 de 5
            </p>
          </div>
          <div className="px-6 pb-8 md:px-10 md:pb-10">
            <BasicInformationsForm />
          </div>
        </div>
      </main>
    </div>
  );
}
