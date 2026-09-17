import { ArrowLeft, CheckCircle2, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { PaymentMethod } from "../../../../types/payment";
import { PaymentReceipt } from "./payment-receipt";

interface PaymentSuccessProps {
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  address: string;
  selectedPayment?: PaymentMethod;
  total: number;
  onNavigateHome: () => void;
  onNavigateHistory: () => void;
}

export function PaymentSuccess({
  serviceName,
  providerName,
  date,
  time,
  address,
  selectedPayment,
  total,
  onNavigateHome,
  onNavigateHistory,
}: PaymentSuccessProps) {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
      {/* Seta no canto superior esquerdo direcionando diretamente para a Home — Padrão Agilis */}
      <button
        type="button"
        onClick={onNavigateHome}
        aria-label="Ir para o início"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full rounded-3xl border border-border bg-card p-6 sm:p-8 text-center shadow-md relative overflow-hidden"
      >
        {/* Badge de Sucesso */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-xs mb-4">
          <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Pagamento Aceito com Sucesso!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          O serviço foi contratado e o agendamento já está confirmado e disponível no seu histórico.
        </p>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600 mt-4">
          <Sparkles className="h-3.5 w-3.5" />
          Pagamento Confirmado · Prestador Notificado
        </div>

        {/* Comprovante Padronizado com os Ícones do Agilis */}
        <PaymentReceipt
          serviceName={serviceName}
          providerName={providerName}
          date={date}
          time={time}
          address={address}
          paymentMethodLabel={selectedPayment?.label ?? "Pix"}
          total={total}
        />


        {/* Ação: Apenas Ver no Histórico */}
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={onNavigateHistory}
            className="w-full rounded-xl h-11 font-bold gap-2 cursor-pointer"
            size="lg"
          >
            <Clock className="h-4 w-4" />
            Ver no Histórico
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
