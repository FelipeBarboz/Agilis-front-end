import { AlertTriangle } from "lucide-react";

export function CancellationWarning() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <p>
        Ao cancelar este serviço, o prestador será notificado e o valor integral
        pago será estornado na sua conta de pagamento.
      </p>
    </div>
  );
}
