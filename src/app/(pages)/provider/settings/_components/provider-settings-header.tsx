import { ArrowLeft } from "lucide-react";

interface ProviderSettingsHeaderProps {
  onBack: () => void;
}

export function ProviderSettingsHeader({ onBack }: ProviderSettingsHeaderProps) {
  return (
    <>
      {/* Botão de voltar flutuante */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Configurações da Conta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Gerencie tema, senha de acesso, preferências de notificações e sua conta profissional
        </p>
      </div>
    </>
  );
}
