export type PaymentMethodId = "mercadopago" | "pix" | "credit-card" | "debit-card";

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  description: string;
  badge?: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "mercadopago",
    label: "Mercado Pago (Checkout Pro)",
    description: "Pix, Cartão de Crédito em até 12x, Débito e Boleto",
    badge: "Recomendado",
  },
  {
    id: "pix",
    label: "Pix (Mercado Pago)",
    description: "Aprovação instantânea via Mercado Pago",
  },
  {
    id: "credit-card",
    label: "Cartão de Crédito",
    description: "Em até 12x via Mercado Pago",
  },
  {
    id: "debit-card",
    label: "Cartão de Débito",
    description: "Débito em conta via Mercado Pago",
  },
];

export interface CreatePaymentPreferenceDTO {
  bookingId: string;
  frontendBaseUrl: string;
}

export interface PaymentPreferenceResponseDTO {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  amount: number;
  bookingId: string;
}
