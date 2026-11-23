import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AttendanceFormActionsProps {
  isSubmitting?: boolean;
  cancelHref?: string;
}

export function AttendanceFormActions({
  isSubmitting = false,
  cancelHref = "/provider/create-store",
}: AttendanceFormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <Link
        href={cancelHref}
        className="flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:flex-1"
      >
        Cancelar
      </Link>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60 sm:flex-[2] cursor-pointer"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Salvando...
          </span>
        ) : (
          "Salvar e continuar"
        )}
      </Button>
    </div>
  );
}
