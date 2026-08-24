import { BellOff } from "lucide-react";

export function EmptyNotifications() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <BellOff className="h-8 w-8 text-muted-foreground" />
      <h2 className="text-base font-semibold text-foreground">
        Nenhuma notificação por aqui
      </h2>
      <p className="text-sm text-muted-foreground">
        Quando algo acontecer com seus agendamentos ou pagamentos, você verá
        as novidades aqui.
      </p>
    </div>
  );
}