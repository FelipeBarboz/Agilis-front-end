import { CalendarDays } from "lucide-react";

interface EmptyScheduleProps {
  selectedDate: string | null;
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

export function EmptySchedule({ selectedDate }: EmptyScheduleProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <CalendarDays className="size-8 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {selectedDate ? `Nenhum agendamento em ${formatDate(selectedDate)}` : "Nenhum agendamento"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Quando um cliente agendar um serviço, ele aparecerá aqui
        </p>
      </div>
    </div>
  );
}
