import Link from "next/link";

interface RescheduleActionsProps {
  isSubmitting: boolean;
  cancelHref?: string;
}

export function RescheduleActions({
  isSubmitting,
  cancelHref = "/history",
}: RescheduleActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? "Confirmando..." : "Solicitar novo horário"}
      </button>
      <Link
        href={cancelHref}
        className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
      >
        Cancelar
      </Link>
    </div>
  );
}
