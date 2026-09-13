import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AttendanceFormActions() {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <Link
        href="/provider/create-store"
        className="flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:flex-1"
      >
        Cancelar
      </Link>
      <Button
        type="submit"
        className="h-11 w-full rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 sm:flex-[2] cursor-pointer"
      >
        Salvar e continuar
      </Button>
    </div>
  );
}
