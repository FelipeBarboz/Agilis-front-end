"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { MOCK_HISTORY } from "../../../../lib/mocks/history";
import { ServiceCard } from "./service-card";
import { CancellationWarning } from "./cancellation-warning";
import {
  CancellationReasonSelect,
  CANCELLATION_REASONS,
  COMPLETED_REFUND_REASONS,
} from "./cancellation-reason-select";
import { CommentsTextarea } from "./comments-textarea";
import { RefundSummary } from "./refund-summary";
import { ActionButtons } from "./action-buttons";
import { SuccessCard } from "./success-card";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function RefundConfirmationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Busca por id ou pega o primeiro serviço agendado (cancelável)
  const entry =
    MOCK_HISTORY.find((item) => item.id === id) ??
    MOCK_HISTORY.find((item) => item.status === "agendado") ??
    MOCK_HISTORY[1];

  const isCompleted = entry?.status === "concluido";

  const [selectedReason, setSelectedReason] = useState<string>(
    () => (isCompleted ? COMPLETED_REFUND_REASONS[0] : CANCELLATION_REASONS[0]) ?? ""
  );
  const [comments, setComments] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookingFee = entry?.bookingFee ?? 10;
  const totalPrice = (entry?.price ?? 0) + bookingFee;
  const [protocol] = useState(
    () => `AGL-${Math.floor(100000 + Math.random() * 900000)}`
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (entry?.status === "em_andamento") return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  }

  // Estado de sucesso
  if (isSuccess && entry) {
    return (
      <SuccessCard
        protocol={protocol}
        serviceName={entry.serviceName}
        totalPrice={currencyFormatter.format(totalPrice)}
        paymentMethod={entry.paymentMethod ?? "PIX"}
        onBackToHistory={() => router.push("/history")}
        isCompleted={isCompleted}
      />
    );
  }

  // Bloqueio para serviços em andamento
  if (entry?.status === "em_andamento") {
    return (
      <div className="w-full max-w-2xl space-y-6">
        <ServiceCard
          entry={entry}
          formattedTotal={currencyFormatter.format(totalPrice)}
        />

        <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-xs space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Serviço em Andamento
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Serviços em andamento não podem ser cancelados pela plataforma pois o atendimento já foi iniciado. Se tiver dúvidas ou imprevistos, entre em contato diretamente com o prestador ou contate o suporte.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/chats"
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 text-center cursor-pointer"
            >
              Conversar com Prestador
            </Link>
            <Link
              href="/support"
              className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              Suporte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Redirecionamento / aviso para serviços já cancelados
  if (entry?.status === "cancelado") {
    return (
      <div className="w-full max-w-2xl space-y-6">
        <ServiceCard
          entry={entry}
          formattedTotal={currencyFormatter.format(totalPrice)}
        />

        <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-xs space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <AlertCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Serviço Já Cancelado
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Este serviço já foi cancelado e a solicitação de reembolso já foi realizada. Você pode acompanhar o andamento do estorno na página de cancelamento.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/cancelled?id=${entry.id}`}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 text-center cursor-pointer"
            >
              Acompanhar Reembolso
            </Link>
            <Link
              href="/history"
              className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              Voltar ao Histórico
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      {entry && (
        <ServiceCard
          entry={entry}
          formattedTotal={currencyFormatter.format(totalPrice)}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-background p-6 shadow-xs space-y-6"
      >
        <CancellationWarning isCompleted={isCompleted} />

        <CancellationReasonSelect
          value={selectedReason}
          onChange={setSelectedReason}
          isCompleted={isCompleted}
        />

        <CommentsTextarea value={comments} onChange={setComments} />

        <RefundSummary
          servicePrice={currencyFormatter.format(entry?.price ?? 0)}
          bookingFee={currencyFormatter.format(bookingFee)}
          totalPrice={currencyFormatter.format(totalPrice)}
          paymentMethod={entry?.paymentMethod ?? "PIX"}
        />


        <ActionButtons isSubmitting={isSubmitting} isCompleted={isCompleted} />
      </form>
    </div>
  );
}
