import { ArrowLeft } from "lucide-react";

interface AddServiceHeaderProps {
  onBack: () => void;
}

export function AddServiceHeader({ onBack }: AddServiceHeaderProps) {
  return (
    <>
      {/* Botão de voltar flutuante — padrão Agilis */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar para serviços"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Novo Serviço
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Cadastre um serviço que sua empresa oferece para seus clientes
        </p>
      </div>
    </>
  );
}
