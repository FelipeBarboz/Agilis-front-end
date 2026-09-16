import type { StoreAppointment } from "../store-appointment-card";
import { RecipientItem } from "./recipient-item";

interface NotifyDelayRecipientsProps {
  appointmentScope: "day" | "all";
  onScopeChange: (scope: "day" | "all") => void;
  dayCount: number;
  allCount: number;
  currentList: StoreAppointment[];
  selectedIds: string[];
  onToggleId: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function NotifyDelayRecipients({
  appointmentScope,
  onScopeChange,
  dayCount,
  allCount,
  currentList,
  selectedIds,
  onToggleId,
  onSelectAll,
  onDeselectAll,
}: NotifyDelayRecipientsProps) {
  const targetedCount = selectedIds.length;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
          1. Selecione os Clientes Afetados
        </label>
        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => onScopeChange("day")}
            className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
              appointmentScope === "day"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Deste dia ({dayCount})
          </button>
          <button
            type="button"
            onClick={() => onScopeChange("all")}
            className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
              appointmentScope === "all"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos da loja ({allCount})
          </button>
        </div>
      </div>

      {/* Lista de clientes com checkboxes */}
      <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2 max-h-44 overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-border text-[11px]">
          <span className="text-muted-foreground">
            {targetedCount} selecionado(s) de {currentList.length}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              Marcar todos
            </button>
            <button
              type="button"
              onClick={onDeselectAll}
              className="text-muted-foreground hover:underline cursor-pointer"
            >
              Desmarcar
            </button>
          </div>
        </div>

        {currentList.length === 0 ? (
          <p className="text-xs text-muted-foreground py-3 text-center">
            Nenhum agendamento encontrado para esta seleção.
          </p>
        ) : (
          currentList.map((appt) => (
            <RecipientItem
              key={appt.id}
              appointment={appt}
              isChecked={selectedIds.includes(appt.id)}
              onToggle={onToggleId}
            />
          ))
        )}
      </div>
    </div>
  );
}
