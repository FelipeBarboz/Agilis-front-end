"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_HISTORY } from "../../../../lib/mocks/history";
import { ServiceCard } from "./service-card";
import { CancellationWarning } from "./cancellation-warning";
import {
  CancellationReasonSelect,
  CANCELLATION_REASONS,
} from "./cancellation-reason-select";
import { CommentsTextarea } from "./comments-textarea";
import { RefundSummary } from "./refund-summary";
import { SafetyBadge } from "./safety-badge";
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

  const entry = MOCK_HISTORY.find((item) => item.id === id) ?? MOCK_HISTORY[0];

  const [selectedReason, setSelectedReason] = useState<string>(CANCELLATION_REASONS[0] ?? "");
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
      <SuccessCard
        protocol={protocol}
        serviceName={entry?.serviceName ?? ""}
        totalPrice={currencyFormatter.format(totalPrice)}
        paymentMethod={entry?.paymentMethod ?? "PIX"}
        onBackToHistory={() => router.push("/history")}
      />
    );
  }

  return (
    <form
      onSubmit={handleConfirmCancellation}
      className="w-full space-y-6 rounded-2xl border border-border bg-background p-6 shadow-lg sm:p-8"
    >
      <ServiceCard
        serviceName={entry?.serviceName ?? ""}
        counterpartName={entry?.counterpartName ?? ""}
        counterpartRole={entry?.counterpartRole ?? ""}
        imageUrl={entry?.imageUrl}
        totalPrice={currencyFormatter.format(totalPrice)}
      />

      <CancellationWarning />

      <CancellationReasonSelect
        value={selectedReason}
        onChange={setSelectedReason}
      />

      <CommentsTextarea value={comments} onChange={setComments} />

      <RefundSummary
        servicePrice={currencyFormatter.format(entry?.price ?? 0)}
        bookingFee={currencyFormatter.format(bookingFee)}
        totalPrice={currencyFormatter.format(totalPrice)}
        paymentMethod={entry?.paymentMethod ?? "PIX"}
      />

      <SafetyBadge />

      <ActionButtons isSubmitting={isSubmitting} />
    </form>
  );
}
