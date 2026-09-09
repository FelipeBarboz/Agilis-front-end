"use client";

import { BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyNotificationsProps {
  filter?: "all" | "unread";
  onClearFilter?: () => void;
}

export function EmptyNotifications({
  filter = "all",
  onClearFilter,
}: EmptyNotificationsProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4 shadow-xs">
        <BellOff className="h-8 w-8" />
      </div>

      <h2 className="text-lg font-semibold text-foreground">
        {filter === "unread"
          ? "Nenhuma notificação não lida"
          : "Nenhuma notificação por aqui"}
      </h2>

      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {filter === "unread"
          ? "Você leu todas as notificações recentes. Bom trabalho!"
          : "Quando você receber atualizações de agendamentos, mensagens ou pagamentos, elas aparecerão aqui."}
      </p>

      {filter === "unread" && onClearFilter && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilter}
          className="mt-4"
        >
          Ver todas as notificações
        </Button>
      )}
    </div>
  );
}