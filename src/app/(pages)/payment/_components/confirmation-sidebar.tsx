import { ShieldCheck, ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "./order-summary";

interface ConfirmationSidebarProps {
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
  isLoading?: boolean;
  isMercadoPago?: boolean;
  onConfirm: () => void;
}

export function ConfirmationSidebar({
  serviceName,
  providerName,
  price,
  discountAmount,
  appliedCouponCode,
  couponError,
  isValidatingCoupon,
  canApplyCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  total,
  isLoading = false,
  isMercadoPago = true,
  onConfirm,
}: ConfirmationSidebarProps) {
  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-6">
      <OrderSummary
        serviceName={serviceName}
        providerName={providerName}
        price={price}
        discountAmount={discountAmount}
        appliedCouponCode={appliedCouponCode}
        couponError={couponError}
        isValidatingCoupon={isValidatingCoupon}
        canApplyCoupon={canApplyCoupon}
        onApplyCoupon={onApplyCoupon}
        onRemoveCoupon={onRemoveCoupon}
        total={total}
      />

      <Button
        className="w-full h-12 rounded-xl text-base font-bold shadow-xs transition-all hover:shadow-md cursor-pointer gap-2 bg-[#009EE3] hover:bg-[#0089C7] text-white"
        size="lg"
        disabled={isLoading}
        onClick={onConfirm}
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Gerando Checkout Pro...</span>
          </>
        ) : isMercadoPago ? (
          <>
            <ShieldCheck className="h-5 w-5" />
            <span>Pagar com Mercado Pago</span>
            <ExternalLink className="h-4 w-4 ml-auto opacity-70" />
          </>
        ) : (
          <>
            <Lock className="h-5 w-5" />
            <span>Confirmar Agendamento</span>
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3 text-emerald-600" />
        <span>Pagamento 100% seguro via Mercado Pago Checkout Pro</span>
      </div>

      <p className="text-center text-xs text-muted-foreground leading-relaxed px-2">
        Ao confirmar, você concorda com os Termos de Serviço e com a Política de
        Cancelamento da Agilis.
      </p>
    </div>
  );
}
