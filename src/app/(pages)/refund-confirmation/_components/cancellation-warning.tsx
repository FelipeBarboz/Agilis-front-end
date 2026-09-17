import { AlertTriangle } from "lucide-react";

interface CancellationWarningProps {
  isCompleted?: boolean;
}

export function CancellationWarning({ isCompleted }: CancellationWarningProps) {
  if (isCompleted) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p>
          Como este serviço já foi marcado como concluído, sua solicitação de reembolso passará pela equipe de mediação da Agilis. Relate com detalhes os problemas ocorridos para agilizar a resolução.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p>
        Ao cancelar este serviço, o prestador será notificado e o valor integral
        pago será estornado na sua conta de pagamento.
      </p>
    </div>
  );
}
