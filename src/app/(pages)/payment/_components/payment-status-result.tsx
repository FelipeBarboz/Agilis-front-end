"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  getPaymentStatus,
  type PaymentStatus,
} from "@/lib/services/payments-service";
import { PaymentReceipt } from "./payment-receipt";

interface PaymentStatusResultProps {
  initialPayment: PaymentStatus;
  bookingId: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  address: string;
  onRetry: () => void;
}

export function PaymentStatusResult({
  initialPayment,
  bookingId,
  serviceName,
  providerName,
  date,
  time,
  address,
  onRetry,
}: PaymentStatusResultProps) {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentStatus>(initialPayment);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCurrentStatus = useCallback(async () => {
    if (!bookingId) return;
    setIsRefreshing(true);
    try {
      const data = await getPaymentStatus(bookingId);
      setPayment(data);
    } catch (err) {
      console.warn("[PaymentStatusResult] Erro ao consultar status do pagamento:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [bookingId]);

  // Polling a cada 5s por até 2 minutos para pagamentos PENDING ou IN_PROCESS
  useEffect(() => {
    if (!bookingId || payment.status === "APPROVED") return;
    if (payment.status !== "PENDING" && payment.status !== "IN_PROCESS") return;

    const interval = setInterval(async () => {
      try {
        const data = await getPaymentStatus(bookingId);
        setPayment(data);
        if (
          data.status === "APPROVED" ||
          data.status === "REJECTED" ||
          data.status === "CANCELLED"
        ) {
          clearInterval(interval);
        }
      } catch (err) {
        console.warn("[PaymentStatusResult] Falha no polling de status:", err);
      }
    }, 5000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 120_000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [bookingId, payment.status]);

  const { status, amount, paymentMethod, paidAt } = payment;

  // 1. Aprovado
  if (status === "APPROVED") {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        <button
          type="button"
          onClick={() => router.push("/home")}
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
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-xs mb-4">
            <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Pagamento Aprovado com Sucesso!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Seu agendamento foi confirmado pelo Mercado Pago e já está registrado na plataforma.
          </p>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600 mt-4">
            <Sparkles className="h-3.5 w-3.5" />
            Pagamento Confirmado · Prestador Notificado
          </div>

          <PaymentReceipt
            bookingId={bookingId}
            serviceName={serviceName}
            providerName={providerName}
            date={date}
            time={time}
            address={address}
            paymentMethodLabel={paymentMethod ?? "Mercado Pago"}
            total={amount > 0 ? amount : 0}
          />

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              onClick={() => router.push("/history")}
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

  // 2. Pendente ou Em Análise (Pix / Boleto)
  if (status === "PENDING" || status === "IN_PROCESS") {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="Ir para o início"
          className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full rounded-3xl border border-border bg-card p-6 sm:p-8 text-center shadow-md relative overflow-hidden space-y-5"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-xs">
            <Clock className="h-10 w-10 stroke-[2.5] animate-pulse" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Aguardando Confirmação
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Seu pagamento via {paymentMethod ?? "Pix ou Boleto"} está sendo processado. Assim que o Mercado Pago confirmar o pagamento, seu agendamento será atualizado automaticamente.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-4 text-xs text-left space-y-2">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Código da Reserva:</span>
              <span className="font-mono font-semibold text-foreground">{bookingId}</span>
            </div>
            {amount > 0 && (
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Valor:</span>
                <span className="font-semibold text-foreground">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(amount)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Status:</span>
              <span className="font-semibold text-amber-600">Em processamento</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            <span>Atualizando status em tempo real...</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isRefreshing}
              onClick={fetchCurrentStatus}
              className="flex-1 rounded-xl h-11 font-semibold gap-2 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Verificar Novamente
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/history")}
              className="flex-1 rounded-xl h-11 font-bold gap-2 cursor-pointer"
            >
              Ver Meus Agendamentos
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. Recusado ou Cancelado
  if (status === "REJECTED" || status === "CANCELLED") {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="Ir para o início"
          className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full rounded-3xl border border-border bg-card p-6 sm:p-8 text-center shadow-md relative overflow-hidden space-y-5"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20 shadow-xs">
            <XCircle className="h-10 w-10 stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {status === "REJECTED" ? "Pagamento Recusado" : "Pagamento Cancelado"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Não foi possível concluir o pagamento junto ao Mercado Pago. Você pode tentar novamente escolhendo outro meio de pagamento ou refazer a tentativa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={onRetry}
              className="flex-1 rounded-xl h-11 font-bold gap-2 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar Novamente
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/history")}
              className="flex-1 rounded-xl h-11 font-semibold gap-2 cursor-pointer"
            >
              Meus Agendamentos
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 4. Reembolsado / Disputa / Outros
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
      <button
        type="button"
        onClick={() => router.push("/home")}
        aria-label="Ir para o início"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full rounded-3xl border border-border bg-card p-6 sm:p-8 text-center shadow-md relative overflow-hidden space-y-5"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border shadow-xs">
          <HelpCircle className="h-10 w-10 stroke-[2.5]" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {status === "REFUNDED"
              ? "Pagamento Reembolsado"
              : status === "IN_MEDIATION"
                ? "Pagamento em Mediação"
                : "Status do Pagamento"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Este pagamento está com status: <strong className="text-foreground">{status}</strong>. Em caso de dúvidas, entre em contato com nosso suporte.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            onClick={() => router.push("/support")}
            className="flex-1 rounded-xl h-11 font-bold gap-2 cursor-pointer"
          >
            Falar com Suporte
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/history")}
            className="flex-1 rounded-xl h-11 font-semibold gap-2 cursor-pointer"
          >
            Meus Agendamentos
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
