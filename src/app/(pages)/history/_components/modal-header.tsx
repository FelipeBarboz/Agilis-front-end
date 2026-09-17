import { X, Hourglass, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import { type HistoryStatus, STATUS_LABEL, STATUS_BADGE_CLASS } from "../../../../types/history";
import { cn } from "@/lib/utils";

const STATUS_ICONS: Record<HistoryStatus, React.ComponentType<{ className?: string }>> = {
  em_andamento: Hourglass,
  agendado: CalendarDays,
  concluido: CheckCircle2,
  cancelado: XCircle,
};

interface ModalHeaderProps {
  status: HistoryStatus;
  onClose: () => void;
}

export function ModalHeader({ status, onClose }: ModalHeaderProps) {
  const StatusIcon = STATUS_ICONS[status];

  return (
    <div className="flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
            STATUS_BADGE_CLASS[status],
          )}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {STATUS_LABEL[status]}
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Fechar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
