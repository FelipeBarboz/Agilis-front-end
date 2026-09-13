import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateStoreFinalizeCardProps {
  isAllCompleted: boolean;
  onFinish: () => void;
}

export function CreateStoreFinalizeCard({
  isAllCompleted,
  onFinish,
}: CreateStoreFinalizeCardProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">
            Tudo pronto para começar?
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {isAllCompleted
              ? "Todas as etapas foram preenchidas! Clique abaixo para finalizar e abrir sua loja."
              : "Complete as 4 etapas acima para poder finalizar e publicar sua loja."}
          </p>
        </div>
      </div>
      <Button
        type="button"
        disabled={!isAllCompleted}
        onClick={onFinish}
        className="w-full shrink-0 gap-2 rounded-xl bg-primary py-5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary sm:w-auto cursor-pointer"
      >
        Finalizar e Abrir Loja
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
