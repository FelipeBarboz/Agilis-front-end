import { ArrowLeft } from "lucide-react";

interface ProfileHeaderProps {
  onBack: () => void;
}

export function ProfileHeader({ onBack }: ProfileHeaderProps) {
  return (
    <>
      {/* Seta de voltar flutuante — padrão auth e serviço */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Meu Perfil de Usuário
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Gerencie suas informações pessoais, endereços e preferências da sua conta
        </p>
      </div>
    </>
  );
}