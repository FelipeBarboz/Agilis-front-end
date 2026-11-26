"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Ticket,
  Plus,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Ban,
  ShieldAlert,
  Calendar,
  Percent,
  DollarSign,
} from "lucide-react";
import {
  getAllCoupons,
  createCoupon,
  deactivateCoupon,
  type CouponDTO,
  type CouponDiscountType,
} from "@/lib/services/coupons-service";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatExpirationDate(isoDate: string | null): string | null {
  if (!isoDate) return null;
  const parsed = new Date(isoDate);
  if (isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface CouponsManagementCardProps {
  storeId?: string | null;
}

export function CouponsManagementCard({
  storeId,
}: CouponsManagementCardProps) {
  const [coupons, setCoupons] = useState<CouponDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);

  // Formulário de criação
  const [showForm, setShowForm] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [discountType, setDiscountType] =
    useState<CouponDiscountType>("PERCENTAGE");
  const [discountValueInput, setDiscountValueInput] = useState("10");
  const [maxUsesInput, setMaxUsesInput] = useState("");
  const [expiresAtInput, setExpiresAtInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Copiar código
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Desativação com confirmação inline
  const [confirmDeactivateId, setConfirmDeactivateId] = useState<string | null>(
    null
  );
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const loadCoupons = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsForbidden(false);
    try {
      const list = await getAllCoupons();
      setCoupons(list);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os cupons.";
      if (
        msg.toLowerCase().includes("403") ||
        msg.toLowerCase().includes("permiss") ||
        msg.toLowerCase().includes("acesso negado") ||
        msg.toLowerCase().includes("autoriz") ||
        msg.toLowerCase().includes("platform administrator")
      ) {
        setIsForbidden(true);
      }
      setErrorMessage(msg);
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

  async function handleCopyCode(coupon: CouponDTO) {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopiedId(coupon.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard indisponível
    }
  }

  async function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const trimmedCode = codeInput.trim().toUpperCase().replace(/\s+/g, "");
    if (trimmedCode.length < 3) {
      setFormError("O código do cupom deve ter pelo menos 3 caracteres.");
      return;
    }

    const numericValue = Number(discountValueInput.replace(",", "."));
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setFormError("Informe um valor de desconto válido maior que zero.");
      return;
    }

    if (discountType === "PERCENTAGE" && numericValue > 100) {
      setFormError("O desconto percentual não pode ser maior que 100%.");
      return;
    }

    let parsedMaxUses: number | null = null;
    if (maxUsesInput.trim()) {
      const n = Number(maxUsesInput);
      if (!Number.isInteger(n) || n <= 0) {
        setFormError("O limite de usos deve ser um número inteiro positivo.");
        return;
      }
      parsedMaxUses = n;
    }

    let formattedExpiresAt: string | null = null;
    if (expiresAtInput.trim()) {
      formattedExpiresAt = `${expiresAtInput.trim()}T23:59:59`;
    }

    setIsCreating(true);
    try {
      const created = await createCoupon({
        code: trimmedCode,
        discountType,
        discountValue: numericValue,
        maxUses: parsedMaxUses,
        expiresAt: formattedExpiresAt,
        storeId: storeId ?? undefined,
      });

      setCoupons((prev) => [created, ...prev]);
      setCodeInput("");
      setDiscountValueInput("10");
      setMaxUsesInput("");
      setExpiresAtInput("");
      setShowForm(false);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível criar o cupom.";
      setFormError(msg);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeactivate(couponId: string) {
    setDeactivatingId(couponId);
    setErrorMessage(null);
    try {
      await deactivateCoupon(couponId);
      setCoupons((prev) =>
        prev.map((c) => (c.id === couponId ? { ...c, active: false } : c))
      );
      setConfirmDeactivateId(null);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível desativar o cupom.";
      setErrorMessage(msg);
    } finally {
      setDeactivatingId(null);
    }
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Cupons de Desconto
            </h2>
            <p className="text-xs text-muted-foreground">
              Crie códigos promocionais e gerencie cupons ativos na plataforma
            </p>
          </div>
        </div>

        {!isForbidden && (
          <button
            type="button"
            onClick={() => {
              setShowForm((v) => !v);
              setFormError(null);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Cancelar" : "Novo cupom"}
          </button>
        )}
      </div>

      {/* Formulário de criação */}
      {showForm && (
        <form
          onSubmit={handleCreateCoupon}
          className="rounded-2xl border border-border bg-muted/30 p-4 space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="coupon-code"
                className="text-xs font-semibold text-foreground"
              >
                Código do cupom *
              </label>
              <input
                id="coupon-code"
                type="text"
                required
                value={codeInput}
                onChange={(e) =>
                  setCodeInput(e.target.value.toUpperCase().replace(/\s+/g, ""))
                }
                placeholder="Ex: AGILIS15"
                maxLength={32}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-mono uppercase text-foreground placeholder:font-sans placeholder:normal-case placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="coupon-discount-type"
                className="text-xs font-semibold text-foreground"
              >
                Tipo de desconto
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountType("PERCENTAGE")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    discountType === "PERCENTAGE"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Percent className="h-3.5 w-3.5" />
                  Porcentagem
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType("FIXED")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    discountType === "FIXED"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  Valor fixo
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="coupon-discount-value"
                className="text-xs font-semibold text-foreground"
              >
                {discountType === "PERCENTAGE"
                  ? "Desconto (%) *"
                  : "Valor do desconto (R$) *"}
              </label>
              <input
                id="coupon-discount-value"
                type="number"
                step={discountType === "PERCENTAGE" ? "1" : "0.01"}
                min="0.01"
                max={discountType === "PERCENTAGE" ? "100" : undefined}
                required
                value={discountValueInput}
                onChange={(e) => setDiscountValueInput(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="coupon-max-uses"
                className="text-xs font-semibold text-foreground"
              >
                Limite de usos (opcional)
              </label>
              <input
                id="coupon-max-uses"
                type="number"
                min="1"
                step="1"
                value={maxUsesInput}
                onChange={(e) => setMaxUsesInput(e.target.value)}
                placeholder="Ilimitado"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label
                htmlFor="coupon-expires-at"
                className="text-xs font-semibold text-foreground"
              >
                Válido até (opcional)
              </label>
              <input
                id="coupon-expires-at"
                type="date"
                value={expiresAtInput}
                onChange={(e) => setExpiresAtInput(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none sm:max-w-xs"
              />
            </div>
          </div>

          {formError && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={isCreating}
              className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-60 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar cupom"
              )}
            </button>
          </div>
        </form>
      )}

      {/* Erro / Permissão */}
      {errorMessage && (
        <div
          className={`flex items-start gap-2.5 rounded-2xl border p-4 text-xs ${
            isForbidden
              ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {isForbidden ? (
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <div>
            <p className="font-semibold">
              {isForbidden
                ? "Acesso restrito"
                : "Erro ao comunicar com o servidor"}
            </p>
            <p className="mt-0.5 opacity-90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Lista de cupons */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary" />
          <span className="text-xs font-medium">Carregando cupons...</span>
        </div>
      ) : coupons.length === 0 && !errorMessage ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
          <Ticket className="mx-auto h-7 w-7 text-muted-foreground/60 mb-2" />
          <p className="text-sm font-semibold text-foreground">
            Nenhum cupom cadastrado
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Crie seu primeiro cupom para oferecer descontos aos clientes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => {
            const formattedExpiry = formatExpirationDate(coupon.expiresAt);
            const discountLabel =
              coupon.discountType === "PERCENTAGE"
                ? `${coupon.discountValue}% OFF`
                : `${currencyFormatter.format(coupon.discountValue)} OFF`;

            return (
              <div
                key={coupon.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2.5 py-1 font-mono text-xs font-bold text-foreground">
                      {coupon.code}
                      <button
                        type="button"
                        onClick={() => void handleCopyCode(coupon)}
                        aria-label={`Copiar código ${coupon.code}`}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {copiedId === coupon.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </span>

                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      {discountLabel}
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                        coupon.active
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {coupon.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      Usos:{" "}
                      <strong className="text-foreground">
                        {coupon.usedCount}
                      </strong>
                      {coupon.maxUses ? ` / ${coupon.maxUses}` : " (ilimitado)"}
                    </span>
                    {formattedExpiry && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Válido até {formattedExpiry}
                      </span>
                    )}
                  </div>
                </div>

                {coupon.active && (
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {confirmDeactivateId === coupon.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setConfirmDeactivateId(null)}
                          disabled={deactivatingId === coupon.id}
                          className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeactivate(coupon.id)}
                          disabled={deactivatingId === coupon.id}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60 cursor-pointer"
                        >
                          {deactivatingId === coupon.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Ban className="h-3.5 w-3.5" />
                          )}
                          Confirmar
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeactivateId(coupon.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:border-destructive/40 hover:bg-destructive/10 cursor-pointer"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Desativar
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
