import { CheckCircle2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceFormActionsProps {
  isSubmitting: boolean;
  success: boolean;
  errorMessage: string | null;
  submitLabel?: string;
  submittingLabel?: string;
  onCancel: () => void;
}

export function ServiceFormActions({
  isSubmitting,
  success,
  errorMessage,
  submitLabel = "Publicar Serviço",
  submittingLabel = "Publicando...",
  onCancel,
}: ServiceFormActionsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Feedback de Sucesso */}
      {success && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-4 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">
              Serviço publicado com sucesso!
            </span>
            <span className="text-xs">
              Redirecionando para a página de serviços...
            </span>
          </div>
        </div>
      )}

      {/* Feedback de Erro */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 p-4 border border-destructive/20 text-destructive text-sm font-medium">
          <X className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-xl border-border hover:bg-card px-5 h-11 text-xs font-bold cursor-pointer"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || success}
          className="rounded-xl bg-primary hover:bg-primary/90 px-6 h-11 text-xs font-bold text-white shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            submittingLabel
          ) : (
            <>
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
