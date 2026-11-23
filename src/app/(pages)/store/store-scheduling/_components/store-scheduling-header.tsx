"use client";

import { AlertTriangle } from "lucide-react";

interface StoreSchedulingHeaderProps {
  onOpenDelayModal: () => void;
}

export function StoreSchedulingHeader({ onOpenDelayModal }: StoreSchedulingHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Header da Página com Botão de Notificar Atraso Sempre Visível */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Gerencie os agendamentos da loja
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Selecione um dia para ver os detalhes ou notifique imprevistos
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenDelayModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-700 dark:text-amber-300 transition-colors hover:bg-amber-500/20 cursor-pointer shadow-xs shrink-0"
        >
          <AlertTriangle className="size-4" />
          Avisar Atraso / Reagendar
        </button>
      </div>
    </div>
  );
}
