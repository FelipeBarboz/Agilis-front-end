import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Hourglass,
  CalendarDays,
  FileText,
  AlertCircle,
  RefreshCw,
  Ban,
  CalendarSync,
} from "lucide-react";
import Link from "next/link";
import { type HistoryEntry, type HistoryStatus, STATUS_LABEL, STATUS_BADGE_CLASS } from "../types";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const fullDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const STATUS_ICONS: Record<HistoryStatus, React.ComponentType<{ className?: string }>> = {
  em_andamento: Hourglass,
  agendado: CalendarDays,
  concluido: CheckCircle2,
  cancelado: XCircle,
};

interface HistoryDetailModalProps {
  entry: HistoryEntry | null;
  open: boolean;
  onClose: () => void;
}

export function HistoryDetailModal({ entry, open, onClose }: HistoryDetailModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open && entry) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [open, entry?.id]);

  if (!entry) return null;

  const StatusIcon = STATUS_ICONS[entry.status];
  const dateObj = new Date(entry.date);
  const formattedDate = fullDateFormatter.format(dateObj);
  // Capitalize first letter of weekday
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const bookingFee = entry.bookingFee ?? 0;
  const totalPrice = entry.price + bookingFee;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_BADGE_CLASS[entry.status]}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {STATUS_LABEL[entry.status]}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content or Loading State */}
            {isLoading ? (
              <div className="flex flex-1 flex-col items-center justify-center py-24">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Carregando detalhes do serviço...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Service Hero Summary */}
                  <div className="flex gap-4 rounded-xl border border-border bg-muted/40 p-4">
                    {entry.imageUrl && entry.imageUrl.trim() !== "" ? (
                      <img
                        src={entry.imageUrl}
                        alt={entry.serviceName}
                        className="h-20 w-20 shrink-0 rounded-lg object-cover shadow-xs"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                        {entry.serviceName.charAt(0)}
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        {entry.category && (
                          <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary mb-1">
                            {entry.category}
                          </span>
                        )}
                        <h3 className="text-base font-bold text-foreground leading-snug truncate">
                          {entry.serviceName}
                        </h3>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-muted-foreground">Valor:</span>
                        <span className="text-base font-extrabold text-foreground">
                          {currencyFormatter.format(entry.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Alert Banner if Cancelled */}
                  {entry.status === "cancelado" && entry.cancellationReason && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-red-800">
                      <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-semibold text-red-900">Motivo do cancelamento</p>
                        <p className="mt-0.5 text-red-700 leading-relaxed">
                          {entry.cancellationReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Counterpart Card (Provider or Client) */}
                  <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      {entry.counterpartAvatarUrl && entry.counterpartAvatarUrl.trim() !== "" ? (
                        <img
                          src={entry.counterpartAvatarUrl}
                          alt={entry.counterpartName}
                          className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {entry.counterpartName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {entry.counterpartRole === "prestador" ? "Prestador" : "Cliente Contratante"}
                        </span>
                        <p className="text-sm font-bold text-foreground">
                          {entry.counterpartName}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/chats"
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Chat</span>
                    </Link>
                  </div>

                  {/* Scheduling & Location Information */}
                  <div className="rounded-xl border border-border bg-background p-4 space-y-3.5 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Informações de Atendimento
                    </h4>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex items-start gap-2.5">
                        <Calendar className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Data do serviço</p>
                          <p className="text-xs font-medium text-foreground leading-tight">
                            {capitalizedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Clock className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Horário e duração</p>
                          <p className="text-xs font-medium text-foreground leading-tight">
                            {entry.time ? `${entry.time}` : "Horário comercial"}
                            {entry.duration ? ` (${entry.duration})` : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {entry.address && (
                      <div className="flex items-start gap-2.5 border-t border-border pt-3">
                        <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Local de atendimento</p>
                          <p className="text-xs font-medium text-foreground leading-tight">
                            {entry.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Summary */}
                  <div className="rounded-xl border border-border bg-background p-4 space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Resumo Financeiro
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Valor do serviço</span>
                        <span className="font-medium text-foreground">
                          {currencyFormatter.format(entry.price)}
                        </span>
                      </div>

                      {bookingFee > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Taxa de serviço</span>
                          <span className="font-medium text-foreground">
                            {currencyFormatter.format(bookingFee)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                        <span>Total</span>
                        <span>{currencyFormatter.format(totalPrice)}</span>
                      </div>

                      {entry.paymentMethod && (
                        <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <CreditCard className="h-3.5 w-3.5 text-primary" />
                            Forma de pagamento
                          </span>
                          <span className="font-semibold text-foreground">
                            {entry.paymentMethod}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes / Observations */}
                  {entry.notes && (
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <FileText className="h-4 w-4 text-primary" />
                        <h4 className="text-xs font-bold text-foreground">Observações</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {entry.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions depending on status */}
                <div className="border-t border-border bg-muted/20 p-4">
                  {entry.status === "em_andamento" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href="/chats"
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 text-center"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Chat com Prestador
                        </Link>
                        <Link
                          href={`/reschedule?id=${entry.id}`}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted text-center"
                        >
                          <CalendarSync className="h-4 w-4 text-primary" />
                          Reagendar
                        </Link>
                      </div>
                      <div className="flex justify-between items-center pt-1 text-xs">
                        <Link
                          href={`/refund-confirmation?id=${entry.id}`}
                          className="flex items-center gap-1 text-destructive hover:underline"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Cancelar serviço e solicitar reembolso
                        </Link>
                        <Link href="/support" className="text-muted-foreground hover:underline">
                          Ajuda
                        </Link>
                      </div>
                    </div>
                  )}

                  {entry.status === "agendado" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href={`/reschedule?id=${entry.id}`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 text-center"
                        >
                          <CalendarSync className="h-4 w-4" />
                          Reagendar Serviço
                        </Link>
                        <Link
                          href="/chats"
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted text-center"
                        >
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          Chat
                        </Link>
                      </div>
                      <div className="flex justify-center pt-1">
                        <Link
                          href={`/refund-confirmation?id=${entry.id}`}
                          className="flex items-center gap-1 text-xs text-destructive hover:underline"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Cancelar agendamento e solicitar reembolso
                        </Link>
                      </div>
                    </div>
                  )}

                  {entry.status === "concluido" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href="/services"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 text-center"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Contratar Novamente
                      </Link>
                      <Link
                        href="/chats"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted text-center"
                      >
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        Ver Conversa
                      </Link>
                    </div>
                  )}

                  {entry.status === "cancelado" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href={`/refund-confirmation?id=${entry.id}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 text-center"
                      >
                        Ver Detalhes do Reembolso
                      </Link>
                      <Link
                        href="/support"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted text-center"
                      >
                        Suporte
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
