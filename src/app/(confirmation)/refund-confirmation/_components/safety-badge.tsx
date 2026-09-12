import { ShieldCheck } from "lucide-react";

export function SafetyBadge() {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-primary/5 p-3 text-xs text-muted-foreground">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p>
        Garantia Agilis: O reembolso é processado automaticamente pelo sistema
        de pagamento.
      </p>
    </div>
  );
}
