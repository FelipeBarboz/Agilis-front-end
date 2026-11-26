import { useState } from "react";
import { Receipt, Tag, X, Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface OrderSummaryProps {
  serviceName: string;
  providerName: string;
  price: number;
  discountAmount?: number;
  appliedCouponCode?: string | null;
  couponError?: string | null;
  isValidatingCoupon?: boolean;
  canApplyCoupon?: boolean;
  onApplyCoupon?: (code: string) => void;
  onRemoveCoupon?: () => void;
  total: number;
}

export function OrderSummary({
  serviceName,
  providerName,
  price,
  discountAmount = 0,
  appliedCouponCode = null,
  couponError = null,
  isValidatingCoupon = false,
  canApplyCoupon = false,
  onApplyCoupon,
  onRemoveCoupon,
  total,
}: OrderSummaryProps) {
  const [couponInput, setCouponInput] = useState("");

  function handleCouponSubmit() {
    const trimmed = couponInput.trim();
    if (!trimmed || !onApplyCoupon) return;
    onApplyCoupon(trimmed);
  }

  return (
    <Card className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Receipt className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Resumo do Pedido</h2>
          <p className="text-xs text-muted-foreground">Discriminação de valores</p>
        </div>
      </div>

      {/* Item contratado */}
      <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 flex flex-col gap-1">
        <span className="text-xs text-muted-foreground font-medium">Serviço Selecionado</span>
        <p className="text-sm font-semibold text-foreground leading-snug">{serviceName}</p>
        {providerName ? (
          <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-border/50 text-xs text-muted-foreground">
            <span className="truncate font-medium">{providerName}</span>
          </div>
        ) : null}
      </div>

      {/* Campo de cupom */}
      {canApplyCoupon && onApplyCoupon && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Tag className="size-3.5 text-primary" />
            <span>Cupom de desconto</span>
          </label>

          {appliedCouponCode ? (
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span>{appliedCouponCode}</span>
                {discountAmount > 0 && (
                  <span className="font-normal">(-{formatCurrency(discountAmount)})</span>
                )}
              </div>
              {onRemoveCoupon && (
                <button
                  type="button"
                  onClick={() => {
                    setCouponInput("");
                    onRemoveCoupon();
                  }}
                  className="rounded-full p-1 hover:bg-emerald-500/20 cursor-pointer"
                  aria-label="Remover cupom"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCouponSubmit();
                  }
                }}
                placeholder="Digite o código"
                disabled={isValidatingCoupon}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium uppercase tracking-wider text-foreground placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                disabled={isValidatingCoupon || !couponInput.trim()}
                onClick={handleCouponSubmit}
                className="inline-flex items-center justify-center rounded-xl border border-border bg-muted px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted/80 disabled:opacity-50 cursor-pointer"
              >
                {isValidatingCoupon ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  "Aplicar"
                )}
              </button>
            </div>
          )}

          {couponError && (
            <p className="text-[11px] font-medium text-destructive">{couponError}</p>
          )}
        </div>
      )}

      {/* Tabela de valores */}
      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Valor do serviço</span>
          <span className="font-medium text-foreground">{formatCurrency(price)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span>Desconto ({appliedCouponCode})</span>
            <span className="font-medium">-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="border-t border-border/80 pt-3 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-foreground block">Total a pagar</span>
            <span className="text-[11px] text-muted-foreground">Em até 12x ou à vista</span>
          </div>
          <span className="text-xl font-extrabold text-primary">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

    </Card>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
