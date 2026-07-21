"use client";

import { AnimatePresence, motion } from "framer-motion";
import { QrCode, CreditCard, Wallet, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAYMENT_METHODS, type PaymentMethodId } from "./types";
import { cn } from "@/lib/utils";

const ICONS: Record<PaymentMethodId, React.ElementType> = {
  pix: QrCode,
  "credit-card": CreditCard,
  "debit-card": Wallet,
};

interface PaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId: PaymentMethodId | null;
  onSelect: (id: PaymentMethodId) => void;
}

export function PaymentMethodModal({
  open,
  onOpenChange,
  selectedId,
  onSelect,
}: PaymentMethodModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            className="w-full max-w-sm rounded-xl bg-background p-6 shadow-lg"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Selecione a forma de pagamento
              </h2>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = ICONS[method.id];
                const isSelected = method.id === selectedId;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => onSelect(method.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-input hover:bg-muted",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isSelected ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {method.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {method.description}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "h-4 w-4 rounded-full border-2",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-input",
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary/5 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground">
                Pagamento seguro. Seus dados são protegidos e criptografados
                em todas as transações.
              </p>
            </div>

            <Button
              className="mt-4 w-full"
              disabled={!selectedId}
              onClick={() => onOpenChange(false)}
            >
              Continuar
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}