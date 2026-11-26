import Link from "next/link";
import {
  MessageSquare,
  CalendarSync,
  Ban,
  RefreshCw,
  Star,
  CheckCircle2,
} from "lucide-react";
import { type HistoryStatus } from "../../../../types/history";
import { type ReviewDTO } from "@/lib/services/reviews-service";

const primaryLink =
  "flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90";

const secondaryLink =
  "flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted";

interface ModalFooterActionsProps {
  status: HistoryStatus;
  entryId: string;
  existingReview?: ReviewDTO | null;
  onOpenReview?: () => void;
}

export function ModalFooterActions({
  status,
  entryId,
  existingReview,
  onOpenReview,
}: ModalFooterActionsProps) {
  return (
    <div className="border-t border-border bg-muted/20 p-4">
      {status === "em_andamento" && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/chats" className={primaryLink}>
              <MessageSquare className="h-4 w-4" />
              Chat com Prestador
            </Link>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Ban className="h-3.5 w-3.5 text-muted-foreground/70" />
              Serviços em andamento não podem ser cancelados ou reagendados
            </span>
            <Link href="/support" className="text-muted-foreground hover:underline">
              Ajuda
            </Link>
          </div>
        </div>
      )}

      {status === "agendado" && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/reschedule?id=${entryId}`} className={primaryLink}>
              <CalendarSync className="h-4 w-4" />
              Reagendar Serviço
            </Link>
            <Link href="/chats" className={secondaryLink}>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Chat
            </Link>
          </div>
          <div className="flex justify-center pt-1">
            <Link
              href={`/refund-confirmation?id=${entryId}`}
              className="flex items-center gap-1 text-xs text-destructive hover:underline"
            >
              <Ban className="h-3.5 w-3.5" />
              Cancelar agendamento e solicitar reembolso
            </Link>
          </div>
        </div>
      )}

      {status === "concluido" && (
        <div className="flex flex-col gap-2">
          {existingReview && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Avaliado por você
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {existingReview.rating}/5
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            {!existingReview && onOpenReview && (
              <button
                type="button"
                onClick={onOpenReview}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-center text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-500/20 dark:text-amber-400 cursor-pointer"
              >
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                Avaliar Serviço
              </button>
            )}
            <Link href="/services" className={primaryLink}>
              <RefreshCw className="h-4 w-4" />
              Contratar Novamente
            </Link>
            <Link href="/chats" className={secondaryLink}>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Ver Conversa
            </Link>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs">
            <Link
              href={`/refund-confirmation?id=${entryId}`}
              className="flex items-center gap-1 text-destructive hover:underline cursor-pointer"
            >
              <Ban className="h-3.5 w-3.5" />
              Tive um problema / Solicitar reembolso
            </Link>
            <Link href="/support" className="text-muted-foreground hover:underline">
              Ajuda
            </Link>
          </div>
        </div>
      )}

      {status === "cancelado" && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href={`/cancelled?id=${entryId}`} className={primaryLink}>
            Acompanhar Reembolso
          </Link>
          <Link href="/support" className={secondaryLink}>
            Suporte
          </Link>
        </div>
      )}
    </div>
  );
}
