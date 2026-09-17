import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PositionsEmptyStateProps {
  onAddPosition: () => void;
}

export function PositionsEmptyState({ onAddPosition }: PositionsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-muted/20">
      <Briefcase className="size-10 text-muted-foreground mb-3" />
      <h3 className="font-bold text-foreground">Nenhum cargo cadastrado</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        Adicione o primeiro cargo para começar a estruturar as funções da sua loja.
      </p>
      <Button
        onClick={onAddPosition}
        className="mt-4 gap-2 rounded-xl bg-brand-dark text-white hover:bg-brand-dark-2 cursor-pointer"
      >
        <Plus className="size-4" />
        Adicionar Cargo
      </Button>
    </div>
  );
}
