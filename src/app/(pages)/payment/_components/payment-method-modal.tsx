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
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Forma de Pagamento
                </h2>
                <p className="text-xs text-muted-foreground">
                  Selecione como deseja pagar pelo serviço
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
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
                      "flex items-center gap-3.5 rounded-xl border p-3.5 text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-2xs"
                        : "border-border hover:bg-muted/50 hover:border-primary/30",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex flex-1 flex-col min-w-0">
                      <span className="text-sm font-semibold text-foreground">
                        {method.label}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {method.description}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40",
                      )}
                    >
                      {isSelected && (
                        <span className="size-2 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-primary/5 border border-primary/15 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Pagamento seguro:</strong> Seus dados são protegidos e criptografados em todas as etapas.
              </p>
            </div>

            <Button
              className="mt-5 w-full rounded-xl font-bold h-11"
              disabled={!selectedId}
              onClick={() => onOpenChange(false)}
            >
              Confirmar Escolha
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}