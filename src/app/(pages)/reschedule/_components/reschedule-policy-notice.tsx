import { ShieldCheck } from "lucide-react";

export function ReschedulePolicyNotice() {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-primary/5 p-3.5 border border-primary/10 text-xs text-muted-foreground">
      <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <p>
        Reagendamento gratuito. O prestador receberá uma notificação com a nova solicitação de horário.
      </p>
    </div>
  );
}
