import { Check, ChevronRight, Save, X } from "lucide-react";

interface EditProviderActionsProps {
  isSaved: boolean;
  onCancel: () => void;
}

export function EditProviderActions({
  isSaved,
  onCancel,
}: EditProviderActionsProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Botão de Salvar */}
      <button
        type="submit"
        disabled={isSaved}
        id="btn-save-provider"
        className="flex w-full items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-primary/40 group sm:p-5 text-left cursor-pointer disabled:opacity-80"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
          {isSaved ? <Check className="size-5" /> : <Save className="size-5" />}
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-bold text-foreground">
            {isSaved ? "Salvo com sucesso!" : "Salvar alterações"}
          </span>
          <span className="text-xs text-muted-foreground">
            {isSaved
              ? "Suas informações foram atualizadas"
              : "Confirmar e salvar os novos dados do prestador"}
          </span>
        </div>
        <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Botão de Cancelar */}
      <button
        type="button"
        onClick={onCancel}
        id="btn-cancel-provider"
        className="flex w-full items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:border-destructive/40 group sm:p-5 text-left cursor-pointer"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive group-hover:scale-105 transition-transform">
          <X className="size-5" />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-bold text-destructive">Cancelar</span>
          <span className="text-xs text-muted-foreground">
            Descartar alterações e voltar ao perfil
          </span>
        </div>
        <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
