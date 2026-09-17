"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface SuccessCardProps {
  protocol: string;
  serviceName: string;
  totalPrice: string;
  paymentMethod: string;
  onBackToHistory: () => void;
  isCompleted?: boolean;
}

export function SuccessCard({
  protocol,
  serviceName,
  totalPrice,
  paymentMethod,
  onBackToHistory,
  isCompleted = false,
}: SuccessCardProps) {
  const isPix = paymentMethod === "PIX";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg rounded-2xl border border-border bg-background p-8 text-center shadow-lg mx-auto"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <h2 className="text-2xl font-bold text-foreground">
        {isCompleted ? "Solicitação de Reembolso Enviada!" : "Cancelamento Confirmado!"}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {isCompleted
          ? "Sua solicitação de reembolso foi registrada e encaminhada para a equipe de mediação."
          : "Sua solicitação de reembolso foi registrada e confirmada com sucesso."}
      </p>

      <div className="my-6 space-y-2.5 rounded-xl border border-border bg-muted/40 p-4 text-left text-sm">
        <div className="flex justify-between border-b border-border pb-2">
          <span className="text-muted-foreground">Protocolo:</span>
          <span className="font-mono font-bold text-foreground">{protocol}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Serviço:</span>
          <span className="font-semibold text-foreground">{serviceName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Valor Solicitado:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalPrice}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Destino do Estorno:</span>
          <span className="font-semibold text-foreground">
            {isPix ? "PIX (chave de origem)" : "Cartão de Crédito (fatura)"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Prazo de Resolução:</span>
          <span className="font-semibold text-foreground">
            {isCompleted
              ? "Análise em até 24 a 48 horas"
              : isPix
                ? "Em até 2 horas"
                : "1 a 2 faturas"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onBackToHistory}
        className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
      >
        Voltar ao Histórico
      </button>
    </motion.div>
  );
}
