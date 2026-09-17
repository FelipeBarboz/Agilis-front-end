import { ArrowLeft, CreditCard } from "lucide-react";

interface PaymentHeaderProps {
  onBack: () => void;
}

export function PaymentHeader({ onBack }: PaymentHeaderProps) {
  return (
    <>
      {/* Seta de voltar no canto superior esquerdo — Padrão Agilis */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Cabeçalho da Página Padronizado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Pagamento e Confirmação
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Revise os dados do atendimento e conclua a contratação do serviço
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
