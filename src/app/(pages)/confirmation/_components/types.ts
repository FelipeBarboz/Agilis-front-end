export type PaymentMethodId = "pix" | "credit-card" | "debit-card";

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  description: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pix", label: "Pix", description: "Aprovação instantânea" },
  { id: "credit-card", label: "Cartão de crédito", description: "Em até 12x" },
  { id: "debit-card", label: "Cartão de débito", description: "Débito em conta" },
];