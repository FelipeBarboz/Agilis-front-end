import { ArrowLeft } from "lucide-react";

interface EditServiceHeaderProps {
  serviceName: string;
  onBack: () => void;
}

export function EditServiceHeader({
  serviceName,
  onBack,
}: EditServiceHeaderProps) {
  return (
    <>
      {/* Seta de voltar flutuante — padrão Agilis */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar para serviços"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Editar Serviço
          </h1>
          <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
            {serviceName}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Atualize as informações, valores e fotos do seu serviço
        </p>
      </div>
    </>
  );
}
