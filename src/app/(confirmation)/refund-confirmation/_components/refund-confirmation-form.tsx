"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { MOCK_HISTORY } from "../../../(pages)/history/_components/mock-history";

const CANCELLATION_REASONS = [
  "Imprevisto de agenda / horário",
  "O prestador não respondeu ou não pôde comparecer",
  "Contratei o serviço por engano",
  "Encontrei outra solução",
  "Outro motivo",
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function RefundConfirmationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const entry = MOCK_HISTORY.find((item) => item.id === id) ?? MOCK_HISTORY[0];

  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [comments, setComments] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookingFee = entry?.bookingFee ?? 10;
  const totalPrice = (entry?.price ?? 0) + bookingFee;
  const protocol = `AGL-${Math.floor(100000 + Math.random() * 900000)}`;

  function handleConfirmCancellation(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
    }, 700);
  }

  if (isConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full rounded-2xl border border-border bg-background p-6 sm:p-8 text-center shadow-lg"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h2 className="text-2xl font-bold text-foreground">Cancelamento Confirmado!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sua solicitação de reembolso foi registrada com sucesso.
        </p>

        <div className="my-6 rounded-xl border border-border bg-muted/40 p-4 text-left space-y-2.5 text-xs sm:text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Protocolo:</span>
            <span className="font-mono font-bold text-foreground">{protocol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Serviço:</span>
            <span className="font-semibold text-foreground">{entry?.serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Valor a Reembolsar:</span>
            <span className="font-bold text-emerald-600">{currencyFormatter.format(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Forma de Estorno:</span>
            <span className="font-semibold text-foreground">
              {entry?.paymentMethod === "PIX" ? "PIX (chave de origem)" : "Cartão de Crédito (fatura)"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Prazo Estimado:</span>
            <span className="font-semibold text-foreground">
              {entry?.paymentMethod === "PIX" ? "Em até 2 horas" : "1 a 2 faturas"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/history")}
          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Voltar ao Histórico
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleConfirmCancellation}
      className="w-full rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-lg space-y-6"
    >
      {/* Service Details Card */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-4">
        {entry?.imageUrl && entry.imageUrl.trim() !== "" ? (
          <img
            src={entry.imageUrl}
            alt={entry.serviceName}
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
            {entry?.serviceName?.charAt(0) || "S"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-foreground truncate">{entry?.serviceName}</h3>
          <p className="text-xs text-muted-foreground">
            {entry?.counterpartRole === "prestador" ? "Prestador: " : "Cliente: "}
            {entry?.counterpartName}
          </p>
          <p className="text-xs font-semibold text-foreground mt-1">
            Valor pago: {currencyFormatter.format(totalPrice)}
          </p>
        </div>
      </div>

      {/* Warning Alert */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900 text-xs">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          Ao cancelar este serviço, o prestador será notificado e o valor integral pago será estornado na sua conta de pagamento.
        </p>
      </div>

      {/* Select Reason */}
      <div className="space-y-2">
        <label htmlFor="cancel-reason" className="text-xs font-bold uppercase tracking-wider text-foreground">
          Qual o motivo do cancelamento?
        </label>
        <select
          id="cancel-reason"
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {CANCELLATION_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>

      {/* Optional details */}
      <div className="space-y-2">
        <label htmlFor="cancel-details" className="text-xs font-bold uppercase tracking-wider text-foreground">
          Observações adicionais (opcional)
        </label>
        <textarea
          id="cancel-details"
          rows={3}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Deixe mais detalhes para ajudar nossa equipe a melhorar..."
          className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Refund Summary Box */}
      <div className="rounded-xl border border-border bg-background p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Resumo do Reembolso
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Valor do serviço</span>
            <span className="font-medium text-foreground">
              {currencyFormatter.format(entry?.price ?? 0)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Taxa de agendamento</span>
            <span className="font-medium text-foreground">
              {currencyFormatter.format(bookingFee)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
            <span>Total a ser estornado</span>
            <span className="text-emerald-600">{currencyFormatter.format(totalPrice)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          {entry?.paymentMethod === "PIX" ? (
            <QrCode className="h-4 w-4 text-primary" />
          ) : (
            <CreditCard className="h-4 w-4 text-primary" />
          )}
          <span>
            Destino: <strong>{entry?.paymentMethod ?? "PIX"}</strong> (mesmo método de pagamento utilizado)
          </span>
        </div>
      </div>

      {/* Safety info */}
      <div className="flex items-start gap-2 rounded-xl bg-primary/5 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p>
          Garantia Agilis: O reembolso é processado automaticamente pelo sistema de pagamento.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-destructive/90 disabled:opacity-50"
        >
          {isSubmitting ? "Processando..." : "Confirmar Cancelamento e Reembolso"}
        </button>
        <Link
          href="/history"
          className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Manter Serviço
        </Link>
      </div>
    </form>
  );
}
