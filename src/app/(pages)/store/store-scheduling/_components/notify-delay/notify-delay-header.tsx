"use client";

import { AlertTriangle, X } from "lucide-react";

interface NotifyDelayHeaderProps {
  onClose: () => void;
}

export function NotifyDelayHeader({ onClose }: NotifyDelayHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <AlertTriangle className="size-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Notificar Atraso aos Clientes
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Envie o motivo e novo horário. O cliente poderá aceitar, reagendar com prioridade ou receber reembolso.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
        aria-label="Fechar"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}
