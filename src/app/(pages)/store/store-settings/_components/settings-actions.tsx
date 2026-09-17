import { Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsActionsProps {
  isSaving: boolean;
  onCancel: () => void;
}

export function SettingsActions({ isSaving, onCancel }: SettingsActionsProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="w-full sm:w-auto rounded-2xl border-border px-6 py-2.5 text-sm font-semibold hover:bg-card cursor-pointer"
      >
        <RotateCcw className="size-4 mr-2 text-muted-foreground" />
        Descartar alterações
      </Button>

      <Button
        type="submit"
        disabled={isSaving}
        className="w-full sm:w-auto rounded-2xl bg-brand-dark px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark-2 transition-all cursor-pointer disabled:opacity-50"
      >
        {isSaving ? (
          <>
            <div className="size-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="size-4 mr-2" />
            Salvar Alterações
          </>
        )}
      </Button>
    </div>
  );
}
