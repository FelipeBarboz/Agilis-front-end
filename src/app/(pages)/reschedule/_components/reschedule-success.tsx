import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import type { HistoryEntry } from "@/types/history";

interface RescheduleSuccessProps {
  entry: HistoryEntry;
  selectedDate: Date;
  selectedTime: string;
  onBack: () => void;
}

export function RescheduleSuccess({
  entry,
  selectedDate,
  selectedTime,
  onBack,
}: RescheduleSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg rounded-2xl border border-border bg-background p-8 text-center shadow-lg mx-auto"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <h2 className="text-2xl font-bold text-foreground">Reagendamento Confirmado!</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Seu serviço foi remarcado com sucesso. O prestador foi notificado sobre a alteração.
      </p>

      <div className="my-6 rounded-xl border border-border bg-muted/40 p-4 text-left space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Serviço:</span>
          <span className="font-semibold text-foreground">{entry.serviceName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Nova Data:</span>
          <span className="font-semibold text-primary">
            {selectedDate.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Novo Horário:</span>
          <span className="font-semibold text-primary">{selectedTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Prestador:</span>
          <span className="font-semibold text-foreground">{entry.counterpartName}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
      >
        Voltar ao Histórico
      </button>
    </motion.div>
  );
}
