"use client";

import { useSearchParams } from "next/navigation";
import { MOCK_HISTORY } from "@/lib/mocks/history";
import { CancelledServiceCard } from "./cancelled-service-card";
import { RefundTracker } from "./refund-tracker";
import { CancellationDetailsCard } from "./cancellation-details-card";
import { CancelledActions } from "./cancelled-actions";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CancelledContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Procura pelo ID ou seleciona o primeiro serviço com status 'cancelado'
  const entry =
    MOCK_HISTORY.find((item) => item.id === id) ??
    MOCK_HISTORY.find((item) => item.status === "cancelado") ??
    MOCK_HISTORY[5];

  if (!entry) {
    return (
      <div className="rounded-2xl border border-border bg-background p-8 text-center space-y-4">
        <p className="text-muted-foreground">Serviço cancelado não encontrado.</p>
        <CancelledActions />
      </div>
    );
  }

  const bookingFee = entry.bookingFee ?? 10;
  const totalPrice = entry.price + bookingFee;
  const protocol = `AGL-${Math.floor(200000 + (parseInt(entry.id, 10) || 1) * 37492)}`;

  return (
    <div className="w-full max-w-2xl space-y-6">
      <CancelledServiceCard
        entry={entry}
        formattedTotal={currencyFormatter.format(totalPrice)}
      />

      <RefundTracker
        paymentMethod={entry.paymentMethod ?? "Cartão de Crédito"}
        refundStatus="completed"
      />

      <CancellationDetailsCard
        protocol={protocol}
        cancellationReason={entry.cancellationReason}
        servicePrice={currencyFormatter.format(entry.price)}
        bookingFee={currencyFormatter.format(bookingFee)}
        totalPrice={currencyFormatter.format(totalPrice)}
        paymentMethod={entry.paymentMethod ?? "Cartão de Crédito"}
        date={entry.date}
      />

      <CancelledActions />
    </div>
  );
}
