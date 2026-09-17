import { Store } from "lucide-react";

interface CreateStoreProgressProps {
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
}

export function CreateStoreProgress({
  completedSteps,
  totalSteps,
  progressPercentage,
}: CreateStoreProgressProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-5 p-6 md:p-8">
        {/* Ícone + Texto */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <Store className="size-7 text-primary" />
          </div>
          <div>
            <p className="text-base font-bold text-foreground leading-tight">
              Configure os dados da sua loja
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Complete as {totalSteps} etapas para publicar seu perfil
            </p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Progresso</span>
            <span className="text-foreground">
              {completedSteps}/{totalSteps} etapas ({progressPercentage}%)
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
