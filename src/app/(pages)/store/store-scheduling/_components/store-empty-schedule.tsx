import { CalendarDays, AlertTriangle } from "lucide-react";

interface StoreEmptyScheduleProps {
  selectedDate: string | null;
  onOpenDelayModal?: () => void;
}

const MONTH_NAMES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function formatDate(dateStr: string) {
  const [, m, d] = dateStr.split("-").map(Number);
  
  if (!m || !d) return dateStr;

  return `${d} de ${MONTH_NAMES[m - 1]}`;
}

export function StoreEmptySchedule({ selectedDate, onOpenDelayModal }: StoreEmptyScheduleProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <CalendarDays className="size-8 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {selectedDate ? `Nenhum agendamento em ${formatDate(selectedDate)}` : "Nenhum agendamento"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
          Nenhum cliente agendado para esta data específica. Você ainda pode comunicar atrasos em outros dias.
        </p>
      </div>

      {onOpenDelayModal && (
        <button
          type="button"
          onClick={onOpenDelayModal}
          className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors hover:bg-amber-500/20 cursor-pointer shadow-xs"
        >
          <AlertTriangle className="size-3.5" />
          Avisar Atraso em Outros Agendamentos
        </button>
      )}
    </div>
  );
}
