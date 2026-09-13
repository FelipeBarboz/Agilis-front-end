import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function CreateStoreHeader() {
  return (
    <>
      {/* Seta de voltar flutuante — padrão Agilis */}
      <Link
        href="/profile"
        aria-label="Voltar para perfil"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Criar Loja
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Preencha as etapas abaixo para configurar seu perfil público no Agilis
        </p>
      </div>
    </>
  );
}
