import { BellOff } from "lucide-react";

interface NotificationsEmptyStateProps {
  filter: "all" | "unread";
}

export function NotificationsEmptyState({
  filter,
}: NotificationsEmptyStateProps) {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
        <BellOff className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        {filter === "unread"
          ? "Nenhuma notificação não lida"
          : "Nenhuma notificação por aqui"}
      </h3>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        {filter === "unread"
          ? "Você leu todas as notificações recentes. Bom trabalho!"
          : "Quando você receber atualizações de agendamentos, mensagens ou pagamentos, elas aparecerão aqui."}
      </p>
    </div>
  );
}
