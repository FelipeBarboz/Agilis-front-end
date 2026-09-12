import Link from "next/link";

interface ActionButtonsProps {
  isSubmitting: boolean;
}

export function ActionButtons({ isSubmitting }: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-destructive/90 disabled:opacity-50"
      >
        {isSubmitting ? "Processando..." : "Confirmar Cancelamento e Reembolso"}
      </button>
      <Link
        href="/history"
        className="rounded-xl border border-border bg-background px-6 py-3 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        Manter Serviço
      </Link>
    </div>
  );
}
