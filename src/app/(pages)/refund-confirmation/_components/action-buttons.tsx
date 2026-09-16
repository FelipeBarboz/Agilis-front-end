import Link from "next/link";

interface ActionButtonsProps {
  isSubmitting: boolean;
  cancelHref?: string;
  isCompleted?: boolean;
}

export function ActionButtons({
  isSubmitting,
  cancelHref = "/history",
  isCompleted = false,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-destructive/90 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting
          ? "Processando..."
          : isCompleted
            ? "Solicitar Reembolso do Serviço"
            : "Confirmar Cancelamento e Reembolso"}
      </button>
      <Link
        href={cancelHref}
        className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
      >
        {isCompleted ? "Voltar ao Histórico" : "Manter Serviço"}
      </Link>
    </div>
  );
}
