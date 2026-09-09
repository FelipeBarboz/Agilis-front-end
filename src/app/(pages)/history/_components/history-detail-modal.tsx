"use client";

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
import Image from "next/image";
import { type HistoryEntry, type HistoryStatus, STATUS_LABEL, STATUS_BADGE_CLASS } from "../types";
import { cn } from "@/lib/utils";

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
  const [imgError, setImgError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (open && entry) {
      setIsLoading(true);
      setImgError(false);
      setAvatarError(false);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [open, entry?.id]);

  // Fechar com a tecla ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!entry) return null;

  const StatusIcon = STATUS_ICONS[entry.status];
  const dateObj = new Date(entry.date);
  const formattedDate = fullDateFormatter.format(dateObj);
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const bookingFee = entry.bookingFee ?? 0;
  const totalPrice = entry.price + bookingFee;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop com desfoque */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-detail-modal-title"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                    STATUS_BADGE_CLASS[entry.status],
                  )}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {STATUS_LABEL[entry.status]}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content or Loading Skeleton */}
            {isLoading ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-5 animate-pulse">
                {/* Hero skeleton */}
                <div className="flex gap-4 rounded-2xl border border-border/40 bg-card p-4">
                  <div className="h-20 w-20 shrink-0 rounded-xl bg-muted" />
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div className="space-y-2">
                      <div className="h-4 w-20 rounded-md bg-muted" />
                      <div className="h-5 w-44 rounded-md bg-muted" />
                    </div>
                    <div className="h-4 w-28 rounded-md bg-muted" />
                  </div>
                </div>

                {/* Counterpart skeleton */}
                <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-muted" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-16 rounded-md bg-muted" />
                      <div className="h-4 w-32 rounded-md bg-muted" />
                    </div>
                  </div>
                  <div className="h-8 w-20 rounded-lg bg-muted" />
                </div>

                {/* Info block skeleton */}
                <div className="rounded-2xl border border-border/40 bg-card p-4 space-y-3">
                  <div className="h-3 w-28 rounded-md bg-muted" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 rounded-lg bg-muted/60" />
                    <div className="h-10 rounded-lg bg-muted/60" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  {/* Service Hero Summary */}
                  <div className="flex gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4 shadow-xs">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                      {entry.imageUrl && !imgError ? (
                        <Image
                          src={entry.imageUrl}
                          alt={entry.serviceName}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                          {entry.serviceName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        {entry.category && (
                          <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary mb-1">
                            {entry.category}
                          </span>
                        )}
                        <h3
                          id="history-detail-modal-title"
                          className="text-base font-bold text-foreground leading-snug truncate"
                        >
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
                    <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-700 dark:text-red-400">
                      <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-semibold text-red-800 dark:text-red-300">
                          Motivo do cancelamento
                        </p>
                        <p className="mt-0.5 text-muted-foreground leading-relaxed">
                          {entry.cancellationReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Counterpart Card (Provider or Client) */}
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                        {entry.counterpartAvatarUrl && !avatarError ? (
                          <Image
                            src={entry.counterpartAvatarUrl}
                            alt={entry.counterpartName}
                            width={44}
                            height={44}
                            className="h-full w-full object-cover"
                            onError={() => setAvatarError(true)}
                          />
                        ) : (
                          <span className="text-sm font-bold text-primary">
                            {entry.counterpartName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                          {entry.counterpartRole === "prestador" ? "Prestador" : "Cliente Contratante"}
                        </span>
                        <p className="text-sm font-bold text-foreground">
                          {entry.counterpartName}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/chats"
                      className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-xs"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Chat</span>
                    </Link>
                  </div>

                  {/* Scheduling & Location Information */}
                  <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3.5 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Informações de Atendimento
                    </h4>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex items-start gap-2.5">
                        <Calendar className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-[11px] text-muted-foreground">Data do serviço</p>
                          <p className="text-xs font-medium text-foreground leading-tight">
                            {capitalizedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Clock className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-[11px] text-muted-foreground">Horário e duração</p>
                          <p className="text-xs font-medium text-foreground leading-tight">
                            {entry.time ? `${entry.time}` : "Horário comercial"}
                            {entry.duration ? ` (${entry.duration})` : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {entry.address && (
                      <div className="flex items-start gap-2.5 border-t border-border/60 pt-3">
                        <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-[11px] text-muted-foreground">Local de atendimento</p>
                          <p className="text-xs font-medium text-foreground leading-tight">
                            {entry.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Summary */}
                  <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3 shadow-xs">
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

                      <div className="flex justify-between border-t border-border/60 pt-2 text-sm font-bold text-foreground">
                        <span>Total</span>
                        <span>{currencyFormatter.format(totalPrice)}</span>
                      </div>

                      {entry.paymentMethod && (
                        <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs text-muted-foreground">
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
                    <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
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
        </div>
      )}
    </AnimatePresence>
  );
}
