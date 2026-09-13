import Link from "next/link";
import { Check, X, ChevronRight } from "lucide-react";

interface AddressActionsProps {
  isLoading: boolean;
}

export function AddressActions({ isLoading }: AddressActionsProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Salvar */}
      <button
        type="submit"
        disabled={isLoading}
        id="btn-save-address"
        className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all group hover:border-primary/40 hover:bg-muted/40 disabled:opacity-80 sm:p-5"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
          <Check className="size-5" />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-bold text-foreground">
            {isLoading ? "Salvando endereço..." : "Salvar endereço"}
          </span>
          <span className="text-xs text-muted-foreground">
            Confirmar e cadastrar este endereço para seus agendamentos
          </span>
        </div>
        <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Cancelar */}
      <Link
        href="/addresses"
        id="btn-cancel-address"
        className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all group hover:border-destructive/40 hover:bg-muted/40 sm:p-5"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition-transform group-hover:scale-105">
          <X className="size-5" />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-bold text-destructive">Cancelar</span>
          <span className="text-xs text-muted-foreground">
            Descartar alterações e voltar para a lista de endereços
          </span>
        </div>
        <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
