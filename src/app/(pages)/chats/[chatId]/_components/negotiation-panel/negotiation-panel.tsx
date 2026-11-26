"use client";

import { useState } from "react";
import { Handshake, Check, X, ArrowLeftRight, Loader2, AlertCircle } from "lucide-react";
import {
  getNegotiationId,
  type NegotiationDTO,
  type NegotiationAction,
} from "@/lib/services/negotiations-service";

interface NegotiationPanelProps {
  negotiations: NegotiationDTO[];
  currentUserId: string;
  isFinished: boolean;
  onCreateProposal: (amount: number) => Promise<void>;
  onRespondProposal: (
    negotiationId: string,
    action: NegotiationAction,
    counterAmount?: number
  ) => Promise<void>;
}

function formatBRL(value: number): string {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parseAmountInput(raw: string): number {
  const cleaned = raw.replace(/[^\d.,]/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Aguardando resposta",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
  ACCEPTED: {
    label: "Proposta aceita",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  REJECTED: {
    label: "Proposta recusada",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  COUNTERED: {
    label: "Contraproposta enviada",
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
};

export function NegotiationPanel({
  negotiations,
  currentUserId,
  isFinished,
  onCreateProposal,
  onRespondProposal,
}: NegotiationPanelProps) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [counterInput, setCounterInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Negociação mais recente
  const latest =
    negotiations.length > 0 ? negotiations[negotiations.length - 1] : null;
  const latestStatus = latest ? String(latest.status).toUpperCase() : "";
  const latestId = latest ? getNegotiationId(latest) : "";
  const canRespondLatest =
    Boolean(latest) &&
    !isFinished &&
    (latestStatus === "PENDING" || latestStatus === "COUNTERED") &&
    latest?.receiverId === currentUserId;

  const hasAccepted = negotiations.some(
    (n) => String(n.status).toUpperCase() === "ACCEPTED"
  );

  async function handleSubmitNew(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseAmountInput(amountInput);
    if (amount <= 0) {
      setError("Informe um valor válido maior que zero.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onCreateProposal(amount);
      setAmountInput("");
      setShowNewForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível enviar a proposta."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAction(action: NegotiationAction, counterVal?: number) {
    if (!latestId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onRespondProposal(latestId, action, counterVal);
      setShowCounterForm(false);
      setCounterInput("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível responder à negociação."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Handshake className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Negociação de Valor
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Propostas e contrapropostas para este agendamento
            </p>
          </div>
        </div>

        {!isFinished && !hasAccepted && !showNewForm && (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setShowNewForm((v) => !v);
            }}
            className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
          >
            Propor novo valor
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Formulário para nova proposta */}
      {showNewForm && (
        <form
          onSubmit={(e) => void handleSubmitNew(e)}
          className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-muted/40 p-3"
        >
          <input
            type="text"
            inputMode="decimal"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="Valor em R$ (ex: 120,00)"
            disabled={isSubmitting}
            className="flex-1 min-w-[160px] rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : "Enviar"}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setShowNewForm(false)}
            className="rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted cursor-pointer"
          >
            Cancelar
          </button>
        </form>
      )}

      {/* Última proposta */}
      {latest ? (
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-3.5 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[11px] text-muted-foreground">
                {latest.senderId === currentUserId
                  ? "Você propôs"
                  : "Proposta recebida"}
              </span>
              <span className="text-base font-extrabold text-foreground">
                {formatBRL(latest.amount)}
              </span>
            </div>

            {STATUS_LABEL[latestStatus] && (
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_LABEL[latestStatus].className}`}
              >
                {STATUS_LABEL[latestStatus].label}
              </span>
            )}
          </div>

          {canRespondLatest && (
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleAction("ACCEPT")}
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
              >
                <Check className="size-3.5" />
                Aceitar
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleAction("REJECT")}
                className="inline-flex items-center gap-1 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-50 cursor-pointer"
              >
                <X className="size-3.5" />
                Recusar
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowCounterForm((v) => !v)}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer"
              >
                <ArrowLeftRight className="size-3.5" />
                Contraproposta
              </button>
            </div>
          )}

          {canRespondLatest && showCounterForm && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <input
                type="text"
                inputMode="decimal"
                value={counterInput}
                onChange={(e) => setCounterInput(e.target.value)}
                placeholder="Novo valor (ex: 140,00)"
                disabled={isSubmitting}
                className="flex-1 min-w-[150px] rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  const val = parseAmountInput(counterInput);
                  if (val <= 0) {
                    setError("Informe um valor válido para a contraproposta.");
                    return;
                  }
                  void handleAction("COUNTER", val);
                }}
                className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
              >
                Enviar contraproposta
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Nenhuma proposta de negociação registrada neste agendamento.
        </p>
      )}
    </div>
  );
}
