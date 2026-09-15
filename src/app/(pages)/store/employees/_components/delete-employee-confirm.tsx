import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteEmployeeConfirmProps {
  employeeName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteEmployeeConfirm({
  employeeName,
  onCancel,
  onConfirm,
}: DeleteEmployeeConfirmProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 text-destructive">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="size-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Excluir Funcionário</h2>
          <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita.</p>
        </div>
      </div>

      <p className="text-sm text-foreground leading-relaxed">
        Tem certeza que deseja remover{" "}
        <strong className="text-foreground">{employeeName}</strong> da equipe da
        loja? O funcionário perderá todos os acessos imediatamente.
      </p>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm font-medium border-border hover:bg-muted cursor-pointer"
        >
          Voltar
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          className="rounded-xl px-5 py-2 text-sm font-semibold bg-destructive text-white hover:bg-destructive/90 transition-colors cursor-pointer"
        >
          Confirmar Exclusão
        </Button>
      </div>
    </div>
  );
}
